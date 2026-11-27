import express, { NextFunction, Request, Response } from 'express';
import {
  createAdminAccount,
  createAffiliate,
  createCustomer,
  createLead,
  createSalesFromEntry,
  findAffiliateByAuthUser,
  generateMonthlyPayouts,
  getAdminOverview,
  getAffiliatePortalData,
  getAuthConfigStatus,
  listAdminAccounts,
  loginAdminLocal,
  loginAffiliateLocal,
  previewMonthlyPayouts,
  registerAffiliateAccount,
  removeAdminAccount,
  reverseSale,
  reviewApplication,
  ServiceError,
  setupInitialAdminPassword,
  submitAffiliateInvoice,
  submitApplication,
  updateAffiliate,
  updateLeadStatus,
  updatePayoutStatus,
} from './affiliateService.js';
import { verifySessionToken } from './auth.js';
import {
  getSqliteDb,
  getSupabaseAdmin,
  getSupabaseBaseAdminClient,
  getSupabaseConfig,
  isConfiguredAdminEmail,
  requestAuthStorage,
} from './db.js';
import { AffiliateStatus } from '../src/types/affiliate.js';

interface AuthenticatedRequest extends Request {
  authRole?: 'admin' | 'affiliate';
  authEmail?: string;
  affiliateId?: string;
  affiliateStatus?: 'active' | 'disabled' | 'pending_approval';
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

async function isEmailInAdminDirectory(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  if (!norm) return false;
  if (isConfiguredAdminEmail(norm)) return true;

  try {
    const db = getSqliteDb();
    const row = db
      .prepare('SELECT id FROM admin_users WHERE lower(email) = ?')
      .get(norm) as { id?: string } | undefined;
    if (row?.id) return true;
  } catch {
    // ignore if SQLite unavailable
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .ilike('email', norm)
        .maybeSingle();
      if (data?.id) return true;
    } catch {
      // ignore if public.admin_users table not yet created
    }
  }
  return false;
}

async function resolveAuth(req: AuthenticatedRequest): Promise<boolean> {
  const token = extractBearerToken(req);
  if (!token) return false;

  const store = requestAuthStorage.getStore();
  if (store) {
    store.token = token;
  }

  // First check if token is a locally signed HMAC session token
  const localSession = verifySessionToken(token);
  if (localSession) {
    req.authRole = localSession.role;
    req.authEmail = localSession.email;
    req.affiliateId = localSession.affiliateId;
    if (store) {
      store.role = localSession.role;
      store.email = localSession.email;
    }

    if (localSession.role === 'affiliate' && localSession.affiliateId) {
      try {
        const db = getSqliteDb();
        const aff = db
          .prepare('SELECT status FROM affiliates WHERE id = ?')
          .get(localSession.affiliateId) as { status?: AffiliateStatus } | undefined;
        if (aff) {
          req.affiliateStatus = aff.status;
        }
      } catch {
        // ignore sqlite lookup errors in supabase mode
      }
    }
    return true;
  }

  const supabase = getSupabaseBaseAdminClient() || getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return false;
    const user = data.user;
    const appRole =
      (user.app_metadata?.role as string | undefined) ||
      (user.user_metadata?.role as string | undefined);

    const isAdminUser =
      appRole === 'admin' ||
      isConfiguredAdminEmail(user.email) ||
      (await isEmailInAdminDirectory(user.email));

    if (isAdminUser) {
      req.authRole = 'admin';
      req.authEmail = user.email || 'admin@kreativalab.ch';
      if (store) {
        store.role = 'admin';
        store.email = req.authEmail;
        store.userId = user.id;
      }

      // Auto-sync app_metadata.role = 'admin' in background if service_role is available
      const cfg = getSupabaseConfig();
      if (cfg.isServiceRole && user.app_metadata?.role !== 'admin') {
        void supabase.auth.admin
          .updateUserById(user.id, {
            app_metadata: { ...(user.app_metadata || {}), role: 'admin' },
          })
          .catch(() => {});
      }
      return true;
    }

    const aff = await findAffiliateByAuthUser(user.id, user.email);
    if (aff) {
      req.authRole = 'affiliate';
      req.authEmail = aff.email;
      req.affiliateId = aff.id;
      req.affiliateStatus = aff.status;
      if (store) {
        store.role = 'affiliate';
        store.email = aff.email;
        store.userId = user.id;
      }
      return true;
    }
    return false;
  }

  return false;
}

function asyncHandler(
  fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: unknown) => {
      if (err instanceof ServiceError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      const message = err instanceof Error ? err.message : 'Errore interno del server.';
      res.status(500).json({ error: message });
    });
  };
}

async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ok = await resolveAuth(req);
  if (!ok) {
    res.status(401).json({ error: 'Autenticazione richiesta.' });
    return;
  }
  if (req.authRole !== 'admin') {
    res.status(403).json({ error: 'Accesso riservato agli amministratori.' });
    return;
  }
  next();
}

async function requireAffiliate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ok = await resolveAuth(req);
  if (!ok) {
    res.status(401).json({ error: 'Accesso agente richiesto.' });
    return;
  }
  if (req.authRole !== 'affiliate' || !req.affiliateId) {
    res.status(403).json({ error: 'Account non associato a un profilo agente.' });
    return;
  }
  if (req.affiliateStatus && req.affiliateStatus !== 'active') {
    res.status(403).json({
      error:
        req.affiliateStatus === 'pending_approval'
          ? 'Account in attesa di approvazione da Kreativalab.'
          : 'Account agente disabilitato. Contatta Kreativalab.',
    });
    return;
  }
  next();
}

export function createAffiliateRouter(): express.Router {
  const router = express.Router();
  router.use((req, _res, next) => {
    const token = extractBearerToken(req) || undefined;
    requestAuthStorage.run({ token }, () => {
      const bodyReq = req as Request & { _body?: boolean };
      if (bodyReq.body !== undefined) {
        if (typeof bodyReq.body === 'string') {
          try {
            bodyReq.body = JSON.parse(bodyReq.body);
            bodyReq._body = true;
          } catch {
            // Let express.json() handle malformed payload or empty body
          }
        } else if (typeof bodyReq.body === 'object') {
          bodyReq._body = true;
        }
      }
      next();
    });
  });
  router.use(express.json({ limit: '1mb' }));

  // Public auth status & login routes
  router.get(
    '/auth/status',
    asyncHandler(async (_req, res) => {
      const status = await getAuthConfigStatus();
      res.json(status);
    })
  );

  router.post(
    '/auth/setup-admin',
    asyncHandler(async (req, res) => {
      const password = typeof req.body?.password === 'string' ? req.body.password : '';
      const result = setupInitialAdminPassword(password);
      res.status(201).json(result);
    })
  );

  router.post(
    '/auth/create-admin',
    asyncHandler(async (req, res) => {
      const hasAuth = await resolveAuth(req).catch(() => false);
      const result = await createAdminAccount({
        email: typeof req.body?.email === 'string' ? req.body.email : '',
        password: typeof req.body?.password === 'string' ? req.body.password : '',
        master_passcode: typeof req.body?.master_passcode === 'string' ? req.body.master_passcode : undefined,
        requester_is_admin: hasAuth && req.authRole === 'admin',
      });
      res.status(201).json(result);
    })
  );

  router.post(
    '/auth/admin-login',
    asyncHandler(async (req, res) => {
      const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
      const email = typeof req.body?.email === 'string' ? req.body.email : undefined;
      const result = loginAdminLocal(passcode, email);
      res.json(result);
    })
  );

  router.post(
    '/auth/register',
    asyncHandler(async (req, res) => {
      const result = await registerAffiliateAccount({
        name: typeof req.body?.name === 'string' ? req.body.name : '',
        email: typeof req.body?.email === 'string' ? req.body.email : '',
        password: typeof req.body?.password === 'string' ? req.body.password : '',
        phone: typeof req.body?.phone === 'string' ? req.body.phone : undefined,
        company_name: typeof req.body?.company_name === 'string' ? req.body.company_name : undefined,
        canton: typeof req.body?.canton === 'string' ? req.body.canton : '',
        accept_terms: Boolean(req.body?.accept_terms),
      });
      res.status(201).json(result);
    })
  );

  router.post(
    '/auth/affiliate-login',
    asyncHandler(async (req, res) => {
      const email = typeof req.body?.email === 'string' ? req.body.email : '';
      const password = typeof req.body?.password === 'string' ? req.body.password : '';
      const result = await loginAffiliateLocal(email, password);
      res.json(result);
    })
  );

  router.get(
    '/auth/me',
    asyncHandler(async (req, res) => {
      const ok = await resolveAuth(req);
      if (!ok) {
        res.status(401).json({ error: 'Sessione non valida.' });
        return;
      }
      if (req.authRole === 'affiliate' && req.affiliateStatus && req.affiliateStatus !== 'active') {
        res.status(403).json({
          error:
            req.affiliateStatus === 'pending_approval'
              ? 'Account in attesa di approvazione da Kreativalab.'
              : 'Account agente disabilitato. Contatta Kreativalab.',
        });
        return;
      }
      res.json({
        role: req.authRole,
        email: req.authEmail,
        affiliateId: req.affiliateId ?? null,
      });
    })
  );

  // Public application submission
  router.post(
    '/applications',
    asyncHandler(async (req, res) => {
      const created = await submitApplication(req.body ?? {});
      res.status(201).json({ application: created });
    })
  );

  // ---------------- ADMIN ROUTES ----------------
  router.get(
    '/admin/overview',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const overview = await getAdminOverview(req.authEmail);
      res.json(overview);
    })
  );

  router.get(
    '/admin/admins',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const admins = await listAdminAccounts(req.authEmail);
      res.json({ admins });
    })
  );

  router.post(
    '/admin/admins',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const created = await createAdminAccount({
        email: typeof req.body?.email === 'string' ? req.body.email : '',
        password: typeof req.body?.password === 'string' ? req.body.password : '',
        requester_is_admin: true,
      });
      const admins = await listAdminAccounts(req.authEmail);
      res.status(201).json({ admin: created, admins });
    })
  );

  router.delete(
    '/admin/admins/:id',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const result = await removeAdminAccount(String(req.params.id), req.authEmail);
      const admins = await listAdminAccounts(req.authEmail);
      res.json({ removed: result.removed, admins });
    })
  );

  router.post(
    '/admin/affiliates',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const affiliate = await createAffiliate(req.body ?? {});
      res.status(201).json({ affiliate });
    })
  );

  router.patch(
    '/admin/affiliates/:id',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const affiliate = await updateAffiliate(String(req.params.id), req.body ?? {}, true);
      res.json({ affiliate });
    })
  );

  router.post(
    '/admin/applications/:id/review',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const action = req.body?.action === 'reject' ? 'reject' : 'approve';
      const result = await reviewApplication(String(req.params.id), action, req.body ?? {});
      res.json(result);
    })
  );

  router.post(
    '/admin/leads',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const affiliateId = typeof req.body?.affiliate_id === 'string' ? req.body.affiliate_id : '';
      if (!affiliateId) throw new ServiceError(400, 'Seleziona l’agente proprietario del lead.');
      const lead = await createLead({ ...(req.body ?? {}), affiliate_id: affiliateId });
      res.status(201).json({ lead });
    })
  );

  router.patch(
    '/admin/leads/:id',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const status = req.body?.status;
      if (!['registered', 'in_progress', 'won', 'lost', 'expired'].includes(status)) {
        throw new ServiceError(400, 'Stato lead non valido.');
      }
      const lead = await updateLeadStatus(String(req.params.id), status, req.body?.notes);
      res.json({ lead });
    })
  );

  router.post(
    '/admin/customers',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const affiliateId = typeof req.body?.affiliate_id === 'string' ? req.body.affiliate_id : '';
      if (!affiliateId) throw new ServiceError(400, 'Seleziona l’agente.');
      const customer = await createCustomer({ ...(req.body ?? {}), affiliate_id: affiliateId });
      res.status(201).json({ customer });
    })
  );

  router.post(
    '/admin/sales',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const sales = await createSalesFromEntry(req.body ?? {});
      res.status(201).json({ sales });
    })
  );

  router.post(
    '/admin/sales/:id/reverse',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const reason = typeof req.body?.reversed_reason === 'string' ? req.body.reversed_reason : '';
      const sale = await reverseSale(String(req.params.id), reason);
      res.json({ sale });
    })
  );

  router.get(
    '/admin/payouts/preview',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const period = typeof req.query.period === 'string' ? req.query.period : '';
      const previews = await previewMonthlyPayouts(period);
      res.json({ previews });
    })
  );

  router.post(
    '/admin/payouts/generate',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const period = typeof req.body?.period_month === 'string' ? req.body.period_month : '';
      const result = await generateMonthlyPayouts(period);
      res.status(201).json(result);
    })
  );

  router.patch(
    '/admin/payouts/:id',
    requireAdmin,
    asyncHandler(async (req, res) => {
      const payout = await updatePayoutStatus(String(req.params.id), req.body ?? {});
      res.json({ payout });
    })
  );

  // ---------------- AFFILIATE PORTAL ROUTES ----------------
  router.get(
    '/portal/me',
    requireAffiliate,
    asyncHandler(async (req, res) => {
      const data = await getAffiliatePortalData(req.affiliateId!);
      res.json(data);
    })
  );

  router.patch(
    '/portal/profile',
    requireAffiliate,
    asyncHandler(async (req, res) => {
      const updated = await updateAffiliate(req.affiliateId!, req.body ?? {}, false);
      res.json({ affiliate: updated });
    })
  );

  router.post(
    '/portal/leads',
    requireAffiliate,
    asyncHandler(async (req, res) => {
      const lead = await createLead({
        ...(req.body ?? {}),
        affiliate_id: req.affiliateId!,
      });
      res.status(201).json({ lead });
    })
  );

  router.post(
    '/portal/payouts/:id/invoice',
    requireAffiliate,
    asyncHandler(async (req, res) => {
      const payout = await submitAffiliateInvoice(req.affiliateId!, String(req.params.id), {
        agent_invoice_number: String(req.body?.agent_invoice_number ?? ''),
        agent_invoice_date: String(req.body?.agent_invoice_date ?? ''),
      });
      res.json({ payout });
    })
  );

  router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ServiceError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Errore interno del server.';
    res.status(500).json({ error: message });
  });

  return router;
}

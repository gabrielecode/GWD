import express, { NextFunction, Request, Response } from 'express';
import process from 'node:process';
import {
  createAffiliate,
  createCustomer,
  createLead,
  createSalesFromEntry,
  findAffiliateByAuthUser,
  generateMonthlyPayouts,
  getAdminOverview,
  getAffiliatePortalData,
  getAuthConfigStatus,
  loginAdminLocal,
  loginAffiliateLocal,
  previewMonthlyPayouts,
  reverseSale,
  reviewApplication,
  ServiceError,
  setupInitialAdminPassword,
  submitAffiliateInvoice,
  submitApplication,
  updateAffiliate,
  updateLeadStatus,
  updatePayoutStatus,
} from './affiliateService';
import { verifySessionToken } from './auth';
import { getSupabaseAdmin } from './db';

interface AuthenticatedRequest extends Request {
  authRole?: 'admin' | 'affiliate';
  authEmail?: string;
  affiliateId?: string;
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

async function resolveAuth(req: AuthenticatedRequest): Promise<boolean> {
  const token = extractBearerToken(req);
  if (!token) return false;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return false;
    const user = data.user;
    const appRole =
      (user.app_metadata?.role as string | undefined) ||
      (user.user_metadata?.role as string | undefined);
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (appRole === 'admin' || (adminEmail && user.email?.toLowerCase() === adminEmail)) {
      req.authRole = 'admin';
      req.authEmail = user.email || 'admin@kreativalab.ch';
      return true;
    }

    const aff = await findAffiliateByAuthUser(user.id, user.email);
    if (aff) {
      req.authRole = 'affiliate';
      req.authEmail = aff.email;
      req.affiliateId = aff.id;
      return true;
    }
    return false;
  }

  const session = verifySessionToken(token);
  if (!session) return false;
  req.authRole = session.role;
  req.authEmail = session.email;
  req.affiliateId = session.affiliateId;
  return true;
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
  next();
}

export function createAffiliateRouter(): express.Router {
  const router = express.Router();
  router.use((req, _res, next) => {
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
  router.use(express.json({ limit: '1mb' }));

  // Public auth status & login routes
  router.get('/auth/status', (_req, res) => {
    res.json(getAuthConfigStatus());
  });

  router.post(
    '/auth/setup-admin',
    asyncHandler(async (req, res) => {
      const password = typeof req.body?.password === 'string' ? req.body.password : '';
      const result = setupInitialAdminPassword(password);
      res.status(201).json(result);
    })
  );

  router.post(
    '/auth/admin-login',
    asyncHandler(async (req, res) => {
      const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
      const result = loginAdminLocal(passcode);
      res.json(result);
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
    asyncHandler(async (_req, res) => {
      const overview = await getAdminOverview();
      res.json(overview);
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

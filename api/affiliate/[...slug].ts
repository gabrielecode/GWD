import express from 'express';
import { createAffiliateRouter } from '../../server/router';

const app = express();
app.use('/api/affiliate', createAffiliateRouter());

export default app;

import express from 'express';

import cors from 'cors';

import { router } from './routes/index.mjs';

const app = express();

app.use(cors());

app.use(router);

export { app };

import cors from 'cors';
import express from 'express';

import { config } from './config/wawita.config.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const { protocol, host, port } = config.server;
const serverUrl = `${protocol}://${host}:${port}`;

const { prefix, version } = config.api;
const apiBasePath = `${prefix}/${version}`;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.auth,
    credentials: true,
  })
);

app.use(`${apiBasePath}/auth`, authRoutes);
app.use(`${apiBasePath}/users`, userRoutes);

const server = app.listen(port, () => {
  console.info(`Server on fire 🔥 ${serverUrl}`);
});

export default server;

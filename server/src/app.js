import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.status(200).json({ ok: true, message: 'Server is running' });
});

app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("Backend working");
});

app.use('/api/auth', authRoutes);

export default app;

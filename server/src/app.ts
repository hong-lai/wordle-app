import express, { type NextFunction, type Request, type Response } from 'express'
import session from 'express-session';
import wordleMiddleware from './middlewares/wordle.middleware';
import wordleRoute from './routes/wordle.route'
import cors from 'cors';
import path from 'node:path';
import config from './config';
import pino from 'pino-http';
import helmet from 'helmet';

const isDevelopment = config.NODE_ENV === 'development';
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173"

const app = express()

if (isDevelopment) {
  app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
  }));
}

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use(session({
  secret: 'iloveCat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: !isDevelopment,
    maxAge: 60 * 60 * 1000, // session expires after 60 mins
    sameSite: isDevelopment ? 'lax' : 'strict',
  },
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(pino({
  level: 'fatal'
}));

app.use(wordleMiddleware.registerSession);
app.use('/api/v1', wordleRoute)

app.use((_req, res, _next) => {
  res.sendStatus(404)
});

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ success: false, message: error.message, path: req.url });
});

export default app;

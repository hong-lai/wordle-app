import dotenv from 'dotenv';
dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '5555')
};
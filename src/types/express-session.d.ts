import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      name: string;
      privilege: string;
      cefr: string;
      token: string;
    };
  }
}
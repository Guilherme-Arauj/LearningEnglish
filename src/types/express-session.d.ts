import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      name: string;
      privilege: string;
      cefr: string;
      timeline: number;
      firstAccess: boolean;
      token: string;
    };
  }
}
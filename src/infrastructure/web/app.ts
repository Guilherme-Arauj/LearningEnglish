import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import express, { Application } from 'express';
import { userRouter } from './routes/user';
import { adminRouter } from './routes/admin';
import { studentRouter } from './routes/student';
import cors from 'cors';

const app: Application = express();

// Middleware para permitir requisições de diferentes origens
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,            
    cookie: { secure: false }
}));

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// Configura as rotas da API
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/student', studentRouter);

export default app;
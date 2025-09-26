import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import express, { Application } from "express";
import { userRouter } from "./routes/user";
import { adminRouter } from "./routes/admin";
import { studentRouter } from "./routes/student";
import { videoRoutes } from "./routes/video";
import cors from "cors";
import { SESSION_SECRET } from "../env/envConfig";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app: Application = express();

// Set HTTP headers
app.use(helmet());

// Middleware para permitir requisições de diferentes origens
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

app.use(
  session({
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,   // true só em produção com HTTPS
      sameSite: "lax"  // "none" + secure:true se quiser cross-site
    },
  })
);
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

// Middleware para processar JSON no corpo das requisições
app.use(morgan("dev"));
app.use(express.json());

app.use(limiter);
// Configura as rotas da API
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/videos", videoRoutes);

export default app;

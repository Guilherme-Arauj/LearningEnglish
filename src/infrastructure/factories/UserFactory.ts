import { UserRepository } from "../../application/usecases/repositories/UserRepository";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserController } from "../web/controllers/UserController";
import { IUserRepository } from "../../application/usecases/repositories/IUserRepository";
import { IBcryptConfig } from "../utils/bcrypt/IBcryptConfig";
import { BcryptConfig } from "../utils/bcrypt/BcryptConfig";
import { IUuidConfig } from "../utils/uuid/IUuidConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";
import { IPrismaConfig } from "../database/IPrismaConfig";
import { PrismaConfig } from "../database/PrismaConfig";
import { Login } from "../../application/usecases/Login";
import { IJwtConfig } from "../utils/jwt/IJwtConfig";
import { JwtConfig } from "../utils/jwt/JwtConfig";
import { SECRET_KEY } from "../env/envConfig";
import { RecuperarSenha } from "../../application/usecases/RecuperarSenha";
import { IMailer } from "../utils/nodemailer/IMailer";
import Mailer from "../utils/nodemailer/Mailer";
import { IResetPasswordEmail } from "../utils/nodemailer/recuperarSenhaMail/IResetPasswordEmail";
import { ResetPasswordEmail } from "../utils/nodemailer/recuperarSenhaMail/ResetPasswordEmail";



export function UserFactory(): UserController {
    const prismaConfig: IPrismaConfig = new PrismaConfig();
    const secretKey = SECRET_KEY as string;
    const userRepository: IUserRepository = new UserRepository(prismaConfig);
    const bcryptConfig: IBcryptConfig = new BcryptConfig();
    const uuidConfig: IUuidConfig = new UuidConfig();
    const jwtConfig: IJwtConfig = new JwtConfig(secretKey);
    const mailer: IMailer = new Mailer();
    const mailerTemplate: IResetPasswordEmail = new ResetPasswordEmail
    
    const recuperarSenhaUseCase = new RecuperarSenha(
        userRepository, 
        mailer, 
        jwtConfig, 
        mailerTemplate
    );
    const createUserUseCase = new CreateUser(
        userRepository, 
        bcryptConfig, 
        uuidConfig
    );
    const loginUseCase = new Login(
        userRepository, 
        bcryptConfig, 
        jwtConfig
    );

    return new UserController(
        createUserUseCase, 
        loginUseCase, 
        recuperarSenhaUseCase
    ); // Controller recebe os Use Cases
}

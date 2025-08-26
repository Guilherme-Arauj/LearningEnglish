import { UserRepository } from "../../application/services/repositories/UserRepository";
import { UserService } from "../../application/services/UserService";
import { UserController } from "../web/controllers/UserController";
import { IUserRepository } from "../../application/services/repositories/IUserRepository";
import { IBcryptConfig } from "../utils/bcrypt/IBcryptConfig";
import { BcryptConfig } from "../utils/bcrypt/BcryptConfig";
import { IUuidConfig } from "../utils/uuid/IUuidConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";
import { IPrismaConfig } from "../database/IPrismaConfig";
import { PrismaConfig } from "../database/PrismaConfig";
import { IJwtConfig } from "../utils/jwt/IJwtConfig";
import { JwtConfig } from "../utils/jwt/JwtConfig";
import { SECRET_KEY } from "../env/envConfig";
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
    const mailerTemplate: IResetPasswordEmail = new ResetPasswordEmail();
    
    const userService = new UserService(
        userRepository,
        bcryptConfig,
        jwtConfig,
        uuidConfig,
        mailer,
        mailerTemplate
    );

    return new UserController(userService); 
}
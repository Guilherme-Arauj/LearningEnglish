import { IJwtConfig } from "../../infrastructure/utils/jwt/IJwtConfig";
import { IMailer } from "../../infrastructure/utils/nodemailer/IMailer";
import { IResetPasswordEmail } from "../../infrastructure/utils/nodemailer/recuperarSenhaMail/IResetPasswordEmail";
import { UserEmailDTO } from "../dto/UserEmailDTO";
import { IUserRepository } from "./repositories/IUserRepository";

export class RecuperarSenha {
  constructor(
    private userRepository: IUserRepository,
    private mailer: IMailer,
    private jwtConfig: IJwtConfig,
    private mailerTemplate: IResetPasswordEmail
  ) {}

  public async execute(dto: UserEmailDTO): Promise<void> {
    const userValidation = await this.userRepository.findUserByEmail(dto.email);

    if (!userValidation) {
      throw new Error("[Usuário não encontrado no banco de dados]");
    }

    const token = this.jwtConfig.sign(
      { id: userValidation.id, email: userValidation.email },
      { expiresIn: "15m" }
    );

    const url = `http://localhost:4000/users/redefinirSenha??token=${token}`;

    const html = this.mailerTemplate.generate(url);

    this.mailer
      .sendMail(dto.email, "Recuperação de senha", html)
      .catch((err) => {
        console.error("[Erro ao enviar e-mail de recuperação de senha]", err);
      });
  }
}

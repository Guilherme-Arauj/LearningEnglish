import { User } from "../../domain/entities/User";
import { IBcryptConfig } from "../../infrastructure/utils/bcrypt/IBcryptConfig";
import { IJwtConfig } from "../../infrastructure/utils/jwt/IJwtConfig";
import { IMailer } from "../../infrastructure/utils/nodemailer/IMailer";
import { IResetPasswordEmail } from "../../infrastructure/utils/nodemailer/recuperarSenhaMail/IResetPasswordEmail";
import { IUuidConfig } from "../../infrastructure/utils/uuid/IUuidConfig";
import { AddStudyTimeDTO } from "../dto/studentUser/AddStudyTimeDTO";
import { DeleteUserDTO } from "../dto/user/DeleteUserDTO";
import { LoggedUserDTO } from "../dto/user/LoggedUserDTO";
import { TimelineDTO } from "../dto/studentUser/TimelineDTO";
import { UserDTO } from "../dto/user/UserDTO";
import { UserEmailDTO } from "../dto/user/UserEmailDTO";
import { UserLoginDTO } from "../dto/user/UserLoginDTO";
import { UserNewPasswordDTO } from "../dto/user/UserNewPasswordDTO";
import { UserResponseDTO } from "../dto/user/UserResponseDTO";
import { UserUpdateDTO } from "../dto/user/UserUpdateDTO";
import { IUserRepository } from "./repositories/IUserRepository";

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private bcryptConfig: IBcryptConfig,
    private jwtConfig: IJwtConfig,
    private uuidConfig: IUuidConfig,
    private mailer: IMailer,
    private mailerTemplate: IResetPasswordEmail
  ) {}

  //---

  public async createUser(dto: UserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new Error("Email de usuário já presente no Banco de dados");
    }

    if (!User.isStrongPassword(dto.password)) {
      throw new Error("A senha não é forte o suficiente!");
    }

    const hashedPassword = await this.bcryptConfig.hash(dto.password, 10);

    const id =
      dto.privilege === "student"
        ? await this.uuidConfig.generateStudentId()
        : await this.uuidConfig.generateAdminId();

    const user = new User({
      id: id,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      cefr: dto.cefr,
      privilege: dto.privilege,
      timeSpentSeconds: 0,
      firstAccess: true,
    });
    const savedUser = await this.userRepository.create(user);

    return UserResponseDTO.fromUser(savedUser);
  }

    public async adminCreateUser(dto: UserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new Error("Email de usuário já presente no Banco de dados");
    }

    if (!User.isStrongPassword(dto.password)) {
      throw new Error("A senha não é forte o suficiente!");
    }

    const hashedPassword = await this.bcryptConfig.hash(dto.password, 10);

    const id =
      dto.privilege === "student"
        ? await this.uuidConfig.generateStudentId()
        : await this.uuidConfig.generateAdminId();

    const user = new User({
      id: id,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      cefr: dto.cefr,
      privilege: dto.privilege,
      timeSpentSeconds: 0,
      firstAccess: true,
    });
    const savedUser = await this.userRepository.create(user);

    return UserResponseDTO.fromUser(savedUser);
  }

  // ---

  public async deleteUser(dto: DeleteUserDTO): Promise<UserResponseDTO | null> {
    const deletedUser = await this.userRepository.deleteUserById(dto.id);

    if (!deletedUser) {
      return null;
    }

    return UserResponseDTO.fromUser(deletedUser);
  }

  // ---

  public async login(dto: UserLoginDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new Error("Usuário não encontrado no banco de dados");
    }

    const passwordMatch = await this.bcryptConfig.compare(
      dto.password,
      user.password
    );
    if (!passwordMatch) {
      throw new Error("Senha incorreta");
    }

    const token = this.jwtConfig.sign(
      { id: user.id, email: user.email,},
      { expiresIn: "2h" }
    );

    const response = UserResponseDTO.fromUserWithToken(user, token);

    return response;
  }

  // ---

  public async passwordRecuperation(dto: UserEmailDTO): Promise<void> {
    const user = await this.userRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new Error("Usuário não encontrado no banco de dados");
    }

    const token = this.jwtConfig.sign(
      { id: user.id, email: user.email },
      { expiresIn: "15m" }
    );

    const url = `${process.env.FRONTEND_URL}:${token}`;

    const html = this.mailerTemplate.generate(url);

    try {
      await this.mailer.sendMail(dto.email, "Recuperação de senha", html);
    } catch (err) {
      console.error("Erro ao enviar e-mail de recuperação de senha:", err);
      throw new Error(
        "Não foi possível enviar o e-mail de recuperação de senha. Tente novamente mais tarde."
      );
    }
  }

  // ---

  public async passwordRedefinition(
    dto: UserNewPasswordDTO
  ): Promise<UserResponseDTO> {
    const user = await this.userRepository.findUserById(dto.id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!User.isStrongPassword(dto.password)) {
      throw new Error("A senha não é forte o suficiente!");
    }

    const hashedPassword = await this.bcryptConfig.hash(dto.password, 10);
    user.hashedPassword = hashedPassword;

    const updatedUser = await this.userRepository.updateUser(user);

    return UserResponseDTO.fromUser(updatedUser);
  }

  // ---

  public async updateUser(dto: UserUpdateDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findUserById(dto.id);
    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findUserByEmail(dto.email);
      if (emailExists) {
        throw new Error("Email já está em uso por outro usuário");
      }
    }

    if (dto.password && !User.isStrongPassword(dto.password)) {
      throw new Error("A senha não é forte o suficiente!");
    }

    let hashedPassword: string | undefined;
    if (dto.password) {
      hashedPassword = await this.bcryptConfig.hash(dto.password, 10);
    }

    const updateMethods = {
      name: (user: User, value: string) => user.name = value,
      email: (user: User, value: string) => user.email = value,
      cefr: (user: User, value: string) => user.cefr = value,
      privilege: (user: User, value: string) => user.privilege = value,
    } as const;

    (
      Object.entries(updateMethods) as Array<[
          keyof typeof updateMethods,
          (typeof updateMethods)[keyof typeof updateMethods]
        ]>
    ).forEach(([field, updateFn]) => {
      if (dto[field] !== undefined) {
        updateFn(existingUser, dto[field]);
      }
    });

    if (hashedPassword) {
      existingUser.hashedPassword = hashedPassword;
    }

    const savedUser = await this.userRepository.updateUser(existingUser);
    return UserResponseDTO.fromUser(savedUser);
  }

  // ---

  public async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getAllUsers();

    return users.map((user) => {
      return UserResponseDTO.fromUser(user);
    });
  }

  // ---

  public async addStudyTimeToUser(dto: AddStudyTimeDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findUserById(dto.userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    user.timeSpentSeconds = dto.timeToAdd;
    const updatedUser = await this.userRepository.updateUser(user);

    return UserResponseDTO.fromUser(updatedUser);
  }

  // ---

  public async updateTimeline(dto: TimelineDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findUserById(dto.id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    user.timeline = dto.timeline;
    user.firstAccess = false
    const updatedUser = await this.userRepository.updateUser(user);

    return UserResponseDTO.fromUser(updatedUser);
  }

  public async getLoggedUser(dto: LoggedUserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findUserById(dto.id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return UserResponseDTO.fromUser(user);
  }
}

import { User } from "../../domain/entities/User";
import { IUserRepository } from "./repositories/IUserRepository";
import { UserUpdateDTO } from "../dto/UserUpdateDTO";
import { UserResponseDTO } from "../dto/UserResponseDTO";
import { IBcryptConfig } from "../../infrastructure/utils/bcrypt/IBcryptConfig";

export class UpdateUser {
  constructor(
    private userRepository: IUserRepository,
    private bcryptConfig: IBcryptConfig
  ) {}

  public async execute(dto: UserUpdateDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findUserById(dto.id);
    if (!existingUser) {
      throw new Error("[Usuário não encontrado]");
    }

    let hashedPassword = existingUser.password;
    if (dto.password) {
      hashedPassword = await this.bcryptConfig.hash(dto.password, 10);
    }

    const updatedUser = new User({
      id: existingUser.id,
      name: dto.name ?? existingUser.name,
      email: dto.email ?? existingUser.email,
      password: hashedPassword,
      privilege: dto.privilege ?? existingUser.privilege,
      cefr: dto.cefr ?? existingUser.cefr,
      userQuestionProgress: existingUser.userQuestionProgress
    });

    const savedUser = await this.userRepository.updateUser(updatedUser);

    return new UserResponseDTO(
      savedUser.id,
      savedUser.name,
      savedUser.email,
      savedUser.privilege,
      savedUser.cefr
    );
  }
}
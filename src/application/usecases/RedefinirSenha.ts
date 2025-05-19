import { UserNewPasswordDTO } from "../dto/UserNewPasswordDTO";
import { IUserRepository } from "./repositories/IUserRepository";
import { BcryptConfig } from "../../infrastructure/utils/bcrypt/BcryptConfig";
import { UserResponseDTO } from "../dto/UserResponseDTO";

export class RedefinirSenha {
  constructor(
    private userRepository: IUserRepository,
    private bcryptConfig: BcryptConfig
  ) {}

  public async execute(dto: UserNewPasswordDTO): Promise<UserResponseDTO> {

    const hashedPassword = await this.bcryptConfig.hash(dto.password, 10);

    const updatedUser = await this.userRepository.changePassword(dto.id, hashedPassword);

    return new UserResponseDTO(
      updatedUser.id, 
      updatedUser.name, 
      updatedUser.email, 
      updatedUser.privilege, 
      updatedUser.cefr
    );  
  }
}

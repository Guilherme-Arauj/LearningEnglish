// DeleteUser.ts
import { IUserRepository } from "./repositories/IUserRepository";
import { UserResponseDTO } from "../dto/UserResponseDTO";
import { DeleteUserDTO } from "../dto/DeleteUserDTO";

export class DeleteUser {
  constructor(private userRepository: IUserRepository) {}

  public async execute(dto: DeleteUserDTO): Promise<UserResponseDTO | null> {
    return await this.userRepository.deleteUserById(dto.id);
  }
}
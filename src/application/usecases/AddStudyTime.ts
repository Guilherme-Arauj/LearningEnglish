import { User } from "../../domain/entities/User";
import { IUserRepository } from "./repositories/IUserRepository";
import { UserResponseDTO } from "../dto/UserResponseDTO";
import { AddStudyTimeDTO } from "../dto/AddStudyTimeDTO";

export class AddStudyTime {
  constructor(private userRepository: IUserRepository) {}

  public async execute(dto: AddStudyTimeDTO): Promise<UserResponseDTO> {
    const { userId, timeToAdd } = dto;

    const updatedUser: User = await this.userRepository.addStudyTime(userId, timeToAdd);

    return new UserResponseDTO(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.privilege,
      updatedUser.cefr,
      updatedUser.timeSpentSeconds 
    );
  }
}
import { IUserRepository } from "./repositories/IUserRepository";
import { UserResponseDTO } from "../dto/UserResponseDTO";

export class GetAllUsers {
    constructor(private userRepository: IUserRepository) {}

    public async execute(): Promise<UserResponseDTO[]> {
        const users = await this.userRepository.get();

        return users.map(user => new UserResponseDTO(
            user.id,
            user.name,
            user.email,
            user.privilege,
            user.cefr
        ));
    }
}
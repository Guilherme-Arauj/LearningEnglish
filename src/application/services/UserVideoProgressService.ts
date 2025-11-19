
import { UserVideoProgressResponseDTO } from "../dto/studentUser/UserVideoProgressResponseDTO";
import { IUserVideoProgressRepository } from "./repositories/IUserVideoProgressRepository";

export class UserVideoProgressService {
    constructor(private userVideoProgressRepository: IUserVideoProgressRepository) {}

    public async trackProgress(userId: string): Promise<UserVideoProgressResponseDTO[]> {
        const progressWithVideos = await this.userVideoProgressRepository.findByUserIdWithVideos(userId);

        return progressWithVideos.map(item => UserVideoProgressResponseDTO.fromUserVideoProgress(item));
    }

    
}
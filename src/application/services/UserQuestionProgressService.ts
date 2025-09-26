
import { UserQuestionProgressResponseDTO } from "../dto/studentUser/UserQuestionProgressResponseDTO";
import { IUserQuestionProgressRepository } from "./repositories/IUserQuestionProgressRepository";

export class UserQuestionProgressService {
    constructor(private userQuestionProgressRepository: IUserQuestionProgressRepository) {}

    public async trackProgress(userId: string): Promise<UserQuestionProgressResponseDTO[]> {
        const progressWithQuestions = await this.userQuestionProgressRepository.findByUserIdWithQuestions(userId);

        return progressWithQuestions.map(item => UserQuestionProgressResponseDTO.fromUserQuestionProgress(item));
    }
}
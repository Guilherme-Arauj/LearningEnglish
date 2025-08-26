
import { UserQuestionProgressResponseDTO } from "../dto/UserQuestionProgressResponseDTO";
import { IUserQuestionProgressRepository } from "./repositories/IUserQuestionProgressRepository";

export class TrackProgress {
    constructor(private userQuestionProgressRepository: IUserQuestionProgressRepository) {}

    public async execute(userId: string): Promise<UserQuestionProgressResponseDTO[]> {
        const progressWithQuestions = await this.userQuestionProgressRepository.findByUserIdWithQuestions(userId);

        return progressWithQuestions.map(item => new UserQuestionProgressResponseDTO(
            item.id,
            item.userId,
            item.questionId,
            item.status,
            item.chosenOption,
            item.question
        ));
    }
}
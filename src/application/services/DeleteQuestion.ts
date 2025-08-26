import { DeleteQuestionDTO } from "../dto/DeleteQuestionDTO";
import { QuestionResponseDTO } from "../dto/QuestionResponseDTO";
import { IQuestionRepository } from "./repositories/IQuestionRepository";

export class DeleteQuestion {
    constructor(private questionRepository: IQuestionRepository) {}

    public async execute(dto: DeleteQuestionDTO): Promise<QuestionResponseDTO> {
        const question = await this.questionRepository.delete(dto.id);

        return new QuestionResponseDTO(
            question.id,
            question.title,
            question.cefr,
            question.type,
            question.theme,
            question.optionA,
            question.optionB,
            question.optionC,
            question.response
        );
    }
}
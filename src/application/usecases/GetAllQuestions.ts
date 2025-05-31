import { QuestionResponseDTO } from "../dto/QuestionResponseDTO";
import { IQuestionRepository } from "./repositories/IQuestionRepository";

export class GetAllQuestions {
    constructor(private questionRepository: IQuestionRepository) {}

    public async execute(): Promise<QuestionResponseDTO[]> {
        const questions = await this.questionRepository.get();

        return questions.map(question => new QuestionResponseDTO(
            question.id,
            question.title,
            question.cefr,
            question.type,
            question.theme,
            question.optionA,
            question.optionB,
            question.optionC,
            question.response
        ));
    }
}
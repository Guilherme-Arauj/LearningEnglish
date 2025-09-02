import { Question } from "../../domain/entities/Question";
import { UserQuestionProgress } from "../../domain/entities/UserQuestionProgress";
import { IUuidConfig } from "../../infrastructure/utils/uuid/IUuidConfig";
import { AnswerQuestionDTO } from "../dto/AnswerQuestionDTO";
import { DeleteQuestionDTO } from "../dto/DeleteQuestionDTO";
import { QuestionDTO } from "../dto/QuestionDTO";
import { QuestionResponseDTO } from "../dto/QuestionResponseDTO";
import { QuestionUpdateDTO } from "../dto/QuestionUpdateDTO";
import { IQuestionRepository } from "./repositories/IQuestionRepository";
import { IUserQuestionProgressRepository } from "./repositories/IUserQuestionProgressRepository";

export class QuestionService {
  constructor(
    private questionRepository: IQuestionRepository,
    private userQuestionProgressRepository: IUserQuestionProgressRepository,
    private uuidConfig: IUuidConfig
  ) {}

  // ---

  public async createQuestion(dto: QuestionDTO): Promise<QuestionResponseDTO> {
    const id = await this.uuidConfig.generateQuestionId();

    const question = new Question({
      id: id,
      title: dto.title,
      cefr: dto.cefr ?? undefined,
      type: dto.type ?? undefined,
      theme: dto.theme ?? undefined,
      optionA: dto.optionA ?? undefined,
      optionB: dto.optionB ?? undefined,
      optionC: dto.optionC ?? undefined,
      response: dto.response ?? undefined,
    });

    const savedQuestion = await this.questionRepository.create(question);

    return QuestionResponseDTO.fromQuestion(savedQuestion);
  }

  // ---

  public async deleteQuestion(dto: DeleteQuestionDTO): Promise<QuestionResponseDTO> {
    const deletedQuestion = await this.questionRepository.delete(dto.id);

    return QuestionResponseDTO.fromQuestion(deletedQuestion);
  }

  // ---

  public async getAllQuestions(): Promise<QuestionResponseDTO[]> {
    const questions = await this.questionRepository.get();

    return questions.map((question) => {
      return QuestionResponseDTO.fromQuestion(question);
    });
  }

  // ---

  public async updateQuestion(dto: QuestionUpdateDTO): Promise<QuestionResponseDTO> {
    const question = await this.questionRepository.findQuestionById(dto.id);
    if (!question) throw new Error("Questão não encontrada");

    const updateMethods = {
      title: (q: Question, value: string) => q.updateTitle(value),
      cefr: (q: Question, value: string) => q.updateCefr(value),
      type: (q: Question, value: string) => q.updateType(value),
      theme: (q: Question, value: string) => q.updateTheme(value),
      optionA: (q: Question, value: string) => q.updateOptionA(value),
      optionB: (q: Question, value: string) => q.updateOptionB(value),
      optionC: (q: Question, value: string) => q.updateOptionC(value),
      response: (q: Question, value: string) => q.updateResponse(value),
    } as const;
    
    (Object.entries(updateMethods) as Array<[
          keyof typeof updateMethods,
          (typeof updateMethods)[keyof typeof updateMethods]
        ]>
    ).forEach(([field, updateFn]) => {
      const value = dto[field];
      if (value !== undefined && value !== null) {
        updateFn(question, value);
      }
    });

    const updatedQuestion = await this.questionRepository.update(question);
    return QuestionResponseDTO.fromQuestion(updatedQuestion);
  }

  // ---

  public async answerQuestion(dto: AnswerQuestionDTO): Promise<{ correct: boolean; correctAnswer?: string; question: QuestionResponseDTO}> {
    const question = await this.questionRepository.findQuestionById(dto.questionId);
      if (!question) {
        throw new Error("Questão não encontrada");
      }
  
      const isCorrect = question.isCorrectAnswer(dto.answer);
  
      let correctAnswerText;
      if (!isCorrect) {
        correctAnswerText = question.getCorrectAnswer();
      }
  
      const existingProgress = await this.userQuestionProgressRepository.findByUserAndQuestion(dto.userId, dto.questionId);
  
      if (existingProgress) {
        existingProgress.updateProgress(isCorrect, dto.answer.toUpperCase());
        await this.userQuestionProgressRepository.update(existingProgress);
      } else {
        const progressId = await this.uuidConfig.generateUserQuestionProgressId();
        
        const userQuestionProgress = new UserQuestionProgress({
          id: progressId,
          userId: dto.userId,
          questionId: dto.questionId,
          status: isCorrect,
          chosenOption: dto.answer.toUpperCase()
        });
  
        await this.userQuestionProgressRepository.create(userQuestionProgress);
      }
  
      return {
        correct: isCorrect,
        correctAnswer: correctAnswerText,
        question: QuestionResponseDTO.fromQuestion(question)
      };
    }
  }
  


import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateQuestion } from "./UpdateQuestion";
import { Question } from "../../domain/entities/Question";
import { QuestionResponseDTO } from "../dto/QuestionResponseDTO";
import { UserQuestionProgress } from "../../domain/entities/UserQuestionProgress";

describe("UpdateQuestion Use Case", () => {
  let questionRepositoryMock: any;
  let updateQuestionUseCase: UpdateQuestion;

  beforeEach(() => {
    questionRepositoryMock = {
      findQuestionById: vi.fn(),
      update: vi.fn(),
    };
    updateQuestionUseCase = new UpdateQuestion(questionRepositoryMock);
  });

  it("deve atualizar questão com sucesso e retornar QuestionResponseDTO", async () => {
    const dto = {
      id: "1",
      title: "Nova pergunta?",
      cefr: "B2",
      type: "multiple-choice",
      theme: "História",
      optionA: "Opção A",
      optionB: "Opção B",
      optionC: "Opção C",
      response: "B",
    };

    const existingUserQuestionProgress = new UserQuestionProgress({
      id: "progress-1",
      userId: "USER-123",
      questionId: "1",
      status: true,
      chosenOption: "A",
      user: {
        id: "USER-123",
        name: "João Silva",
        email: "joao@example.com",
        privilege: "student",
        cefr: "B1",
        password: "hashedPassword123", // <-- Adicionado aqui
      },
      question: {
        id: "1",
        title: "Pergunta antiga",
        cefr: "A1",
        type: "true-false",
        theme: "Geografia",
        optionA: "Sim",
        optionB: "Não",
        optionC: undefined,
        response: "A",
      },
    });

    const existingQuestion = new Question({
      id: dto.id,
      title: "Pergunta antiga",
      cefr: "A1",
      type: "true-false",
      theme: "Geografia",
      optionA: "Sim",
      optionB: "Não",
      optionC: undefined,
      response: "A",
      userQuestionProgress: existingUserQuestionProgress,
    });

    const updatedQuestion = new Question({
      id: dto.id,
      title: dto.title,
      cefr: dto.cefr,
      type: dto.type,
      theme: dto.theme,
      optionA: dto.optionA,
      optionB: dto.optionB,
      optionC: dto.optionC,
      response: dto.response,
      userQuestionProgress: existingUserQuestionProgress,
    });

    questionRepositoryMock.findQuestionById.mockResolvedValue(existingQuestion);
    questionRepositoryMock.update.mockResolvedValue(updatedQuestion);

    const result = await updateQuestionUseCase.execute(dto);

    expect(questionRepositoryMock.findQuestionById).toHaveBeenCalledWith(
      dto.id
    );
    expect(questionRepositoryMock.update).toHaveBeenCalled();
    expect(result).toBeInstanceOf(QuestionResponseDTO);
    expect(result).toEqual(
      new QuestionResponseDTO(
        updatedQuestion.id,
        updatedQuestion.title,
        updatedQuestion.cefr,
        updatedQuestion.type,
        updatedQuestion.theme,
        updatedQuestion.optionA,
        updatedQuestion.optionB,
        updatedQuestion.optionC,
        updatedQuestion.response
      )
    );
  });

  it("deve lançar erro se questão não for encontrada", async () => {
    questionRepositoryMock.findQuestionById.mockResolvedValue(null);

    await expect(updateQuestionUseCase.execute({ id: "999" })).rejects.toThrow(
      "Questão não encontrada"
    );

    expect(questionRepositoryMock.findQuestionById).toHaveBeenCalledWith("999");
    expect(questionRepositoryMock.update).not.toHaveBeenCalled();
  });
});

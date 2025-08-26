import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteQuestion } from './DeleteQuestion'
import { QuestionResponseDTO } from '../dto/QuestionResponseDTO'

describe('DeleteQuestion Use Case', () => {
  let questionRepositoryMock: any
  let deleteQuestionUseCase: DeleteQuestion

  beforeEach(() => {
    questionRepositoryMock = {
      delete: vi.fn()
    }
    deleteQuestionUseCase = new DeleteQuestion(questionRepositoryMock)
  })

  it('deve deletar a questão e retornar QuestionResponseDTO', async () => {
    const dto = { id: 'Q-123456' }

    const deletedQuestion = {
      id: dto.id,
      title: 'Qual a capital da França?',
      cefr: 'A1',
      type: 'multiple-choice',
      theme: 'Geografia',
      optionA: 'Paris',
      optionB: 'Londres',
      optionC: 'Berlim',
      response: 'A'
    }

    questionRepositoryMock.delete.mockResolvedValue(deletedQuestion)

    const result = await deleteQuestionUseCase.execute(dto)

    expect(questionRepositoryMock.delete).toHaveBeenCalledWith(dto.id)
    expect(result).toBeInstanceOf(QuestionResponseDTO)
    expect(result).toEqual(
      new QuestionResponseDTO(
        deletedQuestion.id,
        deletedQuestion.title,
        deletedQuestion.cefr,
        deletedQuestion.type,
        deletedQuestion.theme,
        deletedQuestion.optionA,
        deletedQuestion.optionB,
        deletedQuestion.optionC,
        deletedQuestion.response
      )
    )
  })
})
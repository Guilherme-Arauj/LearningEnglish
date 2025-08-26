import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateQuestion } from './CreateQuestion'
import { Question } from '../../domain/entities/Question'
import { QuestionResponseDTO } from '../dto/QuestionResponseDTO'

describe('CreateQuestion Use Case', () => {
  let questionRepositoryMock: any
  let uuidConfigMock: any
  let createQuestionUseCase: CreateQuestion

  beforeEach(() => {
    questionRepositoryMock = {
      create: vi.fn()
    }
    uuidConfigMock = {
      generateQuestionId: vi.fn()
    }
    createQuestionUseCase = new CreateQuestion(questionRepositoryMock, uuidConfigMock)
  })

  it('deve criar uma questão e retornar QuestionResponseDTO', async () => {
    const dto = {
      title: 'Qual a capital da França?',
      cefr: 'A1',
      type: 'multiple-choice',
      theme: 'Geografia',
      optionA: 'Paris',
      optionB: 'Londres',
      optionC: 'Berlim',
      response: 'A'
    }

    const generatedId = 'Q-123456'
    uuidConfigMock.generateQuestionId.mockResolvedValue(generatedId)

    const savedQuestion = new Question({
      id: generatedId,
      title: dto.title,
      cefr: dto.cefr,
      type: dto.type,
      theme: dto.theme,
      optionA: dto.optionA,
      optionB: dto.optionB,
      optionC: dto.optionC,
      response: dto.response
    })

    questionRepositoryMock.create.mockResolvedValue(savedQuestion)

    const result = await createQuestionUseCase.execute(dto)

    expect(uuidConfigMock.generateQuestionId).toHaveBeenCalled()
    expect(questionRepositoryMock.create).toHaveBeenCalled()
    expect(result).toBeInstanceOf(QuestionResponseDTO)
    expect(result).toEqual(
      new QuestionResponseDTO(
        savedQuestion.id,
        savedQuestion.title,
        savedQuestion.cefr,
        savedQuestion.type,
        savedQuestion.theme,
        savedQuestion.optionA,
        savedQuestion.optionB,
        savedQuestion.optionC,
        savedQuestion.response
      )
    )
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetAllQuestions } from './GetAllQuestions'
import { QuestionResponseDTO } from '../dto/QuestionResponseDTO'

describe('GetAllQuestions Use Case', () => {
  let questionRepositoryMock: any
  let getAllQuestionsUseCase: GetAllQuestions

  beforeEach(() => {
    questionRepositoryMock = {
      get: vi.fn()
    }
    getAllQuestionsUseCase = new GetAllQuestions(questionRepositoryMock)
  })

  it('deve retornar lista de QuestionResponseDTO', async () => {
    const mockQuestions = [
      {
        id: 'Q-1',
        title: 'Qual a capital da França?',
        cefr: 'A1',
        type: 'multiple-choice',
        theme: 'Geografia',
        optionA: 'Paris',
        optionB: 'Londres',
        optionC: 'Berlim',
        response: 'A'
      },
      {
        id: 'Q-2',
        title: 'Qual a capital da Alemanha?',
        cefr: 'A1',
        type: 'multiple-choice',
        theme: 'Geografia',
        optionA: 'Paris',
        optionB: 'Berlim',
        optionC: 'Roma',
        response: 'B'
      }
    ]

    questionRepositoryMock.get.mockResolvedValue(mockQuestions)

    const result = await getAllQuestionsUseCase.execute()

    expect(questionRepositoryMock.get).toHaveBeenCalled()
    expect(result).toHaveLength(mockQuestions.length)
    expect(result[0]).toBeInstanceOf(QuestionResponseDTO)
    expect(result[0]).toEqual(
      new QuestionResponseDTO(
        mockQuestions[0].id,
        mockQuestions[0].title,
        mockQuestions[0].cefr,
        mockQuestions[0].type,
        mockQuestions[0].theme,
        mockQuestions[0].optionA,
        mockQuestions[0].optionB,
        mockQuestions[0].optionC,
        mockQuestions[0].response
      )
    )
  })

  it('deve retornar lista vazia se não houver questões', async () => {
    questionRepositoryMock.get.mockResolvedValue([])

    const result = await getAllQuestionsUseCase.execute()

    expect(questionRepositoryMock.get).toHaveBeenCalled()
    expect(result).toEqual([])
  })
})
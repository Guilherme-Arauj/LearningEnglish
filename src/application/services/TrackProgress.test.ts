import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TrackProgress } from './TrackProgress'
import { UserQuestionProgressResponseDTO } from '../dto/UserQuestionProgressResponseDTO'

describe('TrackProgress Use Case', () => {
  let userQuestionProgressRepositoryMock: any
  let trackProgressUseCase: TrackProgress

  beforeEach(() => {
    userQuestionProgressRepositoryMock = {
      findByUserIdWithQuestions: vi.fn()
    }
    trackProgressUseCase = new TrackProgress(userQuestionProgressRepositoryMock)
  })

  it('deve retornar lista de UserQuestionProgressResponseDTO', async () => {
    const userId = 'USER-123'

    const mockProgress = [
      {
        id: 1,
        userId,
        questionId: 101,
        status: 'completed',
        chosenOption: 'A',
        question: {
          title: 'Qual a capital da França?',
          theme: 'Geografia',
          cefr: 'A1',
          type: 'multiple-choice'
        }
      },
      {
        id: 2,
        userId,
        questionId: 102,
        status: 'pending',
        chosenOption: 'B',
        question: {
          title: 'Qual a capital da Alemanha?',
          theme: 'Geografia',
          cefr: 'A1',
          type: 'multiple-choice'
        }
      }
    ]

    userQuestionProgressRepositoryMock.findByUserIdWithQuestions.mockResolvedValue(mockProgress)

    const result = await trackProgressUseCase.execute(userId)

    expect(userQuestionProgressRepositoryMock.findByUserIdWithQuestions).toHaveBeenCalledWith(userId)
    expect(result).toHaveLength(mockProgress.length)
    expect(result[0]).toBeInstanceOf(UserQuestionProgressResponseDTO)
    expect(result[0]).toEqual(
      new UserQuestionProgressResponseDTO(
        mockProgress[0].id,
        mockProgress[0].userId,
        mockProgress[0].questionId,
        mockProgress[0].status,
        mockProgress[0].chosenOption,
        mockProgress[0].question
      )
    )
  })

  it('deve retornar lista vazia se não houver progresso', async () => {
    const userId = 'USER-123'
    userQuestionProgressRepositoryMock.findByUserIdWithQuestions.mockResolvedValue([])

    const result = await trackProgressUseCase.execute(userId)

    expect(userQuestionProgressRepositoryMock.findByUserIdWithQuestions).toHaveBeenCalledWith(userId)
    expect(result).toEqual([])
  })
})
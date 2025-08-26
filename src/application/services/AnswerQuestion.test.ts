import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AnswerQuestion } from './AnswerQuestion'
import { UserQuestionProgress } from '../../domain/entities/UserQuestionProgress'

describe('AnswerQuestion Use Case', () => {
  let questionRepositoryMock: any
  let userQuestionProgressRepositoryMock: any
  let uuidConfigMock: any
  let answerQuestionUseCase: AnswerQuestion

  beforeEach(() => {
    questionRepositoryMock = {
      findQuestionById: vi.fn()
    }
    userQuestionProgressRepositoryMock = {
      findByUserAndQuestion: vi.fn(),
      update: vi.fn(),
      create: vi.fn()
    }
    uuidConfigMock = {
      generateUserQuestionProgressId: vi.fn()
    }
    answerQuestionUseCase = new AnswerQuestion(
      questionRepositoryMock,
      userQuestionProgressRepositoryMock,
      uuidConfigMock
    )
  })

  it('deve lançar erro se questão não for encontrada', async () => {
    questionRepositoryMock.findQuestionById.mockResolvedValue(null)

    await expect(
      answerQuestionUseCase.execute({ userId: 'STUDENT-1', questionId: 'Q-1', answer: 'A' })
    ).rejects.toThrow('Questão não encontrada')
  })

  it('deve lançar erro se questão não possuir resposta definida', async () => {
    questionRepositoryMock.findQuestionById.mockResolvedValue({
      id: 'Q-1',
      response: null
    })

    await expect(
      answerQuestionUseCase.execute({ userId: 'STUDENT-1', questionId: 'Q-1', answer: 'A' })
    ).rejects.toThrow('Questão não possui resposta definida')
  })

  it('deve retornar correto e sem correctAnswer se resposta estiver correta', async () => {
    const question = {
      id: 'Q-1',
      response: 'A',
      optionA: 'Opção A',
      optionB: 'Opção B',
      optionC: 'Opção C'
    }
    questionRepositoryMock.findQuestionById.mockResolvedValue(question)
    userQuestionProgressRepositoryMock.findByUserAndQuestion.mockResolvedValue(null)
    uuidConfigMock.generateUserQuestionProgressId.mockResolvedValue('progress-123')
    userQuestionProgressRepositoryMock.create.mockResolvedValue(undefined)

    const result = await answerQuestionUseCase.execute({
      userId: 'STUDENT-1',
      questionId: 'Q-1',
      answer: 'a'
    })

    expect(result).toEqual({ correct: true, correctAnswer: undefined })
    expect(userQuestionProgressRepositoryMock.create).toHaveBeenCalled()
  })

  it('deve retornar incorreto e correctAnswer com texto da opção correta', async () => {
    const question = {
      id: 'Q-1',
      response: 'B',
      optionA: 'Opção A',
      optionB: 'Opção B correta',
      optionC: 'Opção C'
    }
    questionRepositoryMock.findQuestionById.mockResolvedValue(question)
    userQuestionProgressRepositoryMock.findByUserAndQuestion.mockResolvedValue(null)
    uuidConfigMock.generateUserQuestionProgressId.mockResolvedValue('progress-123')
    userQuestionProgressRepositoryMock.create.mockResolvedValue(undefined)

    const result = await answerQuestionUseCase.execute({
      userId: 'STUDENT-1',
      questionId: 'Q-1',
      answer: 'A'
    })

    expect(result).toEqual({ correct: false, correctAnswer: 'Opção B correta' })
    expect(userQuestionProgressRepositoryMock.create).toHaveBeenCalled()
  })

  it('deve atualizar progresso existente se encontrado', async () => {
    const question = {
      id: 'Q-1',
      response: 'C',
      optionA: 'Opção A',
      optionB: 'Opção B',
      optionC: 'Opção C correta'
    }
    const existingProgress = new UserQuestionProgress({
      id: 'progress-123',
      userId: 'STUDENT-1',
      questionId: 'Q-1',
      status: false,
      chosenOption: 'A'
    })

    questionRepositoryMock.findQuestionById.mockResolvedValue(question)
    userQuestionProgressRepositoryMock.findByUserAndQuestion.mockResolvedValue(existingProgress)
    userQuestionProgressRepositoryMock.update.mockResolvedValue(undefined)

    const result = await answerQuestionUseCase.execute({
      userId: 'STUDENT-1',
      questionId: 'Q-1',
      answer: 'C'
    })

    expect(existingProgress.status).toBe(true)
    expect(existingProgress.chosenOption).toBe('C')
    expect(userQuestionProgressRepositoryMock.update).toHaveBeenCalledWith(existingProgress)
    expect(result).toEqual({ correct: true, correctAnswer: undefined })
  })
})
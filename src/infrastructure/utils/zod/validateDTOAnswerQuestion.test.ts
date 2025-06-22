import { describe, it, expect, vi, afterEach } from 'vitest'
import { validateDTOAnswerQuestion } from './validateDTOAnswerQuestion'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOAnswerQuestion', () => {
  afterEach(() => {
    mockConsoleError.mockClear()
  })

  describe('validação com sucesso', () => {
    it('deve validar dados corretos', async () => {
      const validData = {
        userId: 'STUDENT-abc123',
        questionId: 'Q-def456789012',
        answer: 'My answer is correct'
      }

      const result = await validateDTOAnswerQuestion(validData, {})

      expect(result).toEqual(validData)
    })

    it('deve aceitar strings longas', async () => {
      const validData = {
        userId: 'STUDENT-very-long-user-id-123456',
        questionId: 'Q-very-long-question-id-789012',
        answer: 'This is a very long answer with multiple words and sentences.'
      }

      const result = await validateDTOAnswerQuestion(validData, {})

      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro', () => {
    it('deve falhar com userId vazio', async () => {
      const invalidData = {
        userId: '',
        questionId: 'Q-def456789012',
        answer: 'My answer'
      }

      await expect(validateDTOAnswerQuestion(invalidData, {}))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[ID do usuário é obrigatório]')
      )
    })

    it('deve falhar com questionId vazio', async () => {
      const invalidData = {
        userId: 'STUDENT-abc123',
        questionId: '',
        answer: 'My answer'
      }

      await expect(validateDTOAnswerQuestion(invalidData, {}))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[ID da questão é obrigatório]')
      )
    })

    it('deve falhar com answer vazio', async () => {
      const invalidData = {
        userId: 'STUDENT-abc123',
        questionId: 'Q-def456789012',
        answer: ''
      }

      await expect(validateDTOAnswerQuestion(invalidData, {}))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Resposta é obrigatória]')
      )
    })

    it('deve falhar com campos faltando', async () => {
      const invalidData = {
        userId: 'STUDENT-abc123'
      }

      await expect(validateDTOAnswerQuestion(invalidData, {}))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })

    it('deve falhar com múltiplos erros', async () => {
      const invalidData = {
        userId: '',
        questionId: '',
        answer: ''
      }

      await expect(validateDTOAnswerQuestion(invalidData, {}))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOAnswerQuestion({}, {}))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com null', async () => {
      await expect(validateDTOAnswerQuestion(null as any, {}))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar espaços em branco como válidos', async () => {
      const validData = {
        userId: ' ',
        questionId: ' ',
        answer: ' '
      }

      const result = await validateDTOAnswerQuestion(validData, {})

      expect(result).toEqual(validData)
    })
  })
})
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOTimeline } from './validateDTOTimeline'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOTimeline', () => {
  let mockRes: any

  beforeEach(() => {
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
  })

  afterEach(() => {
    mockConsoleError.mockClear()
    vi.clearAllMocks()
  })

  describe('validação com sucesso', () => {
    it('deve validar userId de estudante e timeline inteiro', async () => {
      const validData = {
        userId: 'STUDENT-abc123',
        timeline: 10
      }
      const result = await validateDTOTimeline(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar userId de admin e timeline inteiro', async () => {
      const validData = {
        userId: 'ADMIN-xyz789',
        timeline: 0
      }
      const result = await validateDTOTimeline(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar userId com mais de 8 caracteres', async () => {
      const validData = {
        userId: 'STUDENT-123456789',
        timeline: 100
      }
      const result = await validateDTOTimeline(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - userId', () => {
    it('deve falhar com userId muito curto', async () => {
      const invalidData = {
        userId: 'STUDENT',
        timeline: 5
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)')
      )
    })

    it('deve falhar com prefixo inválido', async () => {
      const invalidData = {
        userId: 'INVALID-123456',
        timeline: 5
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining("ID deve começar com 'STUDENT-' ou 'ADMIN-'")
      )
    })

    it('deve falhar com userId vazio', async () => {
      const invalidData = {
        userId: '',
        timeline: 5
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo userId', async () => {
      const invalidData = { timeline: 5 }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com case sensitive', async () => {
      const invalidData = {
        userId: 'student-123456',
        timeline: 5
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - timeline', () => {
    it('deve falhar com timeline não inteiro', async () => {
      const invalidData = {
        userId: 'STUDENT-abc123',
        timeline: 1.5
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('Timeline deve ser um número inteiro')
      )
    })

    it('deve falhar com timeline string', async () => {
      const invalidData = {
        userId: 'STUDENT-abc123',
        timeline: '10'
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com timeline null', async () => {
      const invalidData = {
        userId: 'STUDENT-abc123',
        timeline: null
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo timeline', async () => {
      const invalidData = {
        userId: 'STUDENT-abc123'
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com userId e timeline inválidos', async () => {
      const invalidData = {
        userId: '',
        timeline: 'abc'
      }
      await expect(validateDTOTimeline(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOTimeline(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOTimeline({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })
})
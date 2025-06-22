import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTODeleteQuestion } from './validateDTODeleteQuestion'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTODeleteQuestion', () => {
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
    it('deve validar ID correto', async () => {
      const validData = { id: 'Q-abc123456789' }
      const result = await validateDTODeleteQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ID com 14 caracteres exatos', async () => {
      const validData = { id: 'Q-123456789012' }
      const result = await validateDTODeleteQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ID com mais de 14 caracteres', async () => {
      const validData = { id: 'Q-123456789012345' }
      const result = await validateDTODeleteQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro', () => {
    it('deve falhar com ID muito curto', async () => {
      const invalidData = { id: 'Q-12345' }
      const result = await validateDTODeleteQuestion(invalidData, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: '[ID deve ter pelo menos 14 caracteres (Q- + 12 chars)]'
          })
        ])
      })
    })

    it('deve falhar sem prefixo Q-', async () => {
      const invalidData = { id: 'INVALID-123456789' }
      const result = await validateDTODeleteQuestion(invalidData, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: "[ID deve começar com 'Q-']"
          })
        ])
      })
    })

    it('deve falhar com ID vazio', async () => {
      const invalidData = { id: '' }
      const result = await validateDTODeleteQuestion(invalidData, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })

    it('deve falhar sem campo id', async () => {
      const invalidData = {}
      const result = await validateDTODeleteQuestion(invalidData, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })

    it('deve falhar com múltiplos erros', async () => {
      const invalidData = { id: 'X-123' }
      const result = await validateDTODeleteQuestion(invalidData, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockConsoleError).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      const result = await validateDTODeleteQuestion(null as any, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })

    it('deve falhar com objeto vazio', async () => {
      const result = await validateDTODeleteQuestion({}, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })
  })

  describe('formato do ID', () => {
    it('deve aceitar ID com hífens', async () => {
      const validData = { id: 'Q-abc-def-123456' }
      const result = await validateDTODeleteQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ID com números e letras', async () => {
      const validData = { id: 'Q-a1b2c3d4e5f6' }
      const result = await validateDTODeleteQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve falhar com prefixo errado mas tamanho correto', async () => {
      const invalidData = { id: 'QUESTION-123456' }
      const result = await validateDTODeleteQuestion(invalidData, mockRes)
      
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })
  })
})
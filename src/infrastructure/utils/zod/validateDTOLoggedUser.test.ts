import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOLoggedUser } from './validateDTOLoggedUser'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOLoggedUser', () => {
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
    it('deve validar userId de estudante', async () => {
      const validData = { userId: 'STUDENT-abc123' }
      const result = await validateDTOLoggedUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar userId de admin', async () => {
      const validData = { userId: 'ADMIN-xyz789' }
      const result = await validateDTOLoggedUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar userId com mais de 8 caracteres', async () => {
      const validData = { userId: 'STUDENT-123456789' }
      const result = await validateDTOLoggedUser(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - userId', () => {
    it('deve falhar com userId muito curto', async () => {
      const invalidData = { userId: 'STUDENT' }
      await expect(validateDTOLoggedUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)')
      )
    })

    it('deve falhar com prefixo inválido', async () => {
      const invalidData = { userId: 'INVALID-123456' }
      await expect(validateDTOLoggedUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining("ID deve começar com 'STUDENT-' ou 'ADMIN-'")
      )
    })

    it('deve falhar com userId vazio', async () => {
      const invalidData = { userId: '' }
      await expect(validateDTOLoggedUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo userId', async () => {
      const invalidData = {}
      await expect(validateDTOLoggedUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com case sensitive', async () => {
      const invalidData = { userId: 'student-123456' }
      await expect(validateDTOLoggedUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOLoggedUser(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOLoggedUser({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com userId numérico', async () => {
      const invalidData = { userId: 12345678 }
      await expect(validateDTOLoggedUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com userId array', async () => {
      const invalidData = { userId: ['STUDENT-abc123'] }
      await expect(validateDTOLoggedUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })
})
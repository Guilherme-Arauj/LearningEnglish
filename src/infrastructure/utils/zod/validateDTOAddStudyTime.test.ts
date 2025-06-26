import { describe, it, expect, vi, afterEach } from 'vitest'
import { validateDTOAddStudyTime } from './validateDTOAddStudyTime'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOAddStudyTime', () => {
  afterEach(() => {
    mockConsoleError.mockClear()
  })

  describe('validação com sucesso', () => {
    it('deve validar dados corretos com prefixo STUDENT-', async () => {
      const validData = {
        userId: 'STUDENT-123456',
        timeToAdd: 10
      }

      const result = await validateDTOAddStudyTime(validData, {})

      expect(result).toEqual(validData)
    })

    it('deve validar dados corretos com prefixo ADMIN-', async () => {
      const validData = {
        userId: 'ADMIN-abcdef',
        timeToAdd: 1
      }

      const result = await validateDTOAddStudyTime(validData, {})

      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro', () => {
    it('deve falhar com userId muito curto', async () => {
      const invalidData = {
        userId: 'STU-1',
        timeToAdd: 5
      }

      await expect(validateDTOAddStudyTime(invalidData, {}))
        .rejects.toThrow('Dados inválidos')

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[ID deve ter pelo menos 8 caracteres')
      )
    })

    it('deve falhar com userId sem prefixo válido', async () => {
      const invalidData = {
        userId: 'USER-123456',
        timeToAdd: 5
      }

      await expect(validateDTOAddStudyTime(invalidData, {}))
        .rejects.toThrow('Dados inválidos')

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining("[ID deve começar com 'STUDENT-' ou 'ADMIN-']")
      )
    })

    it('deve falhar com timeToAdd negativo', async () => {
      const invalidData = {
        userId: 'STUDENT-123456',
        timeToAdd: -3
      }

      await expect(validateDTOAddStudyTime(invalidData, {}))
        .rejects.toThrow('Dados inválidos')

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Tempo a adicionar deve ser maior que zero]')
      )
    })

    it('deve falhar com timeToAdd não inteiro', async () => {
      const invalidData = {
        userId: 'STUDENT-123456',
        timeToAdd: 2.5
      }

      await expect(validateDTOAddStudyTime(invalidData, {}))
        .rejects.toThrow('Dados inválidos')

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Tempo a adicionar deve ser um número inteiro]')
      )
    })

    it('deve falhar com campos faltando', async () => {
      const invalidData = {
        userId: 'STUDENT-123456'
      }

      await expect(validateDTOAddStudyTime(invalidData, {}))
        .rejects.toThrow('Dados inválidos')

      expect(mockConsoleError).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOAddStudyTime({}, {}))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com null', async () => {
      await expect(validateDTOAddStudyTime(null as any, {}))
        .rejects.toThrow('Dados inválidos')
    })
  })
})
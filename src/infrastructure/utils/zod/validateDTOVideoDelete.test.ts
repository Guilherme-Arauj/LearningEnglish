import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOVideoDelete } from './validateDTOVideoDelete'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOVideoDelete', () => {
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
    it('deve validar deleção com id válido', async () => {
      const validData = { id: 'video-123' }
      const result = await validateDTOVideoDelete(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar id com caracteres especiais', async () => {
      const validData = { id: 'VID-!@#-456' }
      const result = await validateDTOVideoDelete(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro', () => {
    it('deve falhar com id vazio', async () => {
      const invalidData = { id: '' }
      await expect(validateDTOVideoDelete(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID é obrigatório')
      )
    })

    it('deve falhar sem campo id', async () => {
      const invalidData = {}
      await expect(validateDTOVideoDelete(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com id null', async () => {
      const invalidData = { id: null }
      await expect(validateDTOVideoDelete(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com id undefined', async () => {
      const invalidData = { id: undefined }
      await expect(validateDTOVideoDelete(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOVideoDelete(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOVideoDelete({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com id numérico', async () => {
      const invalidData = { id: 123 }
      await expect(validateDTOVideoDelete(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com id array', async () => {
      const invalidData = { id: ['video-1'] }
      await expect(validateDTOVideoDelete(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })
})
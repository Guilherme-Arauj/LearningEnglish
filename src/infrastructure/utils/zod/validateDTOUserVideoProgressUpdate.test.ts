import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOUserVideoProgressUpdate } from './validateDTOUserVideoProgressUpdate'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOUserVideoProgressUpdate', () => {
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
    it('deve validar atualização completa', async () => {
      const validData = {
        id: 'progress-001',
        userId: 'user-123',
        videoId: 'video-456',
        status: true
      }
      const result = await validateDTOUserVideoProgressUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar apenas com id obrigatório', async () => {
      const validData = { id: 'progress-002' }
      const result = await validateDTOUserVideoProgressUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais como null', async () => {
      const validData = {
        id: 'progress-003',
        userId: null,
        videoId: null,
        status: null
      }
      const result = await validateDTOUserVideoProgressUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais como undefined', async () => {
      const validData = {
        id: 'progress-004',
        userId: undefined,
        videoId: undefined,
        status: undefined
      }
      const result = await validateDTOUserVideoProgressUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - id', () => {
    it('deve falhar com id vazio', async () => {
      const invalidData = { id: '' }
      const result = await validateDTOUserVideoProgressUpdate(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID do progresso é obrigatório')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar sem campo id', async () => {
      const invalidData = { userId: 'user-1' }
      const result = await validateDTOUserVideoProgressUpdate(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com erro - userId', () => {
    it('deve falhar com userId vazio', async () => {
      const invalidData = { id: 'progress-005', userId: '' }
      const result = await validateDTOUserVideoProgressUpdate(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID do usuário é obrigatório')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com erro - videoId', () => {
    it('deve falhar com videoId vazio', async () => {
      const invalidData = { id: 'progress-006', videoId: '' }
      const result = await validateDTOUserVideoProgressUpdate(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID do vídeo é obrigatório')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com erro - status', () => {
    it('deve falhar com status string', async () => {
      const invalidData = { id: 'progress-007', status: 'true' }
      const result = await validateDTOUserVideoProgressUpdate(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar com status number', async () => {
      const invalidData = { id: 'progress-008', status: 1 }
      const result = await validateDTOUserVideoProgressUpdate(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com id e userId vazios', async () => {
      const invalidData = { id: '', userId: '' }
      const result = await validateDTOUserVideoProgressUpdate(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      const result = await validateDTOUserVideoProgressUpdate(null as any, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar com objeto vazio', async () => {
      const result = await validateDTOUserVideoProgressUpdate({}, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })
})
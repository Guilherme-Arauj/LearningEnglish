import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOVideoUpdate } from './validateDTOVideoUpdate'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOVideoUpdate', () => {
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
        id: 'video-123',
        youtubeVideoId: 'yt-456',
        title: 'Título do vídeo',
        description: 'Descrição do vídeo',
        thumbnailUrl: 'https://img.youtube.com/vi/yt-456/hqdefault.jpg',
        publishedAt: '2023-10-01T12:00:00.000Z',
        channelTitle: 'Canal Exemplo',
        tags: 'tag1,tag2'
      }
      const result = await validateDTOVideoUpdate(validData, mockRes)
      // publishedAt é transformado em Date
      expect(result).toEqual({
        ...validData,
        publishedAt: new Date(validData.publishedAt)
      })
    })

    it('deve validar apenas com id obrigatório', async () => {
      const validData = { id: 'video-001' }
      const result = await validateDTOVideoUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais como undefined', async () => {
      const validData = {
        id: 'video-002',
        youtubeVideoId: undefined,
        title: undefined,
        description: undefined,
        thumbnailUrl: undefined,
        publishedAt: undefined,
        channelTitle: undefined,
        tags: undefined
      }
      const result = await validateDTOVideoUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - id', () => {
    it('deve falhar com id vazio', async () => {
      const invalidData = { id: '' }
      await expect(validateDTOVideoUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID é obrigatório')
      )
    })

    it('deve falhar sem campo id', async () => {
      const invalidData = { title: 'Título' }
      await expect(validateDTOVideoUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - youtubeVideoId', () => {
    it('deve falhar com youtubeVideoId vazio', async () => {
      const invalidData = { id: 'video-003', youtubeVideoId: '' }
      await expect(validateDTOVideoUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID do vídeo do YouTube é obrigatório')
      )
    })
  })

  describe('validação com erro - title', () => {
    it('deve falhar com title vazio', async () => {
      const invalidData = { id: 'video-004', title: '' }
      await expect(validateDTOVideoUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('Título é obrigatório')
      )
    })
  })

  describe('validação com erro - thumbnailUrl', () => {
    it('deve falhar com thumbnailUrl inválida', async () => {
      const invalidData = { id: 'video-005', thumbnailUrl: 'not-a-url' }
      await expect(validateDTOVideoUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('URL da thumbnail deve ser válida')
      )
    })
  })

  describe('validação com erro - publishedAt', () => {
    it('deve falhar com publishedAt inválido', async () => {
      const invalidData = { id: 'video-006', publishedAt: 'not-a-date' }
      await expect(validateDTOVideoUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('Data de publicação deve ser válida')
      )
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOVideoUpdate(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOVideoUpdate({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar description, channelTitle e tags vazios', async () => {
      const validData = {
        id: 'video-007',
        description: '',
        channelTitle: '',
        tags: ''
      }
      const result = await validateDTOVideoUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar atualização parcial de título', async () => {
      const validData = {
        id: 'video-008',
        title: 'Novo Título'
      }
      const result = await validateDTOVideoUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar atualização de thumbnail', async () => {
      const validData = {
        id: 'video-009',
        thumbnailUrl: 'https://img.youtube.com/vi/yt-999/hqdefault.jpg'
      }
      const result = await validateDTOVideoUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar atualização de data de publicação', async () => {
      const validData = {
        id: 'video-010',
        publishedAt: '2024-01-01T00:00:00.000Z'
      }
      const result = await validateDTOVideoUpdate(validData, mockRes)
      expect(result).toEqual({
        ...validData,
        publishedAt: new Date(validData.publishedAt)
      })
    })
  })
})
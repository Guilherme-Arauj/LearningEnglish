import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOCreateVideo } from './validateDTOCreateVideo'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOCreateVideo', () => {
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
    it('deve validar criação completa', async () => {
      const validData = {
        youtubeVideoId: 'yt-123',
        title: 'Título do vídeo',
        description: 'Descrição',
        thumbnailUrl: 'https://img.youtube.com/vi/yt-123/hqdefault.jpg',
        publishedAt: '2023-10-01T12:00:00.000Z',
        channelTitle: 'Canal Exemplo',
        tags: 'tag1,tag2',
        cefr: 'B2'
      }
      const result = await validateDTOCreateVideo(validData, mockRes)
      expect(result).toEqual({
        ...validData,
        publishedAt: new Date(validData.publishedAt)
      })
    })

    it('deve validar apenas campos obrigatórios', async () => {
      const validData = {
        youtubeVideoId: 'yt-001',
        title: 'Título',
        cefr: 'A1'
      }
      const result = await validateDTOCreateVideo(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais como undefined', async () => {
      const validData = {
        youtubeVideoId: 'yt-002',
        title: 'Título',
        description: undefined,
        thumbnailUrl: undefined,
        publishedAt: undefined,
        channelTitle: undefined,
        tags: undefined,
        cefr: 'C2'
      }
      const result = await validateDTOCreateVideo(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - youtubeVideoId', () => {
    it('deve falhar com youtubeVideoId vazio', async () => {
      const invalidData = {
        youtubeVideoId: '',
        title: 'Título',
        cefr: 'A2'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('ID do vídeo do YouTube é obrigatório')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar sem campo youtubeVideoId', async () => {
      const invalidData = {
        title: 'Título',
        cefr: 'B1'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com erro - title', () => {
    it('deve falhar com title vazio', async () => {
      const invalidData = {
        youtubeVideoId: 'yt-003',
        title: '',
        cefr: 'C1'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('Título é obrigatório')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar sem campo title', async () => {
      const invalidData = {
        youtubeVideoId: 'yt-004',
        cefr: 'A1'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com erro - thumbnailUrl', () => {
    it('deve falhar com thumbnailUrl inválida', async () => {
      const invalidData = {
        youtubeVideoId: 'yt-005',
        title: 'Título',
        thumbnailUrl: 'not-a-url',
        cefr: 'B2'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('URL da thumbnail deve ser válida')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com erro - publishedAt', () => {
    it('deve falhar com publishedAt inválido', async () => {
      const invalidData = {
        youtubeVideoId: 'yt-006',
        title: 'Título',
        publishedAt: 'not-a-date',
        cefr: 'A2'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('Data de publicação deve ser válida')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com erro - cefr', () => {
    it('deve falhar com cefr vazio', async () => {
      const invalidData = {
        youtubeVideoId: 'yt-007',
        title: 'Título',
        cefr: ''
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('CEFR é obrigatório')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar com cefr inválido', async () => {
      const invalidData = {
        youtubeVideoId: 'yt-008',
        title: 'Título',
        cefr: 'Z9'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('CEFR deve ser um nível válido (A1, A2, B1, B2, C1, C2)')
      )
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar sem campo cefr', async () => {
      const invalidData = {
        youtubeVideoId: 'yt-009',
        title: 'Título'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com vários campos inválidos', async () => {
      const invalidData = {
        youtubeVideoId: '',
        title: '',
        cefr: 'Z9'
      }
      const result = await validateDTOCreateVideo(invalidData, mockRes)
      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      const result = await validateDTOCreateVideo(null as any, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve falhar com objeto vazio', async () => {
      const result = await validateDTOCreateVideo({}, mockRes)
      expect(result).toBeNull()
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalled()
    })

    it('deve aceitar description, channelTitle e tags vazios', async () => {
      const validData = {
        youtubeVideoId: 'yt-010',
        title: 'Título',
        description: '',
        channelTitle: '',
        tags: '',
        cefr: 'A2'
      }
      const result = await validateDTOCreateVideo(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar criação de vídeo com publishedAt', async () => {
      const validData = {
        youtubeVideoId: 'yt-011',
        title: 'Vídeo com data',
        publishedAt: '2024-01-01T00:00:00.000Z',
        cefr: 'B1'
      }
      const result = await validateDTOCreateVideo(validData, mockRes)
      expect(result).toEqual({
        ...validData,
        publishedAt: new Date(validData.publishedAt)
      })
    })

    it('deve validar criação de vídeo com thumbnailUrl', async () => {
      const validData = {
        youtubeVideoId: 'yt-012',
        title: 'Vídeo com thumbnail',
        thumbnailUrl: 'https://img.youtube.com/vi/yt-012/hqdefault.jpg',
        cefr: 'C2'
      }
      const result = await validateDTOCreateVideo(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })
})
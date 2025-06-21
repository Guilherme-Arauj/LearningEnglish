import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOQuestionUpdate } from './validateDTOQuestionUpdate'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOQuestionUpdate', () => {
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
    it('deve validar atualização completa da questão', async () => {
      const validData = {
        id: 'question-123',
        title: 'What is the capital of England?',
        cefr: 'A1',
        type: 'multiple-choice',
        theme: 'Geography',
        optionA: 'London',
        optionB: 'Manchester',
        optionC: 'Birmingham',
        response: 'A'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar apenas com ID obrigatório', async () => {
      const validData = { id: 'question-456' }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar ID e título apenas', async () => {
      const validData = {
        id: 'question-789',
        title: 'Choose the correct verb form.'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais como null', async () => {
      const validData = {
        id: 'question-101',
        title: 'What does "beautiful" mean?',
        cefr: null,
        type: null,
        theme: null,
        optionA: null,
        optionB: null,
        optionC: null,
        response: null
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais undefined', async () => {
      const validData = {
        id: 'question-202',
        title: 'Complete the sentence: She ___ to work every day.',
        cefr: undefined,
        type: undefined,
        theme: undefined,
        optionA: undefined,
        optionB: undefined,
        optionC: undefined,
        response: undefined
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - ID', () => {
    it('deve falhar com ID vazio', async () => {
      const invalidData = { id: '' }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[ID é obrigatório]')
      )
    })

    it('deve falhar sem campo id', async () => {
      const invalidData = { title: 'Some question' }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com id null', async () => {
      const invalidData = { id: null }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - título', () => {
    it('deve falhar com título vazio quando fornecido', async () => {
      const invalidData = {
        id: 'question-123',
        title: ''
      }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Título é obrigatório]')
      )
    })

    it('deve falhar com title null quando fornecido', async () => {
      const invalidData = {
        id: 'question-123',
        title: null
      }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - CEFR', () => {
    it('deve falhar com CEFR muito longo', async () => {
      const invalidData = {
        id: 'question-123',
        cefr: 'A1-INTERMEDIATE-ADVANCED'
      }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[CEFR deve ter no máximo 10 caracteres]')
      )
    })

    it('deve aceitar CEFR com exatamente 10 caracteres', async () => {
      const validData = {
        id: 'question-123',
        cefr: '1234567890'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - tipo', () => {
    it('deve falhar com tipo muito longo', async () => {
      const invalidData = {
        id: 'question-123',
        type: 'multiple-choice-with-very-long-description-that-exceeds-limit'
      }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Tipo deve ter no máximo 50 caracteres]')
      )
    })

    it('deve aceitar tipo com exatamente 50 caracteres', async () => {
      const validData = {
        id: 'question-123',
        type: '12345678901234567890123456789012345678901234567890'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - tema', () => {
    it('deve falhar com tema muito longo', async () => {
      const invalidData = {
        id: 'question-123',
        theme: 'English Grammar and Vocabulary with focus on present tense, past tense, future tense and conditional structures with detailed explanations and examples'
      }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Tema deve ter no máximo 100 caracteres]')
      )
    })

    it('deve aceitar tema com exatamente 100 caracteres', async () => {
      const validData = {
        id: 'question-123',
        theme: 'English Grammar and Vocabulary with focus on present tense, past tense and future tense structures'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - resposta', () => {
    it('deve falhar com resposta muito longa', async () => {
      const invalidData = {
        id: 'question-123',
        response: 'OPTION-A-IS-CORRECT'
      }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Resposta deve ter no máximo 10 caracteres]')
      )
    })

    it('deve aceitar resposta com exatamente 10 caracteres', async () => {
      const validData = {
        id: 'question-123',
        response: '1234567890'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com múltiplos campos inválidos', async () => {
      const invalidData = {
        id: '',
        title: '',
        cefr: 'A1-INTERMEDIATE-ADVANCED-LEVEL',
        type: 'multiple-choice-with-very-long-description-that-exceeds-the-maximum-allowed-limit',
        theme: 'English Grammar and Vocabulary with focus on present tense, past tense, future tense and conditional structures with detailed explanations',
        response: 'OPTION-A-IS-THE-CORRECT-ANSWER'
      }
      
      await expect(validateDTOQuestionUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOQuestionUpdate(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOQuestionUpdate({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar strings vazias em campos opcionais', async () => {
      const validData = {
        id: 'question-123',
        cefr: '',
        type: '',
        theme: '',
        optionA: '',
        optionB: '',
        optionC: '',
        response: ''
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação das opções', () => {
    it('deve aceitar opções com conteúdo longo', async () => {
      const validData = {
        id: 'question-123',
        optionA: 'This is a very long option that contains detailed explanation about the grammatical structure',
        optionB: 'Another long option with comprehensive details about English grammar rules and usage',
        optionC: 'Third option with complete description of the correct answer and explanation'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar apenas algumas opções preenchidas', async () => {
      const validData = {
        id: 'question-123',
        optionA: 'First pronunciation option',
        optionB: null,
        optionC: 'Third pronunciation option'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar atualização parcial - apenas título', async () => {
      const validData = {
        id: 'question-456',
        title: 'What is the past tense of "run"?'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar atualização parcial - apenas opções', async () => {
      const validData = {
        id: 'question-789',
        optionA: 'ran',
        optionB: 'runned',
        optionC: 'running',
        response: 'A'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar atualização completa de questão de gramática', async () => {
      const validData = {
        id: 'grammar-001',
        title: 'Choose the correct form of the verb "to be".',
        cefr: 'A1',
        type: 'grammar',
        theme: 'Verb To Be',
        optionA: 'I am a student',
        optionB: 'I is a student',
        optionC: 'I are a student',
        response: 'A'
      }
      const result = await validateDTOQuestionUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })
})
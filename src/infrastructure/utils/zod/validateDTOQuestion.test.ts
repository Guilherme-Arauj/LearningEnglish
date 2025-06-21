import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOQuestion } from './validateDTOQuestion'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOQuestion', () => {
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
    it('deve validar questão completa', async () => {
      const validData = {
        title: 'What is the capital of Brazil?',
        cefr: 'A1',
        type: 'multiple-choice',
        theme: 'Geography',
        optionA: 'São Paulo',
        optionB: 'Rio de Janeiro',
        optionC: 'Brasília',
        response: 'C'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar questão apenas com título obrigatório', async () => {
      const validData = { title: 'What is your favorite color?' }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais como null', async () => {
      const validData = {
        title: 'How do you say "hello" in English?',
        cefr: null,
        type: null,
        theme: null,
        optionA: null,
        optionB: null,
        optionC: null,
        response: null
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais undefined', async () => {
      const validData = {
        title: 'Complete the sentence: I ___ to school every day.',
        cefr: undefined,
        type: undefined,
        theme: undefined,
        optionA: undefined,
        optionB: undefined,
        optionC: undefined,
        response: undefined
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - título', () => {
    it('deve falhar com título vazio', async () => {
      const invalidData = { title: '' }
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Título é obrigatório]')
      )
    })

    it('deve falhar sem campo title', async () => {
      const invalidData = {}
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com title null', async () => {
      const invalidData = { title: null }
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - CEFR', () => {
    it('deve falhar com CEFR muito longo', async () => {
      const invalidData = {
        title: 'Which word is a noun?',
        cefr: 'A1-INTERMEDIATE-ADVANCED'
      }
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[CEFR deve ter no máximo 10 caracteres]')
      )
    })

    it('deve aceitar CEFR com exatamente 10 caracteres', async () => {
      const validData = {
        title: 'Choose the correct preposition.',
        cefr: '1234567890'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - tipo', () => {
    it('deve falhar com tipo muito longo', async () => {
      const invalidData = {
        title: 'What does "beautiful" mean?',
        type: 'multiple-choice-with-very-long-description-that-exceeds-limit'
      }
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Tipo deve ter no máximo 50 caracteres]')
      )
    })

    it('deve aceitar tipo com exatamente 50 caracteres', async () => {
      const validData = {
        title: 'Translate this word to English.',
        type: '12345678901234567890123456789012345678901234567890'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - tema', () => {
    it('deve falhar com tema muito longo', async () => {
      const invalidData = {
        title: 'What is the present continuous form?',
        theme: 'English Grammar and Vocabulary with focus on present tense, past tense, future tense and conditional structures with detailed explanations and examples'
      }
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Tema deve ter no máximo 100 caracteres]')
      )
    })

    it('deve aceitar tema com exatamente 100 caracteres', async () => {
      const validData = {
        title: 'Choose the correct verb form.',
        theme: 'English Grammar and Vocabulary with focus on present tense, past tense and future tense structures'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - resposta', () => {
    it('deve falhar com resposta muito longa', async () => {
      const invalidData = {
        title: 'Which option is correct?',
        response: 'OPTION-A-IS-CORRECT'
      }
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Resposta deve ter no máximo 10 caracteres]')
      )
    })

    it('deve aceitar resposta com exatamente 10 caracteres', async () => {
      const validData = {
        title: 'Select the right answer.',
        response: '1234567890'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com múltiplos campos inválidos', async () => {
      const invalidData = {
        title: '',
        cefr: 'A1-INTERMEDIATE-ADVANCED-LEVEL',
        type: 'multiple-choice-with-very-long-description-that-exceeds-the-maximum-allowed-limit',
        theme: 'English Grammar and Vocabulary with focus on present tense, past tense, future tense and conditional structures with detailed explanations',
        response: 'OPTION-A-IS-THE-CORRECT-ANSWER'
      }
      
      await expect(validateDTOQuestion(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOQuestion(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOQuestion({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar strings vazias em campos opcionais', async () => {
      const validData = {
        title: 'What is the meaning of this word?',
        cefr: '',
        type: '',
        theme: '',
        optionA: '',
        optionB: '',
        optionC: '',
        response: ''
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação das opções', () => {
    it('deve aceitar opções com conteúdo longo', async () => {
      const validData = {
        title: 'Which sentence is grammatically correct?',
        optionA: 'This is a very long option that contains detailed explanation about the grammatical structure',
        optionB: 'Another long option with comprehensive details about English grammar rules and usage',
        optionC: 'Third option with complete description of the correct answer and explanation'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar apenas algumas opções preenchidas', async () => {
      const validData = {
        title: 'Choose the correct pronunciation.',
        optionA: 'First pronunciation option',
        optionB: null,
        optionC: 'Third pronunciation option'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar questão de múltipla escolha completa', async () => {
      const validData = {
        title: 'What is the past tense of "go"?',
        cefr: 'A2',
        type: 'grammar',
        theme: 'Irregular Verbs',
        optionA: 'goed',
        optionB: 'went',
        optionC: 'gone',
        response: 'B'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar questão aberta simples', async () => {
      const validData = {
        title: 'Describe your morning routine in English.',
        cefr: 'B1',
        type: 'writing',
        theme: 'Daily Routine'
      }
      const result = await validateDTOQuestion(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })
})
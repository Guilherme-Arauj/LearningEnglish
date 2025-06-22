import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOUserEmail } from './validateDTOUserEmail'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOUserEmail', () => {
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
    it('deve validar email simples', async () => {
      const validData = { email: 'user@example.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com subdomínio', async () => {
      const validData = { email: 'user@mail.example.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com números', async () => {
      const validData = { email: 'user123@test.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com pontos no nome', async () => {
      const validData = { email: 'user.name@example.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com hífen no domínio', async () => {
      const validData = { email: 'user@my-domain.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com extensão longa', async () => {
      const validData = { email: 'student@university.education' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com números no domínio', async () => {
      const validData = { email: 'admin@domain123.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro', () => {
    it('deve falhar com email inválido sem @', async () => {
      const invalidData = { email: 'userexample.com' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Formato de email inválido]')
      )
    })

    it('deve falhar com email sem domínio', async () => {
      const invalidData = { email: 'user@' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Formato de email inválido]')
      )
    })

    it('deve falhar com email sem nome de usuário', async () => {
      const invalidData = { email: '@example.com' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com email vazio', async () => {
      const invalidData = { email: '' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo email', async () => {
      const invalidData = {}
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com email null', async () => {
      const invalidData = { email: null }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com múltiplos @', async () => {
      const invalidData = { email: 'user@@example.com' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com domínio sem extensão', async () => {
      const invalidData = { email: 'user@domain' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com espaços no email', async () => {
      const invalidData = { email: 'user @example.com' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com caracteres especiais inválidos', async () => {
      const invalidData = { email: 'user#@example.com' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOUserEmail(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOUserEmail({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com email undefined', async () => {
      const invalidData = { email: undefined }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com tipo incorreto', async () => {
      const invalidData = { email: 123 }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com array', async () => {
      const invalidData = { email: ['user@example.com'] }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto', async () => {
      const invalidData = { email: { value: 'user@example.com' } }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar email de estudante', async () => {
      const validData = { email: 'student@englishcourse.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email de administrador', async () => {
      const validData = { email: 'admin@system.edu' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email corporativo', async () => {
      const validData = { email: 'john.doe@company.co.uk' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email acadêmico', async () => {
      const validData = { email: 'researcher@university.ac.br' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com números e pontos', async () => {
      const validData = { email: 'user.123@test-domain.org' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('formatos específicos', () => {
    it('deve validar email com underline', async () => {
      const validData = { email: 'user_name@example.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com múltiplos pontos no domínio', async () => {
      const validData = { email: 'user@mail.google.com' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar email com extensão de país', async () => {
      const validData = { email: 'user@example.com.br' }
      const result = await validateDTOUserEmail(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve falhar com ponto no final', async () => {
      const invalidData = { email: 'user@example.com.' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com ponto no início', async () => {
      const invalidData = { email: '.user@example.com' }
      
      await expect(validateDTOUserEmail(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })
})
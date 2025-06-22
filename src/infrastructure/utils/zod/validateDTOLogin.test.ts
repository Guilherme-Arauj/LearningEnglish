import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOLogin } from './validateDTOLogin'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOLogin', () => {
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
    it('deve validar email e senha corretos', async () => {
      const validData = { 
        email: 'user@example.com', 
        password: '123456' 
      }
      const result = await validateDTOLogin(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar senha com mais de 6 caracteres', async () => {
      const validData = { 
        email: 'test@domain.com', 
        password: 'senhaSegura123' 
      }
      const result = await validateDTOLogin(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar email com subdomínio', async () => {
      const validData = { 
        email: 'user@mail.example.com', 
        password: 'password123' 
      }
      const result = await validateDTOLogin(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar email com números', async () => {
      const validData = { 
        email: 'user123@test.com', 
        password: 'mypass' 
      }
      const result = await validateDTOLogin(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - email', () => {
    it('deve falhar com email inválido sem @', async () => {
      const invalidData = { 
        email: 'userexample.com', 
        password: '123456' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Formato de email inválido]')
      )
    })

    it('deve falhar com email sem domínio', async () => {
      const invalidData = { 
        email: 'user@', 
        password: '123456' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Formato de email inválido]')
      )
    })

    it('deve falhar com email vazio', async () => {
      const invalidData = { 
        email: '', 
        password: '123456' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo email', async () => {
      const invalidData = { 
        password: '123456' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - senha', () => {
    it('deve falhar com senha muito curta', async () => {
      const invalidData = { 
        email: 'user@example.com', 
        password: '12345' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Senha deve ter no mínimo 6 caracteres]')
      )
    })

    it('deve falhar com senha vazia', async () => {
      const invalidData = { 
        email: 'user@example.com', 
        password: '' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo password', async () => {
      const invalidData = { 
        email: 'user@example.com' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com email e senha inválidos', async () => {
      const invalidData = { 
        email: 'invalid-email', 
        password: '123' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })

    it('deve falhar com campos vazios', async () => {
      const invalidData = { 
        email: '', 
        password: '' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOLogin(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOLogin({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com email com espaços', async () => {
      const invalidData = { 
        email: 'user @example.com', 
        password: '123456' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar senha exatamente com 6 caracteres', async () => {
      const validData = { 
        email: 'user@example.com', 
        password: '123456' 
      }
      const result = await validateDTOLogin(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('formato do email', () => {
    it('deve aceitar email com pontos no nome', async () => {
      const validData = { 
        email: 'user.name@example.com', 
        password: '123456' 
      }
      const result = await validateDTOLogin(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar email com hífen no domínio', async () => {
      const validData = { 
        email: 'user@my-domain.com', 
        password: '123456' 
      }
      const result = await validateDTOLogin(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve falhar com múltiplos @', async () => {
      const invalidData = { 
        email: 'user@@example.com', 
        password: '123456' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com domínio sem extensão', async () => {
      const invalidData = { 
        email: 'user@domain', 
        password: '123456' 
      }
      
      await expect(validateDTOLogin(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })
})
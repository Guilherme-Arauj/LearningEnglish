import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOUser } from './validateDTOUser'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOUser', () => {
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
    it('deve validar usuário estudante completo', async () => {
      const validData = {
        email: 'student@example.com',
        name: 'John Doe',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar usuário admin completo', async () => {
      const validData = {
        email: 'admin@example.com',
        name: 'Jane Smith',
        password: 'adminpass123',
        privilege: 'admin',
        cefr: 'C2'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar senha com mais de 6 caracteres', async () => {
      const validData = {
        email: 'user@test.com',
        name: 'Test User',
        password: 'verylongpassword123',
        privilege: 'student',
        cefr: 'B1'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar nome com espaços', async () => {
      const validData = {
        email: 'maria@example.com',
        name: 'Maria da Silva Santos',
        password: 'password123',
        privilege: 'student',
        cefr: 'A2'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar CEFR vazio', async () => {
      const validData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'newpass',
        privilege: 'student',
        cefr: ''
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - email', () => {
    it('deve falhar com email inválido sem @', async () => {
      const invalidData = {
        email: 'userexample.com',
        name: 'User Test',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Formato de email inválido]')
      )
    })

    it('deve falhar com email sem domínio', async () => {
      const invalidData = {
        email: 'user@',
        name: 'User Test',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com email vazio', async () => {
      const invalidData = {
        email: '',
        name: 'User Test',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo email', async () => {
      const invalidData = {
        name: 'User Test',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - nome', () => {
    it('deve falhar com nome vazio', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: '',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Nome é obrigatório]')
      )
    })

    it('deve falhar sem campo name', async () => {
      const invalidData = {
        email: 'user@example.com',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com name null', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: null,
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - senha', () => {
    it('deve falhar com senha muito curta', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '12345',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Senha deve ter no mínimo 6 caracteres]')
      )
    })

    it('deve falhar com senha vazia', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo password', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        privilege: 'student',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar senha exatamente com 6 caracteres', async () => {
      const validData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - privilégio', () => {
    it('deve falhar com privilégio inválido', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '123456',
        privilege: 'teacher',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining("Privilégio inválido! Use 'student' ou 'admin'.")
      )
    })

    it('deve falhar com privilégio vazio', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '123456',
        privilege: '',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo privilege', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '123456',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com privilégio case sensitive', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '123456',
        privilege: 'STUDENT',
        cefr: 'A1'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - CEFR', () => {
    it('deve falhar sem campo cefr', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '123456',
        privilege: 'student'
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com cefr null', async () => {
      const invalidData = {
        email: 'user@example.com',
        name: 'User Test',
        password: '123456',
        privilege: 'student',
        cefr: null
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com múltiplos campos inválidos', async () => {
      const invalidData = {
        email: 'invalid-email',
        name: '',
        password: '123',
        privilege: 'invalid',
        cefr: null
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })

    it('deve falhar com campos vazios', async () => {
      const invalidData = {
        email: '',
        name: '',
        password: '',
        privilege: '',
        cefr: ''
      }
      
      await expect(validateDTOUser(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOUser(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOUser({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar email com subdomínio', async () => {
      const validData = {
        email: 'user@mail.example.com',
        name: 'User Test',
        password: '123456',
        privilege: 'student',
        cefr: 'B2'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar email com números', async () => {
      const validData = {
        email: 'user123@test.com',
        name: 'User Test',
        password: '123456',
        privilege: 'admin',
        cefr: 'C1'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar estudante iniciante', async () => {
      const validData = {
        email: 'beginner@english.com',
        name: 'English Beginner',
        password: 'mypass123',
        privilege: 'student',
        cefr: 'A1'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar administrador do sistema', async () => {
      const validData = {
        email: 'admin@englishsystem.com',
        name: 'System Administrator',
        password: 'secureAdminPass2024',
        privilege: 'admin',
        cefr: 'C2'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar estudante avançado', async () => {
      const validData = {
        email: 'advanced.student@university.edu',
        name: 'Advanced English Student',
        password: 'advancedpass',
        privilege: 'student',
        cefr: 'C1'
      }
      const result = await validateDTOUser(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })
})
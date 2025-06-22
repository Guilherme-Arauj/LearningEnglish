import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOUserUpdate } from './validateDTOUserUpdate'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOUserUpdate', () => {
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
    it('deve validar atualização completa do usuário', async () => {
      const validData = {
        id: 'STUDENT-abc123',
        email: 'student@example.com',
        name: 'John Doe',
        password: '123456',
        privilege: 'student',
        cefr: 'A1'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar apenas com ID obrigatório', async () => {
      const validData = { id: 'ADMIN-xyz789' }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar ID e email apenas', async () => {
      const validData = {
        id: 'STUDENT-test01',
        email: 'newemail@example.com'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar ID e nome apenas', async () => {
      const validData = {
        id: 'ADMIN-user01',
        name: 'New Name'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar ID e senha apenas', async () => {
      const validData = {
        id: 'STUDENT-maria456',
        password: 'newpassword123'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar ID e privilégio apenas', async () => {
      const validData = {
        id: 'STUDENT-john123',
        privilege: 'admin'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar ID e CEFR apenas', async () => {
      const validData = {
        id: 'ADMIN-system01',
        cefr: 'B2'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar campos opcionais undefined', async () => {
      const validData = {
        id: 'STUDENT-test123',
        email: undefined,
        name: undefined,
        password: undefined,
        privilege: undefined,
        cefr: undefined
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - ID', () => {
    it('deve falhar com ID muito curto', async () => {
      const invalidData = {
        id: 'STUDENT',
        email: 'test@example.com'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)]')
      )
    })

    it('deve falhar com prefixo inválido', async () => {
      const invalidData = {
        id: 'INVALID-123456',
        name: 'Test User'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining("[ID deve começar com 'STUDENT-' ou 'ADMIN-']")
      )
    })

    it('deve falhar com ID vazio', async () => {
      const invalidData = {
        id: '',
        password: '123456'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo id', async () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test User'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com case sensitive no prefixo', async () => {
      const invalidData = {
        id: 'student-123456',
        name: 'Test User'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - email', () => {
    it('deve falhar com email inválido quando fornecido', async () => {
      const invalidData = {
        id: 'STUDENT-abc123',
        email: 'invalid-email'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Formato de email inválido]')
      )
    })

    it('deve falhar com email sem @', async () => {
      const invalidData = {
        id: 'ADMIN-xyz789',
        email: 'userexample.com'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com email vazio quando fornecido', async () => {
      const invalidData = {
        id: 'STUDENT-test01',
        email: ''
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - nome', () => {
    it('deve falhar com nome vazio quando fornecido', async () => {
      const invalidData = {
        id: 'ADMIN-user01',
        name: ''
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Nome é obrigatório]')
      )
    })

    it('deve falhar com name null quando fornecido', async () => {
      const invalidData = {
        id: 'STUDENT-maria456',
        name: null
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - senha', () => {
    it('deve falhar com senha muito curta quando fornecida', async () => {
      const invalidData = {
        id: 'STUDENT-john123',
        password: '12345'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Senha deve ter no mínimo 6 caracteres]')
      )
    })

    it('deve falhar com senha vazia quando fornecida', async () => {
      const invalidData = {
        id: 'ADMIN-system01',
        password: ''
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com password null quando fornecido', async () => {
      const invalidData = {
        id: 'STUDENT-test123',
        password: null
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - privilégio', () => {
    it('deve falhar com privilégio inválido quando fornecido', async () => {
      const invalidData = {
        id: 'ADMIN-user01',
        privilege: 'teacher'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining("Privilégio inválido! Use 'student' ou 'admin'.")
      )
    })

    it('deve falhar com privilégio vazio quando fornecido', async () => {
      const invalidData = {
        id: 'STUDENT-maria456',
        privilege: ''
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com privilégio case sensitive', async () => {
      const invalidData = {
        id: 'ADMIN-system01',
        privilege: 'ADMIN'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com múltiplos campos inválidos', async () => {
      const invalidData = {
        id: 'INVALID',
        email: 'invalid-email',
        name: '',
        password: '123',
        privilege: 'teacher'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })

    it('deve falhar com ID inválido e outros campos válidos', async () => {
      const invalidData = {
        id: 'SHORT',
        email: 'valid@example.com',
        name: 'Valid Name',
        password: 'validpass',
        privilege: 'student'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOUserUpdate(null as any, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOUserUpdate({}, mockRes))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar email com subdomínio', async () => {
      const validData = {
        id: 'STUDENT-test01',
        email: 'user@mail.example.com'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar nome com espaços', async () => {
      const validData = {
        id: 'ADMIN-user01',
        name: 'Maria da Silva Santos'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar CEFR vazio', async () => {
      const validData = {
        id: 'STUDENT-maria456',
        cefr: ''
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar atualização apenas do email', async () => {
      const validData = {
        id: 'STUDENT-john123',
        email: 'john.new@example.com'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar atualização apenas do nome', async () => {
      const validData = {
        id: 'ADMIN-system01',
        name: 'System Administrator Updated'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar mudança de privilégio de student para admin', async () => {
      const validData = {
        id: 'STUDENT-maria456',
        privilege: 'admin'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar atualização do CEFR', async () => {
      const validData = {
        id: 'STUDENT-beginner01',
        cefr: 'B1'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar atualização parcial múltipla', async () => {
      const validData = {
        id: 'ADMIN-teacher01',
        email: 'teacher.updated@school.com',
        name: 'Updated Teacher Name',
        cefr: 'C2'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar reset de senha', async () => {
      const validData = {
        id: 'STUDENT-forgot123',
        password: 'newSecurePassword2024'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('combinações de campos', () => {
    it('deve validar email e nome juntos', async () => {
      const validData = {
        id: 'STUDENT-combo01',
        email: 'combo@example.com',
        name: 'Combo User'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar senha e privilégio juntos', async () => {
      const validData = {
        id: 'ADMIN-combo02',
        password: 'newpass123',
        privilege: 'student'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve validar todos os campos exceto ID', async () => {
      const validData = {
        id: 'STUDENT-full123',
        email: 'full@example.com',
        name: 'Full Update User',
        password: 'fullpass123',
        privilege: 'admin',
        cefr: 'C1'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })
  })

  describe('formato do ID', () => {
    it('deve aceitar ID com exatamente 8 caracteres', async () => {
      const validData = {
        id: 'ADMIN-01',
        name: 'Test User'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ID longo', async () => {
      const validData = {
        id: 'STUDENT-very-long-identifier-123',
        email: 'long@example.com'
      }
      const result = await validateDTOUserUpdate(validData, mockRes)
      expect(result).toEqual(validData)
    })

    it('deve falhar com ID de 7 caracteres', async () => {
      const invalidData = {
        id: 'ADMIN-x',
        name: 'Test User'
      }
      
      await expect(validateDTOUserUpdate(invalidData, mockRes))
        .rejects.toThrow('Dados inválidos')
    })
  })
})
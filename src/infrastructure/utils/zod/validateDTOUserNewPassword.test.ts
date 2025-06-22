import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { validateDTOUserNewPassword } from './validateDTOUserNewPassword'

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('validateDTOUserNewPassword', () => {
  beforeEach(() => {
    // Setup if needed
  })

  afterEach(() => {
    mockConsoleError.mockClear()
    vi.clearAllMocks()
  })

  describe('validação com sucesso', () => {
    it('deve validar ID de estudante com senha válida', async () => {
      const validData = {
        id: 'STUDENT-abc123',
        password: '123456'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve validar ID de admin com senha válida', async () => {
      const validData = {
        id: 'ADMIN-xyz789',
        password: 'adminpass123'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ID com mais de 8 caracteres', async () => {
      const validData = {
        id: 'STUDENT-123456789',
        password: 'newpassword'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ID de admin longo', async () => {
      const validData = {
        id: 'ADMIN-abcdef123456',
        password: 'securepass'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve aceitar senha com mais de 6 caracteres', async () => {
      const validData = {
        id: 'STUDENT-test01',
        password: 'verylongpassword123'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve aceitar senha exatamente com 6 caracteres', async () => {
      const validData = {
        id: 'ADMIN-user01',
        password: '123456'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })
  })

  describe('validação com erro - ID', () => {
    it('deve falhar com ID muito curto', async () => {
      const invalidData = {
        id: 'STUDENT',
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)]')
      )
    })

    it('deve falhar com prefixo inválido', async () => {
      const invalidData = {
        id: 'INVALID-123456',
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
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
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo id', async () => {
      const invalidData = {
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com prefixo parcial STUDENT', async () => {
      const invalidData = {
        id: 'STUDEN-123456',
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com prefixo parcial ADMIN', async () => {
      const invalidData = {
        id: 'ADMI-123456',
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com case sensitive', async () => {
      const invalidData = {
        id: 'student-123456',
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com espaços no ID', async () => {
      const invalidData = {
        id: 'STUDENT - 123456',
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com erro - senha', () => {
    it('deve falhar com senha muito curta', async () => {
      const invalidData = {
        id: 'STUDENT-abc123',
        password: '12345'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[Senha deve ter no mínimo 6 caracteres]')
      )
    })

    it('deve falhar com senha vazia', async () => {
      const invalidData = {
        id: 'ADMIN-xyz789',
        password: ''
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar sem campo password', async () => {
      const invalidData = {
        id: 'STUDENT-test01'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com password null', async () => {
      const invalidData = {
        id: 'ADMIN-user01',
        password: null
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com password undefined', async () => {
      const invalidData = {
        id: 'STUDENT-abc123',
        password: undefined
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('validação com múltiplos erros', () => {
    it('deve falhar com ID e senha inválidos', async () => {
      const invalidData = {
        id: 'INVALID',
        password: '123'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalled()
    })

    it('deve falhar com campos vazios', async () => {
      const invalidData = {
        id: '',
        password: ''
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('edge cases', () => {
    it('deve falhar com null', async () => {
      await expect(validateDTOUserNewPassword(null as any))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve falhar com objeto vazio', async () => {
      await expect(validateDTOUserNewPassword({}))
        .rejects.toThrow('Dados inválidos')
    })

    it('deve aceitar STUDENT com hífens no ID', async () => {
      const validData = {
        id: 'STUDENT-abc-123',
        password: '123456'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ADMIN com números e letras', async () => {
      const validData = {
        id: 'ADMIN-a1b2c3',
        password: 'newpass123'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })
  })

  describe('casos de uso reais', () => {
    it('deve validar alteração de senha de estudante', async () => {
      const validData = {
        id: 'STUDENT-john123',
        password: 'mynewpassword2024'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve validar alteração de senha de admin', async () => {
      const validData = {
        id: 'ADMIN-system01',
        password: 'secureAdminPass123'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve validar senha com caracteres especiais', async () => {
      const validData = {
        id: 'STUDENT-maria456',
        password: 'myPass@2024!'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve validar ID longo com senha simples', async () => {
      const validData = {
        id: 'ADMIN-administrator-001',
        password: 'simple'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })
  })

  describe('formato do ID', () => {
    it('deve aceitar ID com exatamente 8 caracteres válidos', async () => {
      const validData = {
        id: 'ADMIN-01',
        password: '123456'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve aceitar STUDENT- seguido de caracteres', async () => {
      const validData = {
        id: 'STUDENT-a',
        password: '123456'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve aceitar ADMIN- seguido de dois caracteres', async () => {
      const validData = {
        id: 'ADMIN-xy',
        password: '123456'
      }
      const result = await validateDTOUserNewPassword(validData)
      expect(result).toEqual(validData)
    })

    it('deve falhar com ADMIN- seguido de apenas um caractere', async () => {
      const invalidData = {
        id: 'ADMIN-x',
        password: '123456'
      }
      
      await expect(validateDTOUserNewPassword(invalidData))
        .rejects.toThrow('Dados inválidos')
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro de validação:',
        expect.stringContaining('[ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)]')
      )
    })
  })
})
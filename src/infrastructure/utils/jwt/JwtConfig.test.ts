import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtConfig } from './JwtConfig'
import type { IJwtConfig } from './IJwtConfig'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockImplementation(() => ''),
    verify: vi.fn().mockImplementation(() => ({}))
  }
}))

describe('JwtConfig', () => {
  let jwtConfig: IJwtConfig
  const secretKey = 'test-secret-key'

  beforeEach(() => {
    jwtConfig = new JwtConfig(secretKey)
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('deve inicializar com a chave secreta fornecida', () => {
      const instance = new JwtConfig('minha-chave-secreta')

      expect(instance).toBeInstanceOf(JwtConfig)
    })
  })

  describe('sign', () => {
    it('deve gerar token com payload simples', () => {
      const payload = { userId: 123, email: 'test@test.com' }
      const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      
      const mockSign = vi.mocked(jwt.sign) as any
      mockSign.mockReturnValue(expectedToken)

      const result = jwtConfig.sign(payload)

      expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, undefined)
      expect(jwt.sign).toHaveBeenCalledTimes(1)
      expect(result).toBe(expectedToken)
    })

    it('deve gerar token com payload e opções', () => {
      const payload = { userId: 456 }
      const options = { 
        expiresIn: '1h' as any, 
        algorithm: 'HS256' as any
      }
      const expectedToken = 'token-with-options'
      
      const mockSign = vi.mocked(jwt.sign) as any
      mockSign.mockReturnValue(expectedToken)

      const result = jwtConfig.sign(payload, options)

      expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, options)
      expect(result).toBe(expectedToken)
    })

    it('deve gerar token com expiração numérica', () => {
      const payload = { userId: 789 }
      const options = { 
        expiresIn: 3600,
        issuer: 'test-app'
      }
      const expectedToken = 'token-with-numeric-expiry'
      
      const mockSign = vi.mocked(jwt.sign) as any
      mockSign.mockReturnValue(expectedToken)

      const result = jwtConfig.sign(payload, options)

      expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, options)
      expect(result).toBe(expectedToken)
    })

    it('deve gerar token com diferentes formatos de expiração', () => {
      const payload = { userId: 999 }
      const options = {
        expiresIn: '2d' as any,
        algorithm: 'HS256' as any,
        issuer: 'my-app',
        audience: 'my-users'
      }
      const expectedToken = 'full-options-token'
      
      const mockSign = vi.mocked(jwt.sign) as any
      mockSign.mockReturnValue(expectedToken)

      const result = jwtConfig.sign(payload, options)

      expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, options)
      expect(result).toBe(expectedToken)
    })

    it('deve gerar token sem opções', () => {
      const payload = { role: 'admin' }
      const expectedToken = 'no-options-token'
      
      const mockSign = vi.mocked(jwt.sign) as any
      mockSign.mockReturnValue(expectedToken)

      const result = jwtConfig.sign(payload)

      expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, undefined)
      expect(result).toBe(expectedToken)
    })
  })

  describe('verify', () => {
    it('deve verificar token válido e retornar payload', () => {
      const token = 'valid-token'
      const expectedPayload = { userId: 123, email: 'test@test.com' }
      
      const mockVerify = vi.mocked(jwt.verify) as any
      mockVerify.mockReturnValue(expectedPayload)

      const result = jwtConfig.verify(token)

      expect(jwt.verify).toHaveBeenCalledWith(token, secretKey)
      expect(jwt.verify).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedPayload)
    })

    it('deve retornar string quando jwt.verify retorna string', () => {
      const token = 'token-that-returns-string'
      const expectedResult = 'string-result'
      
      const mockVerify = vi.mocked(jwt.verify) as any
      mockVerify.mockReturnValue(expectedResult)

      const result = jwtConfig.verify(token)

      expect(result).toBe(expectedResult)
    })

    it('deve retornar null quando token é inválido', () => {
      const invalidToken = 'invalid-token'
      const error = new Error('Token inválido')
      
      const mockVerify = vi.mocked(jwt.verify) as any
      mockVerify.mockImplementation(() => {
        throw error
      })

      const result = jwtConfig.verify(invalidToken)

      expect(jwt.verify).toHaveBeenCalledWith(invalidToken, secretKey)
      expect(result).toBeNull()
    })

    it('deve retornar null quando token expirou', () => {
      const expiredToken = 'expired-token'
      const tokenExpiredError = new Error('TokenExpiredError')
      tokenExpiredError.name = 'TokenExpiredError'
      
      const mockVerify = vi.mocked(jwt.verify) as any
      mockVerify.mockImplementation(() => {
        throw tokenExpiredError
      })

      const result = jwtConfig.verify(expiredToken)

      expect(result).toBeNull()
    })

    it('deve retornar null para qualquer erro na verificação', () => {
      const token = 'problematic-token'
      const genericError = new Error('Erro genérico')
      
      const mockVerify = vi.mocked(jwt.verify) as any
      mockVerify.mockImplementation(() => {
        throw genericError
      })

      const result = jwtConfig.verify(token)

      expect(result).toBeNull()
    })
  })

  describe('edge cases', () => {
    it('deve lidar com payload vazio', () => {
      const payload = {}
      const expectedToken = 'empty-payload-token'
      
      const mockSign = vi.mocked(jwt.sign) as any
      mockSign.mockReturnValue(expectedToken)

      const result = jwtConfig.sign(payload)

      expect(result).toBe(expectedToken)
    })

    it('deve verificar token com payload complexo', () => {
      const token = 'complex-token'
      const complexPayload = {
        userId: 999,
        roles: ['admin', 'user'],
        metadata: {
          lastLogin: '2024-01-01',
          preferences: { theme: 'dark' }
        }
      }
      
      const mockVerify = vi.mocked(jwt.verify) as any
      mockVerify.mockReturnValue(complexPayload)

      const result = jwtConfig.verify(token)

      expect(result).toEqual(complexPayload)
    })
  })
})
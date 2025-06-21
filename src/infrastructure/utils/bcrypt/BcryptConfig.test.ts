import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as bcrypt from 'bcrypt'
import { BcryptConfig } from './BcryptConfig'
import type { IBcryptConfig } from './IBcryptConfig'

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockImplementation(() => Promise.resolve('')),
  compare: vi.fn().mockImplementation(() => Promise.resolve(false))
}))

describe('BcryptConfig', () => {
  let bcryptConfig: IBcryptConfig

  beforeEach(() => {
    bcryptConfig = new BcryptConfig()
    vi.clearAllMocks()
  })

  describe('hash', () => {
    it('deve gerar hash da senha com salt fornecido', async () => {
      const password = 'minhasenha123'
      const salt = 10
      const expectedHash = '$2b$10$hashedpassword'
      
      const mockHash = vi.mocked(bcrypt.hash) as any
      mockHash.mockResolvedValue(expectedHash)

      const result = await bcryptConfig.hash(password, salt)

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt)
      expect(bcrypt.hash).toHaveBeenCalledTimes(1)
      expect(result).toBe(expectedHash)
    })

    it('deve propagar erro quando bcrypt.hash falhar', async () => {
      const password = 'senha'
      const salt = 10
      const error = new Error('Erro no hash')
      
      const mockHash = vi.mocked(bcrypt.hash) as any
      mockHash.mockRejectedValue(error)

      await expect(bcryptConfig.hash(password, salt)).rejects.toThrow('Erro no hash')
    })
  })

  describe('compare', () => {
    it('deve retornar true quando senha corresponder ao hash', async () => {
      const password = 'minhasenha123'
      const hashedPassword = '$2b$10$hashedpassword'
      
      const mockCompare = vi.mocked(bcrypt.compare) as any
      mockCompare.mockResolvedValue(true)

      const result = await bcryptConfig.compare(password, hashedPassword)

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('deve retornar false quando senha não corresponder ao hash', async () => {
      const password = 'senhaerrada'
      const hashedPassword = '$2b$10$hashedpassword'
      
      const mockCompare = vi.mocked(bcrypt.compare) as any
      mockCompare.mockResolvedValue(false)

      const result = await bcryptConfig.compare(password, hashedPassword)

      expect(result).toBe(false)
    })

    it('deve propagar erro quando bcrypt.compare falhar', async () => {
      const password = 'senha'
      const hashedPassword = 'hash'
      const error = new Error('Erro na comparação')
      
      const mockCompare = vi.mocked(bcrypt.compare) as any
      mockCompare.mockRejectedValue(error)

      await expect(bcryptConfig.compare(password, hashedPassword)).rejects.toThrow('Erro na comparação')
    })
  })
})
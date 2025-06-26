import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RedefinirSenha } from './RedefinirSenha'
import { UserResponseDTO } from '../dto/UserResponseDTO'

describe('RedefinirSenha Use Case', () => {
  let userRepositoryMock: any
  let bcryptConfigMock: any
  let redefinirSenhaUseCase: RedefinirSenha

  beforeEach(() => {
    userRepositoryMock = {
      changePassword: vi.fn()
    }
    bcryptConfigMock = {
      hash: vi.fn()
    }
    redefinirSenhaUseCase = new RedefinirSenha(userRepositoryMock, bcryptConfigMock)
  })

  it('deve hashear a nova senha, atualizar o usuário e retornar UserResponseDTO', async () => {
    const dto = {
      id: 'USER-123',
      password: 'novaSenha123'
    }

    const hashedPassword = 'hashedNovaSenha123'

    const updatedUser = {
      id: dto.id,
      name: 'João Silva',
      email: 'joao@example.com',
      privilege: 'student',
      cefr: 'B1'
    }

    bcryptConfigMock.hash.mockResolvedValue(hashedPassword)
    userRepositoryMock.changePassword.mockResolvedValue(updatedUser)

    const result = await redefinirSenhaUseCase.execute(dto)

    expect(bcryptConfigMock.hash).toHaveBeenCalledWith(dto.password, 10)
    expect(userRepositoryMock.changePassword).toHaveBeenCalledWith(dto.id, hashedPassword)
    expect(result).toBeInstanceOf(UserResponseDTO)
    expect(result).toEqual(
      new UserResponseDTO(
        updatedUser.id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.privilege,
        updatedUser.cefr
      )
    )
  })
})
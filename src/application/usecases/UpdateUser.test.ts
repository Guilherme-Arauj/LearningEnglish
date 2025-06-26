import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateUser } from './UpdateUser'
import { User } from '../../domain/entities/User'
import { UserResponseDTO } from '../dto/UserResponseDTO'

describe('UpdateUser Use Case', () => {
  let userRepositoryMock: any
  let bcryptConfigMock: any
  let updateUserUseCase: UpdateUser

  beforeEach(() => {
    userRepositoryMock = {
      findUserById: vi.fn(),
      updateUser: vi.fn()
    }
    bcryptConfigMock = {
      hash: vi.fn()
    }
    updateUserUseCase = new UpdateUser(userRepositoryMock, bcryptConfigMock)
  })

  it('deve atualizar usuário sem alterar senha', async () => {
    const dto = {
      id: 'USER-123',
      name: 'João Silva Atualizado',
      email: 'joao.novo@example.com',
      privilege: 'student',
      cefr: 'B2'
      // sem password
    }

    const existingUser = new User({
      id: dto.id,
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'hashedOldPassword',
      privilege: 'student',
      cefr: 'B1',
      userQuestionProgress: []
    })

    const updatedUser = new User({
      id: dto.id,
      name: dto.name,
      email: dto.email,
      password: existingUser.password, // senha antiga mantida
      privilege: dto.privilege,
      cefr: dto.cefr,
      userQuestionProgress: existingUser.userQuestionProgress
    })

    userRepositoryMock.findUserById.mockResolvedValue(existingUser)
    userRepositoryMock.updateUser.mockResolvedValue(updatedUser)

    const result = await updateUserUseCase.execute(dto)

    expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(dto.id)
    expect(bcryptConfigMock.hash).not.toHaveBeenCalled()
    expect(userRepositoryMock.updateUser).toHaveBeenCalledWith(updatedUser)
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

  it('deve atualizar usuário e alterar senha', async () => {
    const dto = {
      id: 'USER-123',
      name: 'João Silva Atualizado',
      email: 'joao.novo@example.com',
      privilege: 'student',
      cefr: 'B2',
      password: 'novaSenha123'
    }

    const existingUser = new User({
      id: dto.id,
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'hashedOldPassword',
      privilege: 'student',
      cefr: 'B1',
      userQuestionProgress: []
    })

    const hashedPassword = 'hashedNovaSenha123'

    const updatedUser = new User({
      id: dto.id,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      privilege: dto.privilege,
      cefr: dto.cefr,
      userQuestionProgress: existingUser.userQuestionProgress
    })

    userRepositoryMock.findUserById.mockResolvedValue(existingUser)
    bcryptConfigMock.hash.mockResolvedValue(hashedPassword)
    userRepositoryMock.updateUser.mockResolvedValue(updatedUser)

    const result = await updateUserUseCase.execute(dto)

    expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(dto.id)
    expect(bcryptConfigMock.hash).toHaveBeenCalledWith(dto.password, 10)
    expect(userRepositoryMock.updateUser).toHaveBeenCalledWith(updatedUser)
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

  it('deve lançar erro se usuário não for encontrado', async () => {
    userRepositoryMock.findUserById.mockResolvedValue(null)

    await expect(updateUserUseCase.execute({ id: 'USER-999' }))
      .rejects.toThrow('[Usuário não encontrado]')

    expect(userRepositoryMock.findUserById).toHaveBeenCalledWith('USER-999')
    expect(bcryptConfigMock.hash).not.toHaveBeenCalled()
    expect(userRepositoryMock.updateUser).not.toHaveBeenCalled()
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteUser } from './DeleteUser'
import { UserResponseDTO } from '../dto/UserResponseDTO'

describe('DeleteUser Use Case', () => {
  let userRepositoryMock: any
  let deleteUserUseCase: DeleteUser

  beforeEach(() => {
    userRepositoryMock = {
      deleteUserById: vi.fn()
    }
    deleteUserUseCase = new DeleteUser(userRepositoryMock)
  })

  it('deve deletar usuário e retornar UserResponseDTO', async () => {
    const dto = { id: 'USER-123456' }

    const deletedUser = new UserResponseDTO(
      'USER-123456',
      'João Silva',
      'joao@example.com',
      'student',
      'B1'
    )

    userRepositoryMock.deleteUserById.mockResolvedValue(deletedUser)

    const result = await deleteUserUseCase.execute(dto)

    expect(userRepositoryMock.deleteUserById).toHaveBeenCalledWith(dto.id)
    expect(result).toBeInstanceOf(UserResponseDTO)
    expect(result).toEqual(deletedUser)
  })

  it('deve retornar null se usuário não for encontrado', async () => {
    const dto = { id: 'USER-000000' }

    userRepositoryMock.deleteUserById.mockResolvedValue(null)

    const result = await deleteUserUseCase.execute(dto)

    expect(userRepositoryMock.deleteUserById).toHaveBeenCalledWith(dto.id)
    expect(result).toBeNull()
  })
})
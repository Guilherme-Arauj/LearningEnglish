import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetAllUsers } from './GetAllUsers'
import { UserResponseDTO } from '../dto/UserResponseDTO'

describe('GetAllUsers Use Case', () => {
  let userRepositoryMock: any
  let getAllUsersUseCase: GetAllUsers

  beforeEach(() => {
    userRepositoryMock = {
      get: vi.fn()
    }
    getAllUsersUseCase = new GetAllUsers(userRepositoryMock)
  })

  it('deve retornar lista de UserResponseDTO', async () => {
    const mockUsers = [
      {
        id: 'USER-1',
        name: 'João Silva',
        email: 'joao@example.com',
        privilege: 'student',
        cefr: 'B1'
      },
      {
        id: 'USER-2',
        name: 'Maria Souza',
        email: 'maria@example.com',
        privilege: 'admin',
        cefr: 'C1'
      }
    ]

    userRepositoryMock.get.mockResolvedValue(mockUsers)

    const result = await getAllUsersUseCase.execute()

    expect(userRepositoryMock.get).toHaveBeenCalled()
    expect(result).toHaveLength(mockUsers.length)
    expect(result[0]).toBeInstanceOf(UserResponseDTO)
    expect(result[0]).toEqual(
      new UserResponseDTO(
        mockUsers[0].id,
        mockUsers[0].name,
        mockUsers[0].email,
        mockUsers[0].privilege,
        mockUsers[0].cefr
      )
    )
  })

  it('deve retornar lista vazia se não houver usuários', async () => {
    userRepositoryMock.get.mockResolvedValue([])

    const result = await getAllUsersUseCase.execute()

    expect(userRepositoryMock.get).toHaveBeenCalled()
    expect(result).toEqual([])
  })
})
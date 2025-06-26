import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateUser } from './CreateUser'
import { User } from '../../domain/entities/User'
import { UserResponseDTO } from '../dto/UserResponseDTO'

describe('CreateUser Use Case', () => {
  let userRepositoryMock: any
  let bcryptConfigMock: any
  let uuidConfigMock: any
  let createUserUseCase: CreateUser

  beforeEach(() => {
    userRepositoryMock = {
      findUserByEmail: vi.fn(),
      create: vi.fn()
    }
    bcryptConfigMock = {
      hash: vi.fn()
    }
    uuidConfigMock = {
      generateStudentId: vi.fn(),
      generateAdminId: vi.fn()
    }
    createUserUseCase = new CreateUser(userRepositoryMock, bcryptConfigMock, uuidConfigMock)
  })

  it('deve criar usuário estudante com sucesso', async () => {
    const dto = {
      name: 'João Silva',
      email: 'joao@example.com',
      privilege: 'student',
      cefr: 'B1',
      password: 'senha123'
    }

    userRepositoryMock.findUserByEmail.mockResolvedValue(null)
    bcryptConfigMock.hash.mockResolvedValue('hashedPassword123')
    uuidConfigMock.generateStudentId.mockResolvedValue('STUDENT-123456')

    const savedUser = new User({
      id: 'STUDENT-123456',
      name: dto.name,
      email: dto.email,
      privilege: dto.privilege,
      cefr: dto.cefr,
      password: 'hashedPassword123'
    })

    userRepositoryMock.create.mockResolvedValue(savedUser)

    const result = await createUserUseCase.execute(dto)

    expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith(dto.email)
    expect(bcryptConfigMock.hash).toHaveBeenCalledWith(dto.password, 10)
    expect(uuidConfigMock.generateStudentId).toHaveBeenCalled()
    expect(userRepositoryMock.create).toHaveBeenCalled()
    expect(result).toBeInstanceOf(UserResponseDTO)
    expect(result).toEqual(
      new UserResponseDTO(
        savedUser.id,
        savedUser.name,
        savedUser.email,
        savedUser.privilege,
        savedUser.cefr
      )
    )
  })

  it('deve criar usuário admin com sucesso', async () => {
    const dto = {
      name: 'Admin User',
      email: 'admin@example.com',
      privilege: 'admin',
      cefr: 'C1',
      password: 'adminpass'
    }

    userRepositoryMock.findUserByEmail.mockResolvedValue(null)
    bcryptConfigMock.hash.mockResolvedValue('hashedAdminPass')
    uuidConfigMock.generateAdminId.mockResolvedValue('ADMIN-654321')

    const savedUser = new User({
      id: 'ADMIN-654321',
      name: dto.name,
      email: dto.email,
      privilege: dto.privilege,
      cefr: dto.cefr,
      password: 'hashedAdminPass'
    })

    userRepositoryMock.create.mockResolvedValue(savedUser)

    const result = await createUserUseCase.execute(dto)

    expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith(dto.email)
    expect(bcryptConfigMock.hash).toHaveBeenCalledWith(dto.password, 10)
    expect(uuidConfigMock.generateAdminId).toHaveBeenCalled()
    expect(userRepositoryMock.create).toHaveBeenCalled()
    expect(result).toBeInstanceOf(UserResponseDTO)
    expect(result).toEqual(
      new UserResponseDTO(
        savedUser.id,
        savedUser.name,
        savedUser.email,
        savedUser.privilege,
        savedUser.cefr
      )
    )
  })

  it('deve lançar erro se email já existir', async () => {
    const dto = {
      name: 'João Silva',
      email: 'joao@example.com',
      privilege: 'student',
      cefr: 'B1',
      password: 'senha123'
    }

    userRepositoryMock.findUserByEmail.mockResolvedValue(new User({
      id: 'STUDENT-000001',
      name: 'Outro Usuário',
      email: dto.email,
      privilege: 'student',
      cefr: 'B1',
      password: 'hashed'
    }))

    await expect(createUserUseCase.execute(dto)).rejects.toThrow('[Email de usuário já presente no Banco de dados]')

    expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith(dto.email)
    expect(bcryptConfigMock.hash).not.toHaveBeenCalled()
    expect(userRepositoryMock.create).not.toHaveBeenCalled()
  })
})
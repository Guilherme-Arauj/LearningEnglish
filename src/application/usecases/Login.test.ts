import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Login } from './Login'

describe('Login Use Case', () => {
  let userRepositoryMock: any
  let bcryptConfigMock: any
  let jwtConfigMock: any
  let loginUseCase: Login

  beforeEach(() => {
    userRepositoryMock = {
      findUserByEmail: vi.fn()
    }
    bcryptConfigMock = {
      compare: vi.fn()
    }
    jwtConfigMock = {
      sign: vi.fn()
    }
    loginUseCase = new Login(userRepositoryMock, bcryptConfigMock, jwtConfigMock)
  })

  it('deve realizar login com sucesso e retornar dados com token', async () => {
    const dto = {
      email: 'user@example.com',
      password: 'senha123'
    }

    const mockUser = {
      id: 'USER-123',
      name: 'Usuário Teste',
      email: dto.email,
      privilege: 'student',
      cefr: 'B2',
      timeSpentSeconds: 3600,
      password: 'hashedPassword'
    }

    userRepositoryMock.findUserByEmail.mockResolvedValue(mockUser)
    bcryptConfigMock.compare.mockResolvedValue(true)
    jwtConfigMock.sign.mockReturnValue('token123')

    const result = await loginUseCase.execute(dto)

    expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith(dto.email)
    expect(bcryptConfigMock.compare).toHaveBeenCalledWith(dto.password, mockUser.password)
    expect(jwtConfigMock.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      { expiresIn: '2h' }
    )
    expect(result).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      privilege: mockUser.privilege,
      cefr: mockUser.cefr,
      timeSpentSeconds: mockUser.timeSpentSeconds,
      token: 'token123'
    })
  })

  it('deve lançar erro se usuário não for encontrado', async () => {
    userRepositoryMock.findUserByEmail.mockResolvedValue(null)

    await expect(loginUseCase.execute({ email: 'notfound@example.com', password: 'senha' }))
      .rejects.toThrow('[Usuário não encontrado no banco de dados]')

    expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith('notfound@example.com')
  })

  it('deve lançar erro se senha estiver incorreta', async () => {
    const mockUser = {
      id: 'USER-123',
      name: 'Usuário Teste',
      email: 'user@example.com',
      privilege: 'student',
      cefr: 'B2',
      timeSpentSeconds: 3600,
      password: 'hashedPassword'
    }

    userRepositoryMock.findUserByEmail.mockResolvedValue(mockUser)
    bcryptConfigMock.compare.mockResolvedValue(false)

    await expect(loginUseCase.execute({ email: mockUser.email, password: 'wrongpass' }))
      .rejects.toThrow('[Senha incorreta]')

    expect(bcryptConfigMock.compare).toHaveBeenCalledWith('wrongpass', mockUser.password)
  })
})
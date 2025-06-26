import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RecuperarSenha } from './RecuperarSenha'

describe('RecuperarSenha Use Case', () => {
  let userRepositoryMock: any
  let mailerMock: any
  let jwtConfigMock: any
  let mailerTemplateMock: any
  let recuperarSenhaUseCase: RecuperarSenha

  beforeEach(() => {
    userRepositoryMock = {
      findUserByEmail: vi.fn()
    }
    mailerMock = {
      sendMail: vi.fn().mockResolvedValue(undefined)
    }
    jwtConfigMock = {
      sign: vi.fn()
    }
    mailerTemplateMock = {
      generate: vi.fn()
    }
    recuperarSenhaUseCase = new RecuperarSenha(
      userRepositoryMock,
      mailerMock,
      jwtConfigMock,
      mailerTemplateMock
    )
  })

  it('deve gerar token, criar url, gerar html e enviar email', async () => {
    const dto = { email: 'user@example.com' }
    const mockUser = {
      id: 'USER-123',
      email: dto.email
    }
    const mockToken = 'token123'
    const mockUrl = `http://localhost:4000/users/redefinirSenha??token=${mockToken}`
    const mockHtml = '<html>Recuperar senha</html>'

    userRepositoryMock.findUserByEmail.mockResolvedValue(mockUser)
    jwtConfigMock.sign.mockReturnValue(mockToken)
    mailerTemplateMock.generate.mockReturnValue(mockHtml)

    await recuperarSenhaUseCase.execute(dto)

    expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith(dto.email)
    expect(jwtConfigMock.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      { expiresIn: '15m' }
    )
    expect(mailerTemplateMock.generate).toHaveBeenCalledWith(mockUrl)
    expect(mailerMock.sendMail).toHaveBeenCalledWith(dto.email, 'Recuperação de senha', mockHtml)
  })

  it('deve lançar erro se usuário não for encontrado', async () => {
    userRepositoryMock.findUserByEmail.mockResolvedValue(null)

    await expect(recuperarSenhaUseCase.execute({ email: 'notfound@example.com' }))
      .rejects.toThrow('[Usuário não encontrado no banco de dados]')

    expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith('notfound@example.com')
    expect(jwtConfigMock.sign).not.toHaveBeenCalled()
    expect(mailerTemplateMock.generate).not.toHaveBeenCalled()
    expect(mailerMock.sendMail).not.toHaveBeenCalled()
  })

  it('deve capturar erro ao enviar email e logar no console', async () => {
    const dto = { email: 'user@example.com' }
    const mockUser = {
      id: 'USER-123',
      email: dto.email
    }
    const mockToken = 'token123'
    const mockUrl = `http://localhost:4000/users/redefinirSenha??token=${mockToken}`
    const mockHtml = '<html>Recuperar senha</html>'
    const mockError = new Error('Falha no envio')

    userRepositoryMock.findUserByEmail.mockResolvedValue(mockUser)
    jwtConfigMock.sign.mockReturnValue(mockToken)
    mailerTemplateMock.generate.mockReturnValue(mockHtml)
    mailerMock.sendMail.mockRejectedValue(mockError)

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await recuperarSenhaUseCase.execute(dto)

    expect(mailerMock.sendMail).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith('[Erro ao enviar e-mail de recuperação de senha]', mockError)

    consoleErrorSpy.mockRestore()
  })
})
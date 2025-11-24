import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock do dotenv e path para evitar efeitos colaterais reais
vi.mock('dotenv', () => ({
  config: vi.fn()
}))
vi.mock('path', () => ({
  resolve: vi.fn(() => '/fake/path/.env')
}))

describe('envConfig', () => {
  const OLD_ENV = { ...process.env }

  beforeEach(() => {
    vi.resetModules() // Limpa o cache do módulo entre os testes
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.clearAllMocks()
  })

  it('deve expor as variáveis de ambiente corretamente', async () => {
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db'
    process.env.PORT = '4000'
    process.env.SMTP_HOST = 'smtp.example.com'
    process.env.SMTP_PORT = '2525'
    process.env.SMTP_USER = 'user'
    process.env.SMTP_PASS = 'pass'
    process.env.SECRET_KEY = 'secret'
    process.env.SESSION_SECRET = 'session'

    // Reimporta o módulo para pegar as variáveis mockadas
    const env = await import('./envConfig.js')

    expect(env.DATABASE_URL).toBe('postgres://user:pass@localhost:5432/db')
    expect(env.PORT).toBe('4000')
    expect(env.SMTP_HOST).toBe('smtp.example.com')
    expect(env.SMTP_PORT).toBe('2525')
    expect(env.SMTP_USER).toBe('user')
    expect(env.SMTP_PASS).toBe('pass')
    expect(env.SECRET_KEY).toBe('secret')
    expect(env.SESSION_SECRET).toBe('session')
  })

  it('deve usar valores padrão quando variáveis não estão definidas', async () => {
    delete process.env.PORT
    delete process.env.SMTP_PORT

    const env = await import('./envConfig.js')

    expect(env.PORT).toBe(3000)
    expect(env.SMTP_PORT).toBe(587)
  })
})
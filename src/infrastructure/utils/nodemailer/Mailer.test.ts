import { describe, it, expect, vi, beforeEach } from 'vitest'
import nodemailer from 'nodemailer'
import Mailer from './Mailer'
import type { IMailer } from './IMailer'

vi.mock('../../env/envConfig', () => ({
  SMTP_HOST: 'smtp.test.com',
  SMTP_PORT: '587',
  SMTP_USER: 'test@example.com',
  SMTP_PASS: 'test-password'
}))

const mockSendMail = vi.fn()
const mockTransporter = {
  sendMail: mockSendMail
}

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockImplementation(() => mockTransporter)
  }
}))

describe('Mailer', () => {
  let mailer: IMailer
  const mockedNodemailer = vi.mocked(nodemailer)

  beforeEach(() => {
    vi.clearAllMocks()
    mailer = new Mailer()
  })

  describe('constructor', () => {
    it('deve criar transporter com configurações corretas', () => {
      new Mailer()

      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'test-password'
        }
      })
    })

    it('deve converter SMTP_PORT para número', () => {
      new Mailer()

      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          port: expect.any(Number)
        })
      )
    })
  })

  describe('sendMail', () => {
    it('deve enviar email com parâmetros corretos', async () => {
      const to = 'recipient@example.com'
      const subject = 'Test Subject'
      const html = '<h1>Test HTML</h1>'
      
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' })

      await mailer.sendMail(to, subject, html)

      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"Easy English" <test@example.com>',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<h1>Test HTML</h1>'
      })
      expect(mockSendMail).toHaveBeenCalledTimes(1)
    })

    it('deve enviar email com HTML complexo', async () => {
      const to = 'user@test.com'
      const subject = 'Welcome Email'
      const html = `
        <div>
          <h1>Welcome!</h1>
          <p>Thank you for joining us.</p>
          <a href="https://example.com">Click here</a>
        </div>
      `
      
      mockSendMail.mockResolvedValue({ messageId: 'welcome-message' })

      await mailer.sendMail(to, subject, html)

      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"Easy English" <test@example.com>',
        to,
        subject,
        html
      })
    })

    it('deve propagar erro quando sendMail falhar', async () => {
      const to = 'error@test.com'
      const subject = 'Error Test'
      const html = '<p>Error</p>'
      const error = new Error('SMTP connection failed')
      
      mockSendMail.mockRejectedValue(error)

      await expect(mailer.sendMail(to, subject, html)).rejects.toThrow('SMTP connection failed')
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"Easy English" <test@example.com>',
        to,
        subject,
        html
      })
    })

    it('deve lidar com erro de autenticação', async () => {
      const to = 'auth@test.com'
      const subject = 'Auth Test'
      const html = '<p>Auth error</p>'
      const authError = new Error('Invalid login: 535-5.7.8 Username and Password not accepted')
      
      mockSendMail.mockRejectedValue(authError)

      await expect(mailer.sendMail(to, subject, html)).rejects.toThrow('Invalid login')
    })
  })

  describe('edge cases', () => {
    it('deve lidar com strings vazias', async () => {
      const to = ''
      const subject = ''
      const html = ''
      
      mockSendMail.mockResolvedValue({ messageId: 'empty-message' })

      await mailer.sendMail(to, subject, html)

      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"Easy English" <test@example.com>',
        to: '',
        subject: '',
        html: ''
      })
    })

    it('deve lidar com caracteres especiais no subject', async () => {
      const to = 'special@test.com'
      const subject = 'Título com acentos: ção, ã, é, ü'
      const html = '<p>Special chars test</p>'
      
      mockSendMail.mockResolvedValue({ messageId: 'special-chars' })

      await mailer.sendMail(to, subject, html)

      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"Easy English" <test@example.com>',
        to,
        subject,
        html
      })
    })
  })

  describe('integration scenarios', () => {
    it('deve usar o remetente correto baseado no SMTP_USER', async () => {

      const to = 'integration@test.com'
      const subject = 'Integration Test'
      const html = '<p>Integration</p>'
      
      mockSendMail.mockResolvedValue({ messageId: 'integration' })

      await mailer.sendMail(to, subject, html)

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"Easy English" <test@example.com>'
        })
      )
    })

    it('deve manter a instância do transporter entre chamadas', async () => {
      const emails = [
        { to: 'user1@test.com', subject: 'Email 1', html: '<p>1</p>' },
        { to: 'user2@test.com', subject: 'Email 2', html: '<p>2</p>' }
      ]
      
      mockSendMail.mockResolvedValue({ messageId: 'batch' })

      for (const email of emails) {
        await mailer.sendMail(email.to, email.subject, email.html)
      }

      expect(mockSendMail).toHaveBeenCalledTimes(2)
      expect(mockedNodemailer.createTransport).toHaveBeenCalledTimes(1)
    })
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import { UuidConfig } from './UuidConfig'
import type { IUuidConfig } from './IUuidConfig'

vi.mock('uuid', () => ({
  v4: vi.fn().mockImplementation(() => 'default-uuid')
}))

describe('UuidConfig', () => {
  let uuidConfig: IUuidConfig

  beforeEach(() => {
    uuidConfig = new UuidConfig()
    vi.clearAllMocks()
  })

  describe('generateStudentId', () => {
    it('deve gerar ID de estudante com prefixo correto', async () => {
      const mockUuid = 'f95a92-1234-5678-9012-345678901234'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const result = await uuidConfig.generateStudentId()

      expect(uuidv4).toHaveBeenCalledTimes(1)
      expect(result).toBe('STUDENT-f95a92')
      expect(result).toMatch(/^STUDENT-.{6}$/)
    })

    it('deve usar apenas os primeiros 6 caracteres do UUID', async () => {
      const mockUuid = '123456-7890-abcd-efgh-ijklmnopqrst'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const result = await uuidConfig.generateStudentId()

      expect(result).toBe('STUDENT-123456')
      expect(result.length).toBe(14)
    })
  })

  describe('generateAdminId', () => {
    it('deve gerar ID de admin com prefixo correto', async () => {
      const mockUuid = 'a1b2c3-4567-8901-2345-678901234567'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const result = await uuidConfig.generateAdminId()

      expect(uuidv4).toHaveBeenCalledTimes(1)
      expect(result).toBe('ADMIN-a1b2c3')
      expect(result).toMatch(/^ADMIN-.{6}$/)
    })
  })

  describe('generateQuestionId', () => {
    it('deve gerar ID de questão com prefixo correto', async () => {
      const mockUuid = 'f95a9217-4d6e-4b2a-8c3f-123456789abc'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const result = await uuidConfig.generateQuestionId()

      expect(uuidv4).toHaveBeenCalledTimes(1)
      expect(result).toBe('Q-f95a9217-4d6')
      expect(result).toMatch(/^Q-.{12}$/)
    })

    it('deve usar apenas os primeiros 12 caracteres do UUID', async () => {
      const mockUuid = '123456789abc-def0-1234-5678-rest-of-uuid'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const result = await uuidConfig.generateQuestionId()

      expect(result).toBe('Q-123456789abc')
      expect(result.length).toBe(14)
    })
  })

  describe('generateUserQuestionProgressId', () => {
    it('deve gerar ID de progresso com prefixo correto', async () => {
      const mockUuid = 'f95a9217-4d6e-4b2a-8c3f-123456789abc'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const result = await uuidConfig.generateUserQuestionProgressId()

      expect(uuidv4).toHaveBeenCalledTimes(1)
      expect(result).toBe('PROGRESS-f95a9217-4d6')
      expect(result).toMatch(/^PROGRESS-.{12}$/)
    })

    it('deve usar apenas os primeiros 12 caracteres do UUID', async () => {
      const mockUuid = '987654321098-7654-3210-9876-rest-of-uuid'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const result = await uuidConfig.generateUserQuestionProgressId()

      expect(result).toBe('PROGRESS-987654321098')
      expect(result.length).toBe(21)
    })
  })

  describe('IDs únicos', () => {
    it('deve gerar IDs diferentes em chamadas consecutivas', async () => {
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4
        .mockReturnValueOnce('aaaaaa-1111-2222-3333-444444444444')
        .mockReturnValueOnce('bbbbbb-5555-6666-7777-888888888888')
        .mockReturnValueOnce('cccccccccccc-9999-0000-1111-222222222222')
        .mockReturnValueOnce('dddddddddddd-3333-4444-5555-666666666666')

      const studentId1 = await uuidConfig.generateStudentId()
      const studentId2 = await uuidConfig.generateStudentId()
      const questionId1 = await uuidConfig.generateQuestionId()
      const questionId2 = await uuidConfig.generateQuestionId()

      expect(studentId1).toBe('STUDENT-aaaaaa')
      expect(studentId2).toBe('STUDENT-bbbbbb')
      expect(questionId1).toBe('Q-cccccccccccc')
      expect(questionId2).toBe('Q-dddddddddddd')
      expect(studentId1).not.toBe(studentId2)
      expect(questionId1).not.toBe(questionId2)
    })
  })

  describe('edge cases', () => {
    it('deve lidar com UUID padrão v4', async () => {
      const mockUuid = '550e8400-e29b-41d4-a716-446655440000'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const studentId = await uuidConfig.generateStudentId()
      const adminId = await uuidConfig.generateAdminId()
      const questionId = await uuidConfig.generateQuestionId()
      const progressId = await uuidConfig.generateUserQuestionProgressId()

      expect(studentId).toBe('STUDENT-550e84')
      expect(adminId).toBe('ADMIN-550e84')
      expect(questionId).toBe('Q-550e8400-e29')
      expect(progressId).toBe('PROGRESS-550e8400-e29')
    })

    it('deve lidar com UUID com números e letras', async () => {
      const mockUuid = '123abc45-6def-7890-abcd-ef1234567890'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const results = await Promise.all([
        uuidConfig.generateStudentId(),
        uuidConfig.generateAdminId(),
        uuidConfig.generateQuestionId(),
        uuidConfig.generateUserQuestionProgressId()
      ])

      expect(results[0]).toBe('STUDENT-123abc')
      expect(results[1]).toBe('ADMIN-123abc')
      expect(results[2]).toBe('Q-123abc45-6de')
      expect(results[3]).toBe('PROGRESS-123abc45-6de')
    })
  })

  describe('format validation', () => {
    it('deve garantir que todos os IDs tenham formato correto', async () => {
      const mockUuid = 'a1b2c3d4e5f6-7890-1234-5678-901234567890'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const studentId = await uuidConfig.generateStudentId()
      const adminId = await uuidConfig.generateAdminId()
      const questionId = await uuidConfig.generateQuestionId()
      const progressId = await uuidConfig.generateUserQuestionProgressId()

      expect(studentId).toMatch(/^STUDENT-.{6}$/)
      expect(adminId).toMatch(/^ADMIN-.{6}$/)
      expect(questionId).toMatch(/^Q-.{12}$/)
      expect(progressId).toMatch(/^PROGRESS-.{12}$/)
    })

    it('deve verificar comprimentos corretos dos IDs', async () => {
      const mockUuid = 'f95a9217-4d6e-4b2a-8c3f-123456789abc'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const studentId = await uuidConfig.generateStudentId()
      const adminId = await uuidConfig.generateAdminId()
      const questionId = await uuidConfig.generateQuestionId()
      const progressId = await uuidConfig.generateUserQuestionProgressId()

      expect(studentId.length).toBe(14) 
      expect(adminId.length).toBe(12)   
      expect(questionId.length).toBe(14)
      expect(progressId.length).toBe(21) 
    })
  })

  describe('substring behavior', () => {
    it('deve extrair exatamente os primeiros N caracteres', async () => {
      const mockUuid = '0123456789ab-cdef-0123-4567-890123456789'
      const mockUuidv4 = vi.mocked(uuidv4) as any
      mockUuidv4.mockReturnValue(mockUuid)

      const studentId = await uuidConfig.generateStudentId()
      const adminId = await uuidConfig.generateAdminId()
      const questionId = await uuidConfig.generateQuestionId()
      const progressId = await uuidConfig.generateUserQuestionProgressId()

      expect(studentId).toBe('STUDENT-012345')
      expect(adminId).toBe('ADMIN-012345')          
      expect(questionId).toBe('Q-0123456789ab')     
      expect(progressId).toBe('PROGRESS-0123456789ab')
    })
  })
})
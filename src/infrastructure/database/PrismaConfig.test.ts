import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { PrismaConfig } from './PrismaConfig'
import { PrismaClient } from '@prisma/client'

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      $connect: vi.fn(),
      $disconnect: vi.fn(),
      // Adicione outros métodos mockados se necessário
    }))
  }
})

describe('PrismaConfig', () => {
  let prismaConfig: PrismaConfig

  beforeEach(() => {
    prismaConfig = new PrismaConfig()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('deve instanciar PrismaClient no atributo prisma', () => {
    expect(prismaConfig.prisma).toBeDefined()
    expect(PrismaClient).toHaveBeenCalledTimes(1)
  })

  it('deve expor o atributo prisma', () => {
    expect(prismaConfig).toHaveProperty('prisma')
  })

  it('deve permitir acessar métodos do PrismaClient', () => {
    expect(typeof prismaConfig.prisma.$connect).toBe('function')
    expect(typeof prismaConfig.prisma.$disconnect).toBe('function')
  })
})
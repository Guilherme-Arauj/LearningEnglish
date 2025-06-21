    import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
    import { validateDTODeleteUser } from './validateDTODeleteUser'

    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    describe('validateDTODeleteUser', () => {
    let mockRes: any

    beforeEach(() => {
        mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
        }
    })

    afterEach(() => {
        mockConsoleError.mockClear()
        vi.clearAllMocks()
    })

    describe('validação com sucesso', () => {
        it('deve validar ID de estudante correto', async () => {
        const validData = { id: 'STUDENT-abc123' }
        const result = await validateDTODeleteUser(validData, mockRes)
        expect(result).toEqual(validData)
        })

        it('deve validar ID de admin correto', async () => {
        const validData = { id: 'ADMIN-xyz789' }
        const result = await validateDTODeleteUser(validData, mockRes)
        expect(result).toEqual(validData)
        })

        it('deve aceitar ID com mais de 8 caracteres', async () => {
        const validData = { id: 'STUDENT-123456789' }
        const result = await validateDTODeleteUser(validData, mockRes)
        expect(result).toEqual(validData)
        })

        it('deve aceitar ID de admin longo', async () => {
        const validData = { id: 'ADMIN-abcdef123456' }
        const result = await validateDTODeleteUser(validData, mockRes)
        expect(result).toEqual(validData)
        })
    })

    describe('validação com erro', () => {
        it('deve falhar com ID muito curto', async () => {
        const invalidData = { id: 'STUDENT' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Erro de validação:',
            expect.stringContaining('[ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)]')
        )
        })

        it('deve falhar com prefixo inválido', async () => {
        const invalidData = { id: 'INVALID-123456' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Erro de validação:',
            expect.stringContaining("[ID deve começar com 'STUDENT-' ou 'ADMIN-']")
        )
        })

        it('deve falhar com ID vazio', async () => {
        const invalidData = { id: '' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        })

        it('deve falhar sem campo id', async () => {
        const invalidData = {}
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        })

        it('deve falhar com múltiplos erros', async () => {
        const invalidData = { id: 'X-12' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        
        expect(mockConsoleError).toHaveBeenCalled()
        })
    })

    describe('edge cases', () => {
        it('deve falhar com null', async () => {
        await expect(validateDTODeleteUser(null as any, mockRes))
            .rejects.toThrow('Dados inválidos')
        })

        it('deve falhar com objeto vazio', async () => {
        await expect(validateDTODeleteUser({}, mockRes))
            .rejects.toThrow('Dados inválidos')
        })

        it('deve falhar com prefixo parcial STUDENT', async () => {
        const invalidData = { id: 'STUDEN-123456' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        })

        it('deve falhar com prefixo parcial ADMIN', async () => {
        const invalidData = { id: 'ADMI-123456' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        })
    })

    describe('formato do ID', () => {
        it('deve aceitar STUDENT com hífens', async () => {
        const validData = { id: 'STUDENT-abc-123' }
        const result = await validateDTODeleteUser(validData, mockRes)
        expect(result).toEqual(validData)
        })

        it('deve aceitar ADMIN com números e letras', async () => {
        const validData = { id: 'ADMIN-a1b2c3' }
        const result = await validateDTODeleteUser(validData, mockRes)
        expect(result).toEqual(validData)
        })

        it('deve falhar com case sensitive', async () => {
        const invalidData = { id: 'student-123456' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        })

        it('deve falhar com espaços', async () => {
        const invalidData = { id: 'STUDENT - 123456' }
        
        await expect(validateDTODeleteUser(invalidData, mockRes))
            .rejects.toThrow('Dados inválidos')
        })
    })
    })
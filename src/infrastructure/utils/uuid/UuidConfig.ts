import { v4 as uuidv4 } from 'uuid';
import { IUuidConfig } from './IUuidConfig';

export class UuidConfig implements IUuidConfig{
    
    public async generateStudentId(): Promise<string> {
        const uuid = uuidv4();
        const uuidLimitado = uuid.substring(0, 6);
        const uuidComPrefixo = "STUDENT-" + uuidLimitado;
        return uuidComPrefixo;
    }

    public async generateAdminId(): Promise<string> {
        const uuid = uuidv4();
        const uuidLimitado = uuid.substring(0, 6);
        const uuidComPrefixo = "ADMIN-" + uuidLimitado;
        return uuidComPrefixo;
    }

    public async generateQuestionId(): Promise<string> {
        const uuid = uuidv4();
        const uuidLimitado = uuid.substring(0, 12);
        const uuidComPrefixo = "Q-" + uuidLimitado;
        return uuidComPrefixo;
    }

    public async generateUserQuestionProgressId(): Promise<string> {
        const uuid = uuidv4();
        const uuidLimitado = uuid.substring(0, 12);
        const uuidComPrefixo = "PROGRESS-" + uuidLimitado;
        return uuidComPrefixo;
    }

    public async generateVideoId(): Promise<string> {
        const uuid = uuidv4();
        const uuidLimitado = uuid.substring(0, 12);
        const uuidComPrefixo = "VIDEO-" + uuidLimitado;
        return uuidComPrefixo;
    }
}



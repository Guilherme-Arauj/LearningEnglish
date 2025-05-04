import * as bcrypt from 'bcrypt';
import { IBcryptConfig } from './IBcryptConfig';


export class BcryptConfig implements IBcryptConfig{

    public async hash(password: string, salt:number): Promise<string> {
        return bcrypt.hash(password, salt);
    }
    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}


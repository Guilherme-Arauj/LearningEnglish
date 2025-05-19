import { TokenMiddleware } from '../../application/middleware/TokenMiddleware';
import { IUserRepository } from '../../application/usecases/repositories/IUserRepository';
import { UserRepository } from '../../application/usecases/repositories/UserRepository';
import { IJwtConfig } from '../../infrastructure/utils/jwt/IJwtConfig';
import { IPrismaConfig } from '../database/IPrismaConfig';
import { PrismaConfig } from '../database/PrismaConfig';
import { JwtConfig } from '../utils/jwt/JwtConfig';

export function TokenMiddlewareFactory(): TokenMiddleware{
    const prismaConfig: IPrismaConfig = new PrismaConfig();
    const secretKey = process.env.SECRET_KEY as string;
    
    const userRepository: IUserRepository = new UserRepository(prismaConfig);
    const jwtConfig: IJwtConfig = new JwtConfig(secretKey);

    return new TokenMiddleware(userRepository, jwtConfig);
}
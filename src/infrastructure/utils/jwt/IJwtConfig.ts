import jwt from 'jsonwebtoken';

export interface IJwtConfig {
    sign(payload: object, options?: jwt.SignOptions): string;
    verify(token: string): object | null | string;
}

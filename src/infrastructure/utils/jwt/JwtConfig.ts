import jwt from "jsonwebtoken";
import { IJwtConfig } from "./IJwtConfig";

export class JwtConfig implements IJwtConfig {
    private secretKey: string;  

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    public sign(payload: object, options?: jwt.SignOptions): string {
        return jwt.sign(payload, this.secretKey, options);
    }
    

    public verify(token: string): object | null | string {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }
}
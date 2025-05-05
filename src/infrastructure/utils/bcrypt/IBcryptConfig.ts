export interface IBcryptConfig {
    hash(password: string, salt: number): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}
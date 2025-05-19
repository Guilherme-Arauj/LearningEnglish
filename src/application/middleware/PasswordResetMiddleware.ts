import { Request, Response, NextFunction } from 'express';
import { IJwtConfig } from '../../infrastructure/utils/jwt/IJwtConfig';
import { IUserRepository } from '../usecases/repositories/IUserRepository';

export class ResetPasswordTokenMiddleware {
  constructor(
    private userRepository: IUserRepository,
    private jwtConfig: IJwtConfig

  ) {}

  public verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtConfig.verify(token);

    if (!decoded || typeof decoded === 'string') {
      res.status(401).json({ message: 'Token inválido ou expirado' });
      return;
    }

    const usuario = await this.userRepository.getUser((decoded as any).id);

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    req.user = usuario;
    next();
  };
}

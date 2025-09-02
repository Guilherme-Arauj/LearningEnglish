import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { IJwtConfig } from '../../infrastructure/utils/jwt/IJwtConfig';
import { IUserRepository } from '../services/repositories/IUserRepository';

const prisma = new PrismaClient();

export class TokenMiddleware {
  constructor(
    private userRepository: IUserRepository,
    private jwtConfig: IJwtConfig
  ) {}

  public verifyToken = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    let token = req.session.user?.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    const decoded = this.jwtConfig.verify(token);
    if (!decoded || typeof decoded === 'string') {
      res.status(401).json({ message: 'Token inválido ou expirado' });
      return
    }

    const usuario = await this.userRepository.findUserById((decoded as any).id)

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return
    }

    const novoToken = this.jwtConfig.sign(
      { id: usuario.id, email: usuario.email },  
      { expiresIn: '2h', }
    );

    res.setHeader('Authorization', `Bearer ${novoToken}`);

    
    
    req.user = usuario;
    next();
  }
}

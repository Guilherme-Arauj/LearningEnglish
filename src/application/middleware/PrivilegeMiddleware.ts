import { Request, Response, NextFunction } from "express";

export class PrivilegeMiddleware {
  public verifyPrivilege = (requiredPrivilege: string) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const user = req.session.user;

      if (!user) {
        res.status(401).json({ message: "Usuário não autenticado" });
        return;
      }

      if (user.privilege !== requiredPrivilege) {
        res.status(403).json({
          message: `Acesso negado. Privilégio '${requiredPrivilege}' necessário`,
        });
        return;
      }

      next();
    };
  };
}

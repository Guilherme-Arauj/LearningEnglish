import { Request, Response } from "express";
import { validateDTOUserUpdate } from "../../utils/zod/validateDTOUserUpdate";
import { validateDTOUser } from "../../utils/zod/validateDTOUser";
import { UserDTO } from "../../../application/dto/UserDTO";
import { UserLoginDTO } from "../../../application/dto/UserLoginDTO";
import { validateDTOLogin } from "../../utils/zod/validateDTOLogin";
import { validateDTOUserEmail } from "../../utils/zod/validateDTOUserEmail";
import { UserEmailDTO } from "../../../application/dto/UserEmailDTO";
import { validateDTOUserNewPassword } from "../../utils/zod/validateDTOUserNewPassword";
import { UserNewPasswordDTO } from "../../../application/dto/UserNewPasswordDTO";
import { UserUpdateDTO } from "../../../application/dto/UserUpdateDTO";
import { validateDTODeleteUser } from "../../utils/zod/validateDTODeleteUser";
import { DeleteUserDTO } from "../../../application/dto/DeleteUserDTO";
import { validateDTOAddStudyTime } from "../../utils/zod/validateDTOAddStudyTime";
import { AddStudyTimeDTO } from "../../../application/dto/AddStudyTimeDTO";
import { UserService } from "../../../application/services/UserService";
import { validateDTOTimeline } from "../../utils/zod/validateDTOTimeline";
import { TimelineDTO } from "../../../application/dto/TimelineDTO";
import { validateDTOLoggedUser } from "../../utils/zod/validateDTOLoggedUser";
import { LoggedUserDTO } from "../../../application/dto/LoggedUserDTO";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, cefr, timeline } = req.body;
      const privilege = "student";

      const reqSchema = { name, email, password, privilege, cefr, timeline };

      const validatedData = await validateDTOUser(reqSchema, res);
      if (!validatedData) return;

      const dto = new UserDTO(
        validatedData.name,
        validatedData.email,
        validatedData.password,
        validatedData.privilege,
        validatedData.cefr
      );

      const userResponse = await this.userService.createUser(dto);

      res.status(201).json({
        message: "Cadastro realizado com sucesso!",
        user: userResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao criar usuário - ${error}` });
    }
  }

  public async adminCreate(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, cefr, timeline, privilege } = req.body;

      const reqSchema = { name, email, password, privilege, cefr, timeline };

      const validatedData = await validateDTOUser(reqSchema, res);
      if (!validatedData) return;

      const dto = new UserDTO(
        validatedData.name,
        validatedData.email,
        validatedData.password,
        validatedData.privilege,
        validatedData.cefr
      );

      const userResponse = await this.userService.createUser(dto);

      res.status(201).json({
        message: "Cadastro realizado com sucesso!",
        user: userResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao criar usuário - ${error}` });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const reqSchema = { email, password };

      const validatedData = await validateDTOLogin(reqSchema, res);
      if (!validatedData) return;

      const dto = new UserLoginDTO(validatedData.email, validatedData.password);

      const userResponse = await this.userService.login(dto);

      req.session.user = {
        id: userResponse.id,
        name: userResponse.name,
        email: userResponse.email,
        privilege: userResponse.privilege,
        cefr: userResponse.cefr,
        timeline: userResponse.timeline,
        firstAccess: userResponse.firstAccess,
        token: userResponse.token || "",
      };

      res.status(201).json({
        message: "Login realizado com sucesso!",
        user: userResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro realizar Login - ${error}` });
    }
  }

  public async loggedUser(req: Request, res: Response): Promise<void> {
    const user = req.session.user;
    if (!user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const reqSchema = { userId: user.id };

    const validatedData = await validateDTOLoggedUser(reqSchema, res);
    if (!validatedData) return;

    const dto = new LoggedUserDTO(validatedData.userId);

    const userResponse = await this.userService.getLoggedUser(dto);

    res.status(200).json(userResponse);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        res
          .status(500)
          .json({ success: false, message: "Erro ao fazer logout" });
        return;
      }

      res.setHeader("Authorization", "");
      res
        .status(200)
        .json({ success: true, message: "Logout realizado com sucesso" });
    });
  }

  public async recuperarSenha(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const reqSchema = { email };

      const validatedData = await validateDTOUserEmail(reqSchema, res);
      if (!validatedData) return;

      const dto = new UserEmailDTO(validatedData.email);

      const userResponse = await this.userService.passwordRecuperation(dto);

      res.status(201).json({
        message: "Link de recuperação de senha enviado!",
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao Recuperar Senha - ${error}` });
    }
  }

  public async redefinirSenha(req: Request, res: Response): Promise<void> {
    try {
      const { id, password } = req.body;

      const reqSchema = { id, password };

      const validatedData = await validateDTOUserNewPassword(reqSchema);
      if (!validatedData) return;

      const dto = new UserNewPasswordDTO(
        validatedData.id,
        validatedData.password
      );

      const userResponse = await this.userService.passwordRedefinition(dto);

      res.status(201).json({
        message: "Senha alterada com sucesso! ",
        userResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao Redefinir Senha - ${error}` });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.privilege !== "admin") {
        res.status(403).json({
          message:
            "Acesso restrito: apenas administradores podem acessar esta rota.",
        });
      }

      const { id, ...userData } = req.body;

      const reqSchema = { id, ...userData };

      const validatedData = await validateDTOUserUpdate(reqSchema, res);
      if (!validatedData) return;

      const dto = new UserUpdateDTO(validatedData.id, validatedData);

      const userResponse = await this.userService.updateUser(dto);

      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        userResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao Atualizar Usuário - ${error}` });
    }
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.privilege !== "admin") {
        res.status(403).json({
          message:
            "Acesso restrito: apenas administradores podem acessar esta rota.",
        });
      }

      const users = await this.userService.getAllUsers();

      res.status(200).json({
        message: "Usuários encontrados com sucesso!",
        users,
      });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(400).json({ message: `Erro ao buscar usuários - ${error}` });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.privilege !== "admin") {
        res.status(403).json({
          message:
            "Acesso restrito: apenas administradores podem acessar esta rota.",
        });
      }

      const { id } = req.body;
      const reqSchema = { id };

      const validatedData = await validateDTODeleteUser(reqSchema, res);
      if (!validatedData) return;

      const dto = new DeleteUserDTO(validatedData);

      const deletedUser = await this.userService.deleteUser(dto);

      if (!deletedUser) {
        res.status(404).json({ message: "Usuário não encontrado." });
      }

      res
        .status(200)
        .json({ message: "Usuário excluído com sucesso.", user: deletedUser });
    } catch (error) {
      console.error("Erro ao excluir usuários:", error);
      res.status(400).json({ message: `Erro ao excluir usuários - ${error}` });
    }
  }

  public async addStudyTime(req: Request, res: Response): Promise<void> {
    try {
      const { timeToAdd } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error("User ID is missing from request.");
      }

      const reqSchema = { userId, timeToAdd };

      const validatedData = await validateDTOAddStudyTime(reqSchema, res);
      if (!validatedData) return;

      const dto = new AddStudyTimeDTO(userId, timeToAdd);

      const user = await this.userService.addStudyTimeToUser(dto);

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
      }

      res
        .status(200)
        .json({ message: "Tempo de estudo salvo com sucesso.", user: user });
    } catch (error) {
      console.error("Erro ao adicionar tempo de estudo:", error);
      res
        .status(400)
        .json({ message: `Erro ao adicionar tempo de estudo - ${error}` });
    }
  }

  public async updateTimeline(req: Request, res: Response): Promise<void> {
    const { timeline } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User ID is missing from request.");
    }

    const reqSchema = { timeline, userId };

    const validatedData = await validateDTOTimeline(reqSchema, res);
    if (!validatedData) return;

    const dto = new TimelineDTO(validatedData.userId, validatedData.timeline);

    const user = await this.userService.updateTimeline(dto);

    res
      .status(200)
      .json({ message: "Cronograma atualizado com sucesso!", user: user });
  }
}

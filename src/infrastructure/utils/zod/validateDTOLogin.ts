import { z } from "zod";

export async function validateDTOLogin(reqSchema: Object, res: any) {
  const userSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  });

  try {
    const user = userSchema.parse(reqSchema);
    return user;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      console.error("Erro de validação:", JSON.stringify(errorMessages, null, 2));
    } else {
      console.error("Erro desconhecido:", error);
    }
    throw new Error("Dados inválidos");
  }
}
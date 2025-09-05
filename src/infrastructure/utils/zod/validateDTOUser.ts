import { z } from "zod";

export async function validateDTOUser(reqSchema: Object, res: any) {
  const userSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    name: z.string().min(1, "Nome é obrigatório"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    privilege: z.enum(["student", "admin"], {
      errorMap: () => ({ message: "Privilégio inválido! Use 'student' ou 'admin'." })
    }),
    cefr: z.string(),
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
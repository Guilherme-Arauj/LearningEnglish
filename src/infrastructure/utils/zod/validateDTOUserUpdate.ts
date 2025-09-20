import { z } from "zod";

export async function validateDTOUserUpdate(reqSchema: Object, res: any) {
  const userUpdateSchema = z.object({
    id: z.string()
      .min(8, "ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)")
      .refine(
        (id) => id.startsWith("STUDENT-") || id.startsWith("ADMIN-"),
        "ID deve começar com 'STUDENT-' ou 'ADMIN-'"
      ),
    email: z.string().email("Formato de email inválido").optional(),
    name: z.string().min(1, "Nome é obrigatório").optional(),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
    privilege: z.enum(["student", "admin"], {
      errorMap: () => ({ message: "Privilégio inválido! Use 'student' ou 'admin'." })
    }).optional(),
    cefr: z.string().optional()
  });

  try {
    const user = userUpdateSchema.parse(reqSchema);
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
import { z } from "zod";

export async function validateDTOLoggedUser(reqSchema: Object, res: any) {
  const loggedUserSchema = z.object({
    userId: z.string()
      .min(8, "ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)")
      .refine(
        (id) => id.startsWith("STUDENT-") || id.startsWith("ADMIN-"),
        "ID deve começar com 'STUDENT-' ou 'ADMIN-'"
      )
  });

  try {
    const user = loggedUserSchema.parse(reqSchema);
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
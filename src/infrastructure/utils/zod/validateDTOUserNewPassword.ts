import { z } from "zod";

export async function validateDTOUserNewPassword(reqSchema: object) {
  const userSchema = z.object({
    id: z.string()
      .min(8, "ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)")
      .refine(
        (id) => id.startsWith("STUDENT-") || id.startsWith("ADMIN-"),
        "ID deve começar com 'STUDENT-' ou 'ADMIN-'"
      ),
    password: z
      .string({ required_error: "Formato de password inválido" })
      .min(6, "Senha deve ter no mínimo 6 caracteres"),
  });
  try {
    const user = userSchema.parse(reqSchema);
    return user;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      console.error(
        "Erro de validação:",
        JSON.stringify(errorMessages, null, 2)
      );
    } else {
      console.error("Erro desconhecido:", error);
    }
    throw new Error("Dados inválidos");
  }
}

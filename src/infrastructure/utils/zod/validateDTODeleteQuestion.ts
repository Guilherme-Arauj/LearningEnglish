import { z } from "zod";

export async function validateDTODeleteQuestion(reqSchema: object, res: any) {
  const questionSchema = z.object({
    id: z.string()
      .min(14, "ID deve ter pelo menos 14 caracteres (Q- + 12 chars)")
      .refine(
        (id) => id.startsWith("Q-"),
        "ID deve começar com 'Q-'"
      ),
  });
  try {
    const question = questionSchema.parse(reqSchema);
    return question;
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
      res.status(400).json({ errors: errorMessages });
      return null;
    } else {
      console.error("Erro desconhecido:", error);
      res.status(400).json({ message: "Erro desconhecido na validação." });
      return null;
    }
  }
}
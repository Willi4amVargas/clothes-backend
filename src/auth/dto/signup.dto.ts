import z from "zod";

export const SignupDto = z.object({
    email: z.email(),
    profile: z.number().min(1),
    code: z.string().min(1, "Code is required"),
    password: z.string().min(1, "Password is required"),
    description: z.string().min(5)
});
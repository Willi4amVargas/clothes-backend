import z from "zod";

export const SignupDto = z.object({
    email: z.email(),
    profile_id: z.uuid(),
    code: z.string().min(1, "Code is required"),
    password: z.string().min(1, "Password is required"),
    description: z.string().min(5)
});
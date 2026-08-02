import { z } from "zod";

export const UUIDDto = z.object({
    id: z.uuidv4()
})
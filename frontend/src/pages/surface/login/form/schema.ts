import { z } from "zod";

const required = "field required";

const $loginSchema = z.object({
  email: z.string().min(1, required).email(),
  password: z.string().nonempty(required),
});

type LoginSchema = z.infer<typeof $loginSchema>;

export { $loginSchema, type LoginSchema };

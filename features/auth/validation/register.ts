import z from 'zod';

export const registerSchema = z
  .object({
    username: z.string().min(3, 'Username minimal 3 karakter'),
    email: z.email('Format email tidak valid'),
    password: z.string().min(8, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 6 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

import z from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

const parsed = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});

export const env = {
  API_URL: parsed.EXPO_PUBLIC_API_URL,
};

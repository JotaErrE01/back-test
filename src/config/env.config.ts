import 'dotenv/config';
import z from 'zod';

// Definir un esquema para validar el puerto
const portSchema = z.string()
  .default('3000')
  .transform((val) => parseInt(val, 10)) // Convertir la cadena a número entero
  .refine((val) => val >= 1 && val <= 65535, { message: 'El puerto debe ser un número entre 1 y 65535' });

export const enviromentShcema = z.object({
  PORT: portSchema,
  DB_HOST: z.string().optional().default('localhost'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().min(6),
  DB_NAME: z.string(),
  DB_PORT: portSchema,
  OTP_MINUTES_EXPIRATION_TIME: z.string().default('6').transform((val) => parseInt(val, 10)),
});

export type EnvVars = z.infer<typeof enviromentShcema>;

const { data, error } = enviromentShcema.safeParse(process.env);

if (error) throw new Error(`Error en Enviroment Variables ${error.message}`);

export const envs: EnvVars = data;

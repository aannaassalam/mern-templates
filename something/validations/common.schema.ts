import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email({ message: 'Invalid email address' });

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/\d/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character',
  });

// phone no valiation
export const phoneSchema = z
  .string()
  .regex(/^\+\d{1,3} ?\d{10}$/, {
    message:
      'Phone number must be in the format: "+XX XXXXXXXXXX" or "+XXXXXXXXXXXX".',
  })
  .min(1, { message: 'Phone number is required.' });

// Infer the types from Zod schemas
export type EmailType = z.infer<typeof emailSchema>;
export type PasswordType = z.infer<typeof passwordSchema>;
export type PhoneNoType = z.infer<typeof phoneSchema>;

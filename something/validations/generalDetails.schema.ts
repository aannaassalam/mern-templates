import { z } from 'zod';

import { emailSchema, phoneSchema } from './common.schema';

// Define a Zod schema for the form
export const generalDetailsSchema = z.object({
  instituteName: z.string().min(1, 'Institute name is required'),
  email: emailSchema,
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  pincode: z
    .string()
    .min(6, 'Pincode must be at least 6 characters')
    .max(6, 'Pincode must be 6 characters'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  phone: phoneSchema,
  logo: z.unknown().optional(),
});

// Define the type for the form values
export type GeneralDetailsType = z.infer<typeof generalDetailsSchema>;

// Default values for the form
export const defaultValues: GeneralDetailsType = {
  instituteName: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  pincode: '',
  district: '',
  state: '',
  country: '',
  phone: '',
  logo: undefined,
};

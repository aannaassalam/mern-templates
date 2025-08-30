import { RegisterSchemaType } from '@/validations/auth.schema';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      photo?: string;
    };
  };
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  photo?: string;
  phone?: string;
  department?: string;
  specialization?: string;
  experience?: string;
  status?: 'active' | 'inactive';
}

export interface RegisterFormField {
  name: keyof RegisterSchemaType;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
}

export interface InputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface SelectFieldProps {
  name: string;
  options: { value: string; label: string }[];
  placeholder: string;
}

export interface FormFieldWrapperProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  fieldType: 'input' | 'textarea' | 'select';
  type?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}

export interface PaginatedResponse<T> {
  data: T;
  meta: {
    results: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

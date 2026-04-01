export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  role: Role;
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  emailVerified: boolean;
  role: Role;
  createdAt: string;
}

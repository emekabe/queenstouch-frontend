export enum Role {
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN'
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  emailVerified: boolean;
  roles: Role[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  emailVerified: boolean;
  roles: Role[];
  createdAt: string;
}

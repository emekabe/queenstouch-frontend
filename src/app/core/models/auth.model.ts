import { UserResponse } from './user.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

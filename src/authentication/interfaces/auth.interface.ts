export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  tokens: {
    accessToken: string;
  };
}
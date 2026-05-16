export interface User {
  id: number;
  code: string;
  description: string;
  status: boolean;
  email: string;
  profile: number;
  password: string;
  recovery_token?: string;
  recovery_token_expires_at?: Date;
}

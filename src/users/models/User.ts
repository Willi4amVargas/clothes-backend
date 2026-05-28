export interface User {
  code: string;
  description: string;
  email: string;
  id: number;
  password: string;
  profile: number;
  recovery_token?: string;
  recovery_token_expires_at?: Date;
  status: boolean;
}

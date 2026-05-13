export interface LoginRequest {
  email: string;
  pass: string;
}

export interface LoginResponse {
  token: string;
  legacyToken?: string;
  user?: {
    id_usuario?: number;
    id_pais?: number;
  };
}

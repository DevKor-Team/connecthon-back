export type codeResponse = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export type tokenResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
}

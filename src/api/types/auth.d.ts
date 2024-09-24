export type LoginParams = {token: string; data?: any};

export type CreateTokenResponseCallback = (
  response: CreateTokenResponse,
) => void;

export type CreateTokenParams = {
  token: string;
  data?: any;
  provider: 'google' | 'apple';
};

export type CreateTokenResponseAuthType = {
  access_token: string;
  refresh_token: string;
};

export type CreateTokenResponseUserType = {
  email: string;
  family_name: string;
  given_name: string;
  guid: string;
  settings: any;
  is_created: boolean;
};

export type CreateTokenResponse = {
  auth: CreateTokenResponseAuthType;
  user: CreateTokenResponseUserType;
  loginMethod: 'google' | 'apple';
} | null;

export type RefreshTokenCallback = (response: CreateTokenResponse) => void;

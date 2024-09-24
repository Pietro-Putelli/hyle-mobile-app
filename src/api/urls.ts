export const BaseUrl =
  'https://xcmdj1g06g.execute-api.eu-central-1.amazonaws.com/Dev/v1';

export const AuthUrls = {
  CreateToken: `${BaseUrl}/auth/token`,
  RefreshToken: `${BaseUrl}/auth/refresh`,
};

export const ProfileUrls = {
  /* Allowed: [PATCH] */
  Session: `${BaseUrl}/sessions`,
  /* Allowed: [GET, PUT] */
  Me: `${BaseUrl}/users/me`,
};

export const BookUrls = {
  /* Allowed: [DELETE, PUT, GET] */
  Books: `${BaseUrl}/books`,
  /* Allowed: [GET, DELETE, POST, PUT] */
  Picks: `${BaseUrl}/books/picks`,
  /* Allowed: [GET, POST] */
  Topics: `${BaseUrl}/books/topics`,
  /* Allowed: [GET] */
  Search: `${BaseUrl}/search`,
  /* Allowed: [POST] */
  Save: `${BaseUrl}/books/save`,
};

export const AIUrls = {
  SharpPick: `${BaseUrl}/ai/sharp`,
  KeywordDetail: `${BaseUrl}/ai/keyword`,
  WordTranslation: `${BaseUrl}/ai/translate`,
};

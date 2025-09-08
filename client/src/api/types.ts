export interface User {
  id: string,
  name: string,
  login: string,
  settings: Record<string, string>,
  accessToken?: string,
  refreshToken?: string,
}

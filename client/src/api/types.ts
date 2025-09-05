export interface User {
  id: string,
  name: string,
  settings: Record<string, string>,
  accessToken?: string,
  refreshToken?: string,
}

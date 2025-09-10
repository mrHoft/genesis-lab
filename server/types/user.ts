export interface User {
  id: string
  name: string
  email?: string
  login?: string
  password?: string
  version: number
  settings?: Record<string, string>
  createdAt: number
  updatedAt: number
}

export interface CreateUserDto {
  name?: string
  email?: string
  login?: string
  password?: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  login?: string
  password: string
  newPassword?: string
}

export interface FindUserDto {
  id: string
}

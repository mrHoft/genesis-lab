export interface User {
  id: string;
  name: string;
  login?: string;
  password?: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreateUserDto {
  name?: string;
  login?: string;
  password?: string;
}

export interface UpdateUserDto {
  password: string;
  newPassword?: string;
  name?: string;
  login?: string;
}

export interface FindUserDto {
  id: string;
}

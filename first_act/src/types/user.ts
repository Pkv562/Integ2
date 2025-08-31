export interface User {
  id: string;
  username: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}
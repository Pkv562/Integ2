export interface User {
  id: string;
  username: string;
  password?: string; 
  code?: string; 
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiUser {
  _id: string;
  username: string;
  password?: string;
  code?: string;
  __v?: number; 
  number5?: string; 
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface ApiResponse<T = any> {
  user?: T;
  message?: string;
  data?: T;
  users?: T[]; 
  [key: string]: any; 
}

export interface CreateUserResponse extends ApiResponse {
  user?: ApiUser;
  message?: string;
}

export interface UpdateUserResponse extends ApiResponse {
  user?: ApiUser;
  message?: string;
}

export interface DeleteUserResponse extends ApiResponse {
  message?: string;
}

export interface GetUsersResponse extends ApiResponse {
  users?: ApiUser[];
  data?: ApiUser[];
  message?: string;
}

export const transformApiUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser._id,
    username: apiUser.username || 'Unknown User',
    password: apiUser.password,
    code: apiUser.code,
    createdAt: undefined, 
    updatedAt: undefined
  };
};

export const transformApiUsers = (apiUsers: ApiUser[]): User[] => {
  if (!Array.isArray(apiUsers)) return [];
  return apiUsers.map(transformApiUser);
};
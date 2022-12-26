export interface FullUser extends User {
  id: number;
}

export interface User {
  username: string;
  password: string;
  full_name: string;
  phone_number: string;
}

export interface AuthBody {
  username: string;
  password: string;
}

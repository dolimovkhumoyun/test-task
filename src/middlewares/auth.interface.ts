export type Decoded = {
  user: User;
};

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
};

export interface RequestAuthMiddleware extends Request {
  user: User;
}

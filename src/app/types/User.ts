export type User = {
  uid: string
  firstName: string;
  lastName: string;
  imageUrl: string;
};
export type AuthSignIn = {
  email: string;
  password: string;
};
export type AuthSignUp = AuthSignIn & User;

export interface User{
  uid: string;
  email: string;
  name: string;
  last_name: string;
  photo: string;
  verified: boolean;
  locale: {
    code: string;
    name: string;
  };
  country: {
    code: string;
    name: string;
  };
}
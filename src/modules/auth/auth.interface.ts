export type TUserRole = "contributor" | "maintainer";

export type TSignupPayload = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TUserResponse = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date;
};

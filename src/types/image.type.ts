import { IUser } from "./user.type";

export type Image = {
  id: number;
  name: string;
  path: string;
  tags: string;
  user: IUser;
};

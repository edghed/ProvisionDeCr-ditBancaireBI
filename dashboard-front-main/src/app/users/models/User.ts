import { RoleEnum } from './RoleEnum';

export class User {
    id!: number;
    username!: string;
    email!: string;
    password!: string;
    active!: boolean;
    roles!: RoleEnum[];
  }
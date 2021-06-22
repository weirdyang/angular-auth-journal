export interface Profile {
    username: string;
    following: boolean;
    avatar: string;
}

export interface IUser {
    id: string;
    email: string;
    username: string;
    avatar: string;
}

export interface IRegisterUser extends IUser {
    password: string;
}


export class RegisterUser implements IRegisterUser {
    password!: string;
    id!: string;
    username!: string;
    avatar!: string;
    email!: string;
}
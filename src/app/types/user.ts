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

export interface ILogin {
    username: string;
    password: string;
}


export class RegisterUser {
    password!: string;
    id!: string;
    username!: string;
    avatar!: string;
    email!: string;
}

export interface IApiResponse {
    message: string;
    hasError: boolean;
}
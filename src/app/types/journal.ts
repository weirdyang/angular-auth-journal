import { IUser } from "./user";

export interface Journal {
    title: string,
    entry: string,
    dateOfEntry: Date
    // here we provide relation between place and user schema, ref should be the model name
    user: string
};
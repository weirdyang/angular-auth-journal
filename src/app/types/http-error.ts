export interface IHttpError {
    message: string,
    additionalInfo: IErrorMessage[]
}

export interface IErrorMessage {
    name: string,
    error: string,
}
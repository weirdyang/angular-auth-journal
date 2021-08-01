export interface HttpError {
    message: string,
    additionalInfo: ErrorMessage[]
}

export interface ErrorMessage {
    name: string,
    error: string,
}
const validFileExtensions = [".jpg", ".jpeg", ".png"];

export const isValidImageExtension = (fileName: string) => {
    return validFileExtensions
        .some(el => fileName
            .endsWith(el));
}
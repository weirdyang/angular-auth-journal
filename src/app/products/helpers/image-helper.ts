const validFileExtensions = [".jpg", ".jpeg", ".png"];

export const isValidImageExtension = (fileName: string) => {
    return validFileExtensions
        .some(el => fileName.toLowerCase()
            .endsWith(el));
}
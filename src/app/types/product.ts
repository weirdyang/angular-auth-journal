export interface IProduct {
    name: string,
    description: string,
    productType: string
}
export interface IProductEdit extends IProduct {
    user: string;
    id: string;
}
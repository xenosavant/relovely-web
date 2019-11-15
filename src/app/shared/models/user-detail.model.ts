import { Product } from "./product.model";

export class UserDetail {
    public id: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public imageUrl: string;
    public numberListings: number;
    public numberSales: number;
    public numberFollowers: number;
    public numberFollowing: number;
    public products: Product[];
    public isSeller: boolean;
}
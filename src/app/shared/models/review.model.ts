import { Product } from "./product.model";
import { UserList } from "./user-list.model";

export class Review {
    id?: string;
    review: string;
    rating: number;
    seller?: UserList;
    reviewer?: UserList;
    product?: Product;
    date?: Date;
}
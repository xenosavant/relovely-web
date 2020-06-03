import { Product } from "./product.model";
import { UserList } from "./user-list.model";

export class Review {
    id?: string;
    body: string;
    title: string;
    percentage?: string;
    rating: number;
    seller?: UserList;
    reviewer?: UserList;
    reviewerId?: string;
    product?: Product;
    date?: Date;
}
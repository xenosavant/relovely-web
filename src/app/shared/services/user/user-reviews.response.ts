import { UserList } from "@app/shared/models/user-list.model";
import { Product } from "@app/shared/models/product.model";

export interface UserReviewsResponse {
    reviews: ReviewResponse[];
    name: string;
}

export class ReviewResponse {
    percentage: number;
    title: string;
    body: string;
    rating: number;
    date: Date;
    reviewer: UserList;
    product: Product;
}

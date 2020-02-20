import { Product } from "./product.model";
import { UserList } from "./user-list.model";

export class UserDetail {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profileImageUrl: string;
    totalListings?: number;
    totalSales?: number;
    totalFollowers?: number;
    totalFollowing?: number;
    listings?: Product[];
    followers?: UserList[];
    following?: UserList[];
    sales?: Product[];
    favorites?: Product[];
    type: string;
}
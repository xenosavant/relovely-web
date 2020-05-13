import { Product } from "./product.model";
import { UserList } from "./user-list.model";
import { IUserPreferences } from "../services/filter/filter-state";
import { Address } from "../interfaces/address.interface";

export class UserDetail {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profileImageUrl: string;
    listings?: Product[];
    followers?: UserList[];
    following?: UserList[];
    sales?: Product[];
    favorites?: Product[];
    type: string;
    preferences: IUserPreferences;
    addresses: Address[];
}
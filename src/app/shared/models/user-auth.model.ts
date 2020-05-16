import { IUserPreferences } from "../services/filter/filter-state";
import { Address } from "../interfaces/address.interface";

export class UserAuth {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profileImageUrl: string;
    listings?: string[];
    followers?: string[];
    following?: string[];
    sales?: string[];
    favorites?: string[];
    type: string;
    preferences: IUserPreferences;
    addresses: Address[];
}
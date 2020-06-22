import { IUserPreferences } from "../services/filter/filter-state";
import { Address } from "../interfaces/address.interface";
import { Card } from "../interfaces/card.interface";
import { PaymentCard } from "../interfaces/payment-card";
import { Order } from "./order.model";

export class UserAuth {
    id: string;
    email: string;
    admin?: boolean;
    firstName: string;
    lastName: string;
    username: string;
    profileImageUrl: string;
    listings?: string[];
    followers?: string[];
    following?: string[];
    usernameReset?: boolean;
    sales?: Order[];
    favorites?: string[];
    type: string;
    preferences: IUserPreferences;
    addresses: Address[];
    cards: PaymentCard[];
    facebookUserId: string;
    instagramUsername: string;
    seller?: {
        missingInfo: string[];
        errors: [],
        bankAccountLinked?: boolean;
        verificationStatus?: 'unverified' | 'review' | 'rejected' | 'verified';
    }
}
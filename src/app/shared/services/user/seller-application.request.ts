import { Address } from "@app/shared/interfaces/address.interface";


export interface SellerApplicationRequest {
    firstName: string;
    lastName: string;
    email: string;
    address: Address,
    instagramUsername: string;
    channel1: string;
    channel2: string;
    channel3: string;
}
import { Address } from "@app/shared/interfaces/address.interface";

export interface PostOrderRequest {
    address: Address;
    paymentId: string;
    shipmentId: string;
    tax: number;
    email?: string;
    last4?: string;
    cardType?: string;
}
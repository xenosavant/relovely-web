import { Address } from "@app/shared/interfaces/address.interface";

export interface PostOrderRequest {
    address: Address;
    paymentId: string;
    rateId: string;
    shipmentId: string;
}
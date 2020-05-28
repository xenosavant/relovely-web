import { Address } from "@app/shared/interfaces/address.interface";

export interface ShipmentPreviewRequest {
    toAddress: Address;
    weight: number;
    sellerId: string;
}
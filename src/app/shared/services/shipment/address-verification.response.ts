import { Address } from "@app/shared/interfaces/address.interface";

export interface AddressVerificationResponse {
    success: boolean;
    correctedAddress?: Address;
    errors?: string[];
}
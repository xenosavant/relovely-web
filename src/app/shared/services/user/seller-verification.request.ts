import { Address } from "@app/shared/interfaces/address.interface";
import { BankAccountRequest } from "./bank-acount-request";

export interface SellerVerificationRequest {
    firstName: string;
    lastName: string;
    birthDay: number;
    birthMonth: number;
    birthYear: number;
    address: Address;
    email: string;
    phone: string;
    ssn: string;
    tosAcceptDate: number;
    documentFront: string;
    documentBack: string;
    bankAccount?: BankAccountRequest;
}

import { Address } from "@app/shared/interfaces/address.interface";

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
    bankAccount?: BankAccountRequest;
}

export interface BankAccountRequest {
    routingNumber: string;
    accountNumber: string;
    name?: string;
}

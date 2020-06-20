import { PaymentCardType } from "../services/lookup/payment-card-map";

export interface PaymentCard {
    name: string;
    stripeId: string;
    last4: string;
    type: string;
    expirationMonth: number;
    expirationYear: number;
    primary?: boolean;
}
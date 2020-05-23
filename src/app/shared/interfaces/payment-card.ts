import { PaymentCardType } from "../services/lookup/payment-card-map";

export interface PaymentCard {
    name: string;
    stripeId: string;
    last4: string;
    type: PaymentCardType;
    expirationMonth: number;
    expirationYear: number;
    primary?: boolean;
}
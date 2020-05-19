export interface CreditCard {
    name: string;
    stripeId: string;
    last4: string;
    type: 'mastercard' | 'amex' | 'visa' | 'discover';
    expirationMonth: number;
    expirationYear: number;
}
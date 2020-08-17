export class Promo {
    id?: string;
    code: string;
    type: 'discount' | 'freeShipping';
    sellerId?: string;
    discountPercent?: number;

}
export class Promo {
    id?: string;
    code: string;
    type: 'discount' | 'freeShipping' | 'freeSale';
    sellerId?: string;
    discountPercent?: number;

}
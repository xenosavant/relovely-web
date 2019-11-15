import { Product } from "./product.model";

export class Order {
    public id?: string;
    public product: Product;
    public purchaseDate: string;
    public shipDate?: string;
    public deliveryDate?: string;
    public status: 'shipped' | 'unshipped' | 'cancelled' | 'delivered';
    public trackingNumber?: string;
    public shippingCarrerName: string;
    public shippingCarrerId: string;
    public total: number;
    public shippingCost: number;
    public tax: number;
}
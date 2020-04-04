import { Product } from "./product.model";
import { Address } from "../interfaces/address.interface";

export class Order {
    public id?: string;
    public product: Product;
    public purchaseDate: string;
    public shipDate?: string;
    public deliveryDate?: string;
    public status: 'paid' | 'shipped' | 'delivered' | 'review' | 'cancelled';
    public trackingNumber?: string;
    public shippingCarrierName: string;
    public shippingCarrerId: string;
    public price: number;
    public total: number;
    public shippingCost: number;
    public tax: number;
    public seller: string;
    public address: Address;
}
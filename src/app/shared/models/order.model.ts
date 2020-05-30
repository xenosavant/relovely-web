import { Product } from "./product.model";
import { Address } from "../interfaces/address.interface";
import { UserList } from "./user-list.model";

export class Order {
    public id?: string;
    public purchaseDate: string;
    public shipDate?: string;
    public deliveryDate?: string;
    public status: 'purchased' | 'shipped' | 'delivered' | 'review' | 'cancelled' | 'error';
    public shippingCarrier?: string;
    public total: number;
    public shippingCost: number;
    public shippingLabelUrl: string;
    public trackingUrl: string;
    public tax: number;
    public product: Product;
    public seller?: UserList;
    public buyer?: UserList;
    public address: Address;
}
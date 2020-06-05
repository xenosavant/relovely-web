import { Product } from "./product.model";
import { Address } from "../interfaces/address.interface";
import { UserList } from "./user-list.model";
import { Review } from "./review.model";

export class Order {
    public id?: string;
    public purchaseDate: string;
    public shipDate?: Date;
    public deliveryDate?: Date;
    public disputeDate?: Date;
    public resolutionDate?: Date;
    public status: OrderStatus;
    public shippingCarrier?: string;
    public total: number;
    public shippingCost: number;
    public shippingLabelUrl: string;
    public trackingUrl: string;
    public tax: number;
    public product: Product;
    public seller?: UserList;
    public buyer?: UserList;
    public review?: Review
    public address: Address;
    public orderNumber: string;
}

export type OrderStatus = 'purchased' | 'shipped' | 'delivered' | 'refunded' | 'cancelled' | 'error' | 'disputed';
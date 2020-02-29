import { UserList } from "./user-list.model";
import { Size } from "./size.model";
import { ImageSet } from "../interfaces/image-set.interface";

export class Product {
    public id?: string;
    public seller?: UserList;
    public title?: string;
    public images?: ImageSet[];
    public videos?: string[];
    public description?: string;
    public auctionStart?: Date;
    public currentBid?: number;
    public categories?: string[];
    public sizeId?: string;
    public size: string;
    public asset: string;
    public price: number;
    public moreItems?: Product[];
    public similarItems?: Product[];
    public favorited?: boolean;
    public sold?: boolean = false;
    public auction?: boolean = false;
    public tags?: string[];
}
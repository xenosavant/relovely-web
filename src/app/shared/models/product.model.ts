import { UserList } from "./user-list.model";
import { ImageSet } from "../interfaces/image-set.interface";
import { VideoMetaData } from "../interfaces/video-meta-data";

export class Product {
    public id?: string;
    public seller?: UserList;
    public sellerId?: string;
    public title?: string;
    public images?: ImageSet[];
    public videos?: VideoMetaData[];
    public description?: string;
    public auctionStart?: Date;
    public currentBid?: number;
    public categories?: string[];
    public sizes?: string[];
    public brand?: string;
    public sizeId?: string;
    public colorId?: string;
    public asset?: string;
    public price: number;
    public retailPrice?: number;
    public more?: any[];
    public similarItems?: Product[];
    public favorited?: boolean;
    public sold?: boolean = false;
    public tags?: string[];
    public cloudId?: string;
    public weight: number;
    public quantity?: number;
    public type?: 'item' | 'bundle'
}
import { UserList } from "./user-list.model";
import { Size } from "./size.model";
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
    public brand?: string;
    public sizeId?: string;
    public colorId?: string;
    public asset?: string;
    public price: number;
    public retailPrice?: number;
    public moreItems?: Product[];
    public similarItems?: Product[];
    public favorited?: boolean;
    public sold?: boolean = false;
    public auction?: boolean = false;
    public tags?: string[];
    public cloudId?: string;
}
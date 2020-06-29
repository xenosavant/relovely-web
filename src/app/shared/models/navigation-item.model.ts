import { KeyValue } from "@angular/common";
import { Category } from "./category.model";

export class NavigationItem {
    queryStrings?: KeyValue<string, string>[];
    path: string;
    name?: string;
    plural?: string;
    id?: string;
    subItems?: NavigationItem[];
    subCategories?: Category[];
    parent?: NavigationItem;
    alert?: boolean;
    scrollPosition?: number;
    data?: any = null;
    constructor(queryStrings: KeyValue<string, string>[], path: string, name: string, id: string,
        subItems: NavigationItem[], subCategories: Category[], parent: NavigationItem, plural: string = null, data: any = null, scrollPosition: number = null) {
        this.queryStrings = queryStrings;
        this.path = path || `/products/${this.id}`;
        this.subItems = subItems;
        this.subCategories = subCategories;
        this.parent = parent;
        this.name = name;
        this.id = id;
        this.plural = plural;
        this.alert = false;
        this.scrollPosition = scrollPosition;
        this.data = data;
    }
}
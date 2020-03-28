import { KeyValue } from "@angular/common";
import { Category } from "./category.model";

export class NavigationItem {
    queryStrings?: KeyValue<string, string>[];
    path: string;
    name?: string;
    id?: string;
    subItems?: NavigationItem[];
    subCategories?: Category[];
    parent?: NavigationItem;
    constructor(queryStrings: KeyValue<string, string>[], path: string, name: string, id: string,
        subItems: NavigationItem[], subCategories: Category[], parent: NavigationItem) {
        this.queryStrings = queryStrings;
        this.path = path || `/products/${this.id}`;
        this.subItems = subItems;
        this.subCategories = subCategories;
        this.parent = parent;
        this.name = name;
        this.id = id;
    }
}
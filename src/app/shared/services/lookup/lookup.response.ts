import { Category } from "@app/shared/models/category.model";

export interface LookupResponse {
    categories: Lookup;
    sizes: Lookup;
}

export interface Lookup {
    key: string;
    id: string;
    json: string;
}
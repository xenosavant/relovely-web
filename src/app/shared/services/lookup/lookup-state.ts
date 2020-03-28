import { Category } from "@app/shared/models/category.model";
import { SizeFilterGroup } from "@app/shared/models/size-filter-group.model";

export interface LookupState {
    categories: Category[];
    sizes: SizeFilterGroup[];
}
import { Category } from "@app/shared/models/category.model";
import { SizeFilterGroup } from "@app/shared/models/size-filter-group.model";
import { ColorFilter } from "@app/shared/interfaces/color-filter.interface";
import { PriceFilter } from "@app/shared/models/price-filter.model";

export interface LookupState {
    categories: Category[];
    sizes: SizeFilterGroup[];
    colors: ColorFilter[];
    prices: PriceFilter[];
}
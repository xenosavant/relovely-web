import { Product } from "@app/shared/models/product.model";

export interface ProductDetailResponse {
    product: Product;
    more: Product[];
}

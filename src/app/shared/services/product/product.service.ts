import { Injectable } from "@angular/core"; import { BaseService } from "../base.service"; import { Observable } from "rxjs"; import { UserDetail } from "@app/shared/models/user-detail.model"; import { map } from "rxjs/operators";
import { Product } from "@app/shared/models/product.model";
import { ListResponse } from "../list-response";
import { PriceRange } from "../filter/filter-state";

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseService {


    getProduct(productId: string): Observable<Product> {
        return this.httpClient.get<Product>(`${this.apiBaseUrl}/products/${productId}/`).pipe(
            map((result: Product) => {
                return result;
            })
        );
    }

    getProducts(page: number, categoryId: string, searchTerm: string = null, sizes: string[] = null, colors: string[] = null, prices: PriceRange[] = null): Observable<ListResponse<Product>> {
        let query = `?category=${categoryId}`;
        if (sizes) {
            let sizeArray = ''
            sizes.forEach((size, index) => {
                sizeArray += size;
                if (index !== sizeArray.length - 1) {
                    sizeArray += '+';
                }
            });
            query = query + `&sizes=${sizes}`;
        }
        if (colors) {
            let colorArray = ''
            colors.forEach((color, index) => {
                colorArray += color;
                if (index !== colorArray.length - 1) {
                    colorArray += '+';
                }
            });
            query = query + `&colors=${colors}`;
        }
        if (prices) {
            const json = JSON.stringify(prices);
            query = query + `&prices=${json}`
        }
        if (searchTerm) {
            query = query + `&terms=${searchTerm}`
        }

        query = query + `&pageLength=40`;
        query = query + `&page=${page}`;

        return this.httpClient.get<ListResponse<Product>>(`${this.apiBaseUrl}/products${query}`).pipe(
            map((result: ListResponse<Product>) => {
                return result;
            })
        );
    }

    postProduct(product: Product, userId: string): Observable<Product> {
        return this.httpClient.post<Product>(`${this.apiBaseUrl}/users/${userId}/products/`, product).pipe(
            map((result: Product) => {
                return result;
            })
        );
    }

    patchProduct(product: Partial<Product>, productId: string): Observable<Product> {
        return this.httpClient.patch<Product>(`${this.apiBaseUrl}/products/${productId}/`, product).pipe(
            map((result: Product) => {
                return result;
            })
        );
    }

    getFavorites(): Observable<ListResponse<Product>> {
        return this.httpClient.get<ListResponse<Product>>(`${this.apiBaseUrl}/products/favorites`).pipe(
            map((result: ListResponse<Product>) => {
                return result;
            })
        );
    }

    getListings(): Observable<ListResponse<Product>> {
        return this.httpClient.get<ListResponse<Product>>(`${this.apiBaseUrl}/products/listings`).pipe(
            map((result: ListResponse<Product>) => {
                return result;
            })
        );
    }

    favoriteProduct(productId: string): Observable<void> {
        return this.httpClient.patch<void>(`${this.apiBaseUrl}/products/${productId}/favorite/`, {});
    }

    deleteProduct(productId: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiBaseUrl}/products/${productId}/`, {})
    }

}
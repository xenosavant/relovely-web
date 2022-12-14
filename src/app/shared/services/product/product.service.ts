import { Injectable } from "@angular/core"; import { BaseService } from "../base.service"; import { Observable, Subject } from "rxjs"; import { UserDetail } from "@app/shared/models/user-detail.model"; import { map } from "rxjs/operators";
import { Product } from "@app/shared/models/product.model";
import { ListResponse } from "../list-response";
import { PriceRange } from "../filter/filter-state";
import { ProductDetailResponse } from "./product-detail.response";

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseService {


    public showCreateProduct$: Subject<{ product: Product, id: string, type: 'item' | 'bundle' }> = new Subject();
    public showImage$: Subject<string> = new Subject();
    public productModalClosed$: Subject<boolean> = new Subject();


    getProduct(productId: string): Observable<ProductDetailResponse> {
        return this.httpClient.get<ProductDetailResponse>(`${this.apiBaseUrl}/products/${productId}/`).pipe(
            map((result: ProductDetailResponse) => {
                return result;
            })
        );
    }

    getProducts(page: number, categoryId: string, searchTerm: string = null, sizes: string[] = null,
        colors: string[] = null, prices: PriceRange[] = null, types: string[]): Observable<ListResponse<Product>> {
        let query = `?category=${categoryId}`;
        if (sizes) {
            query = query + `&sizes=${sizes}`;
        }
        if (colors) {
            query = query + `&colors=${colors}`;
        }
        if (prices) {
            const json = JSON.stringify(prices);
            query = query + `&prices=${json}`
        }

        if (types) {
            query = query + `&types=${types}`
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

    viewProduct(id: string): Observable<void> {
        return this.httpClient.post(`${this.apiBaseUrl}/products/${id}/view`, {}).pipe(
            map(() => {
                return;
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

    public showProductCreate(product: Product, userId: string, type: 'bundle' | 'item') {
        this.showCreateProduct$.next({ product: product, id: userId, type: type });
    }

    public showImage(url: string) {
        this.showImage$.next(url);
    }

    public productModalClosed(success: boolean) {
        this.productModalClosed$.next(success);
    }

}
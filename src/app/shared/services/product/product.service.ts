import { Injectable } from "@angular/core"; import { BaseService } from "../base.service"; import { Observable } from "rxjs"; import { UserDetail } from "@app/shared/models/user-detail.model"; import { map } from "rxjs/operators";
import { Product } from "@app/shared/models/product.model";

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseService {

    postProduct(product: Product): Observable<Product> {
        return this.httpClient.post<Product>(`${this.apiBaseUrl}/products/`, product).pipe(
            map((result: Product) => {
                return result;
            })
        );
    }

}
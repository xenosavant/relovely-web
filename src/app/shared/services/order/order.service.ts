import { Injectable } from "@angular/core"; import { BaseService } from "../base.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Order } from "@app/shared/models/order.model";
import { PostOrderRequest } from "./post-order.request";
import { ListResponse } from "../list-response";

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService {

    getOrders(): Observable<ListResponse<Order>> {
        return this.httpClient.get<ListResponse<Order>>(`${this.apiBaseUrl}/orders/`).pipe(
            map((result: ListResponse<Order>) => {
                return result;
            })
        );
    }

    postOrder(order: PostOrderRequest, productId: string): Observable<Order> {
        return this.httpClient.post<Order>(`${this.apiBaseUrl}/products/${productId}/orders/`, order).pipe(
            map((result: Order) => {
                return result;
            })
        );
    }
}
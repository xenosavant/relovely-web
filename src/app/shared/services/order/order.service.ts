import { Injectable } from "@angular/core"; import { BaseService } from "../base.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Order } from "@app/shared/models/order.model";
import { PostOrderRequest } from "./post-order.request";
import { OrderListResponse } from "./order-list.response";

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService {

    getOrders(): Observable<OrderListResponse> {
        return this.httpClient.get<OrderListResponse>(`${this.apiBaseUrl}/orders/`).pipe(
            map((result: OrderListResponse) => {
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
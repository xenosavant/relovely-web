import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { Review } from "@app/shared/models/review.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Order } from "@app/shared/models/order.model";


@Injectable({ providedIn: 'root' })
export class ReviewService extends BaseService {


    postReview(review: Review, productId: string): Observable<Order> {
        return this.httpClient.post<Order>(`${this.apiBaseUrl}/products/${productId}/review/`, review).pipe(
            map((result: Order) => {
                return result;
            })
        );
    }
}
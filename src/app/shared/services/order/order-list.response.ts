import { ListResponse } from "../list-response";
import { Order } from "@app/shared/models/order.model";

export interface OrderListResponse extends ListResponse {
    orders: Order;
}
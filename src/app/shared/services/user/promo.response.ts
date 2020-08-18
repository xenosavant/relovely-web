import { Promo } from "@app/shared/models/promo.model";

export interface PromoResponse {
    promo?: Promo;
    rejectionReason?: string
}
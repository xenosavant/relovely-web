import { BaseService } from "../base.service";
import { Injectable } from "@angular/core";
import { AddressVerificationResponse } from "./address-verification.response";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Address } from "@app/shared/interfaces/address.interface";
import { ShipmentPreviewRequest } from "./shipment-preview.request";
import { ShipmentPreviewResponse } from "./shipment-preview.response";

@Injectable({ providedIn: 'root' })
export class ShipmentService extends BaseService {

    verifyAddress(address: Address): Observable<AddressVerificationResponse> {
        return this.httpClient.post<AddressVerificationResponse>(`${this.apiBaseUrl}/shipments/verify-address`, address).pipe(
            map((result: AddressVerificationResponse) => {
                return result;
            })
        );
    }

    previewShipment(request: ShipmentPreviewRequest): Observable<ShipmentPreviewResponse> {
        console.log(request);
        return this.httpClient.post<ShipmentPreviewResponse>(`${this.apiBaseUrl}/shipments/preview`, request).pipe(
            map((result: ShipmentPreviewResponse) => {
                return result;
            })
        );
    }
}
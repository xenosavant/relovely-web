import { Injectable } from "@angular/core"; import { BaseService } from "../base.service";
import { BehaviorSubject } from "rxjs";
import { Alert } from "./alert.interface";

@Injectable({ providedIn: 'root' })
export class AlertService extends BaseService {

    public notification$: BehaviorSubject<Alert[]> = new BehaviorSubject([]);

    public setAlert(notifications: Alert[]) {
        this.notification$.next(notifications);
    }

}
import { Injectable } from "@angular/core"; import { BaseService } from "../base.service";
import { Subject, BehaviorSubject } from "rxjs";
import { AppNotification } from "./notification.interface";
import { Alert } from "./alert.interface";

@Injectable({ providedIn: 'root' })
export class AlertService extends BaseService {

    public notification$: BehaviorSubject<Alert> = new BehaviorSubject({});

    public setAlert(notification: Alert) {
        this.notification$.next(notification);
    }

}
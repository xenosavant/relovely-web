import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HeaderService extends BaseService {

    headerVisible$: Subject<boolean> = new Subject();

    hideHeader(hide: boolean) {
        this.headerVisible$.next(hide);
    }
}
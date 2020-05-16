import { Pipe, PipeTransform } from "@angular/core";
import { LookupService } from "../services/lookup/lookup.service";

@Pipe({ name: 'appSize' })
export class AppSizePipe implements PipeTransform {

    constructor(private lookupService: LookupService) { }

    transform(sizeId: string): string {
        return this.lookupService.getSize(sizeId);
    }
}
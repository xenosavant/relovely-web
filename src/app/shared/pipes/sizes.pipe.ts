import { Pipe, PipeTransform } from "@angular/core";
import { LookupService } from "../services/lookup/lookup.service";

@Pipe({ name: 'appSizes' })
export class AppSizesPipe implements PipeTransform {

    constructor(private lookupService: LookupService) { }

    transform(sizes: string[]): string {
        let returnString = '';
        sizes.forEach(size => {
            returnString += (' ' + this.lookupService.getSize(size));
        })
        return returnString;
    }
}
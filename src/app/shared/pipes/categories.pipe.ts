import { Pipe, PipeTransform } from "@angular/core";
import { LookupService } from "../services/lookup/lookup.service";

@Pipe({ name: 'appCategories' })
export class CategoriesPipe implements PipeTransform {

    constructor(private lookupService: LookupService) { }

    transform(categories: string[]): string {
        let returnString = ''
        categories.forEach((cat, index) => {
            if (index !== 0) {
                returnString += this.lookupService.getCategory(cat).name;
            }
            if (index !== 0 && index !== categories.length - 1) {
                returnString += ', ';
            }
        })
        return returnString;
    }
}
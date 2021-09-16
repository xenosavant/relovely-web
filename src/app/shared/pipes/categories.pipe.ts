import { Pipe, PipeTransform } from "@angular/core";
import { LookupService } from "../services/lookup/lookup.service";

@Pipe({ name: 'appCategories' })
export class CategoriesPipe implements PipeTransform {

    constructor(private lookupService: LookupService) { }

    transform(categories: string[]): string {
        let returnString = '';
        const bottomLevelCats = categories.filter(ct => !this.lookupService.getCategory(ct).children.length);
        bottomLevelCats.forEach((cat, index) => {
            const category = this.lookupService.getCategory(cat);
            returnString += category.name;
            if (index !== bottomLevelCats.length - 1) {
                returnString += ', ';
            }
        })
        return returnString;
    }
}
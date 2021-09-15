import { Pipe, PipeTransform } from "@angular/core";
import { LookupService } from "../services/lookup/lookup.service";

@Pipe({ name: 'appCategory' })
export class CategoryPipe implements PipeTransform {

    constructor(private lookupService: LookupService) { }

    transform(categoryId: string): string {
        return this.lookupService.getCategory(categoryId).name;
    }
}
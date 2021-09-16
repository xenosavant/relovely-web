import { Pipe, PipeTransform } from "@angular/core";
import { Product } from "../models/product.model";
import { LookupService } from "../services/lookup/lookup.service";

@Pipe({ name: 'productTitle' })
export class ProductTitlePipe implements PipeTransform {

    constructor(private lookupService: LookupService) { }

    transform(product: Product): string {
        return product.title || ('Mystery Bundle ' + product.quantity.toString() + ' Items');
    }
}
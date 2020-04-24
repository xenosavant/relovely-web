
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appCurrency' })
export class AppCurrencyPipe implements PipeTransform {
    transform(amount: number): string {
        let value = (amount / 100).toFixed(2);
        value = '$' + value;
        return value;
    }
}
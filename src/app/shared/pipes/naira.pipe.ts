import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'naira',
  standalone: true
})
export class NairaPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null) return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value.toString();
    
    return '₦' + num.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}

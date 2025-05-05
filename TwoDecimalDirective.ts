
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTwoDecimal]'
})
export class TwoDecimalDirective {

  private navigationKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const value = input.value;
    const key = event.key;

    if (this.navigationKeys.includes(key) || (key === '.' && !value.includes('.'))) {
      return; // allow navigation keys and one decimal point
    }

    const currentValue = value;
    const selectionStart = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? 0;

    const newValue = 
      currentValue.substring(0, selectionStart) + 
      key + 
      currentValue.substring(selectionEnd);

    if (!/^\d*\.?\d{0,2}$/.test(newValue)) {
      event.preventDefault(); // block input if it violates the pattern
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    const value = input.value;

    const [integerPart, decimalPart] = value.split('.');
    if (decimalPart && decimalPart.length > 2) {
      input.value = integerPart + '.' + decimalPart.slice(0, 2);
      input.dispatchEvent(new Event('input'));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const sanitized = this.sanitizeValue(paste);
    this.el.nativeElement.value = sanitized;
    this.el.nativeElement.dispatchEvent(new Event('input'));
  }

  private sanitizeValue(value: string): string {
    const numeric = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = numeric.split('.');
    if (decimalPart !== undefined) {
      return integerPart + '.' + decimalPart.slice(0, 2);
    }
    return integerPart;
  }
}

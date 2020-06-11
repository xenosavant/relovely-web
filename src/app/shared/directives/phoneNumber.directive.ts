import { OnInit, HostListener, Renderer2, ElementRef, Directive, Renderer } from "@angular/core";

@Directive({
    selector: '[phone]'
})
export class PhoneNumberDirective implements OnInit {

    regex = new RegExp('[\D]', 'g');

    constructor(public el: ElementRef, public renderer: Renderer2) { }

    ngOnInit() {
        this.format(this.el.nativeElement.value); // format any initial values
        this.renderer.listen(this.el.nativeElement, 'paste', (event) => {

        })
    }

    @HostListener('keypress', ["$event"]) onKeypress(event: any) {
        if (event.key !== 'Backspace') {
            event.preventDefault();
            const char = String.fromCharCode(event.keyCode);
            const value = this.format(event.target.value + char);
            this.renderer.setProperty(this.el.nativeElement, 'value', value);
            const domEvent: Event = document.createEvent("Event");
            domEvent.initEvent('input', true, true);
            Object.defineProperty(domEvent, 'target', { value: this.el.nativeElement, enumerable: true });
            this.el.nativeElement['dispatchEvent'].apply(this.el.nativeElement, [domEvent]);
        }
    }


    @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
        event.preventDefault();
        this.format(event.clipboardData.getData('text/plain'));
    }

    format(val: string): string {
        let newVal = String(val).replace(/\D/g, '');
        if (!newVal) {
            return ''
        } else {
            if (newVal.length >= 3 && newVal.length < 6) {
                newVal = newVal.substring(0, 3) + '-' + newVal.substring(3, 6);
            } else if (newVal.length >= 6) {
                newVal = newVal.substring(0, 3) + '-' + newVal.substring(3, 6) + '-' + newVal.substring(6, 10);
            }
            return newVal;
        }
    }
}
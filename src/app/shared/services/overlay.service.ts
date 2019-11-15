import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OverlayService {
    private overlayRef: OverlayRef;
    private isOpen = false;

    constructor(
        private overlay: Overlay
    ) { }

    public open(content: TemplatePortal<any>) {
        this.overlayRef = this.overlay.create();
        if (!this.isOpen) {
            this.overlayRef.attach(content);
            this.isOpen = true;
        } else {
            throw (new Error('Multiple overlays'));
        }
    }

    public close() {

        if (this.isOpen) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.isOpen = false;
        }
    }
}
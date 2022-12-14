import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { UserService } from '@app/shared/services/user/user.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { PaymentCard } from '@app/shared/interfaces/payment-card';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent implements OnInit {


  @ViewChild('addCardModal', { static: true }) addAddressModal: TemplatePortal<any>;

  mobile: boolean;
  user: UserAuth;
  primary: PaymentCard;
  loading = true;
  error: string = null;

  primarySubject$ = new Subject<boolean>();

  constructor(private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef,
    private navigationService: NavigationService,
    private userService: UserService,
    private overlayService: OverlayService) { }

  ngOnInit() {
    this.user = this.userService.user$.getValue();
    if (!this.user) {
      this.navigationService.navigate({ 'path': '/' })
    }
    this.navigationService.showNavBar(true, 'Payment Methods');
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
      this.ref.markForCheck();
    });
    this.primary = this.user.cards.find(card => card.primary)
    this.loading = false;
    this.ref.markForCheck();
    const sub = this.primarySubject$.pipe(
      debounceTime(500),
      switchMap(val =>
        this.primaryChanged())
    ).subscribe(result => {
      this.user = this.userService.user$.getValue();
      this.primary = this.user.cards.find(card => card.primary);
      this.ref.markForCheck();
    })
  }

  cardCreated(card: PaymentCard) {
    this.userService.addCard(card).subscribe(result => {
      this.error = null;
      this.userService.setCurrentUser(result);
      this.user = result;
      this.primary = this.user.cards.find(c => c.primary);
      this.overlayService.close();
      this.ref.markForCheck();
    }, err => {
      this.overlayService.close();
      this.error = err.error.error.message;
      this.ref.markForCheck();
    })
  }

  addCard() {
    this.overlayService.open(this.addAddressModal);
  }

  close() {
    this.overlayService.close();
  }

  primaryChanged(): Observable<UserAuth> {
    const updates = [];
    this.user.cards.forEach(card => {
      if (card.stripeId === this.primary.stripeId) {
        card.primary = true;
      } else if (card.primary) {
        delete card.primary;
      }
      updates.push(card);
    });
    return this.userService.updateUser(this.user.id, { cards: updates });
  }

}
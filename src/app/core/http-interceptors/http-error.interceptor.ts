import { Injectable, Injector, ErrorHandler } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';

/** Passes HttpErrorResponse to application-wide error handler */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private userSerice: UserService, private navigationService: NavigationService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private handleAccess(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userSerice.jwt;
    let changedRequest = request;
    if (request.url.indexOf('cloudinary') === -1) {
      const headerSettings: { [name: string]: string | string[]; } = {};

      for (const key of request.headers.keys()) {
        headerSettings[key] = request.headers.getAll(key);
      }
      if (token) {
        headerSettings['Authorization'] = 'Bearer ' + token;
      }
      headerSettings['Content-Type'] = 'application/json';
      headerSettings['Cache-Control'] = 'no-cache';
      const newHeader = new HttpHeaders(headerSettings);
      changedRequest = request.clone({
        headers: newHeader
      });
    }
    return next.handle(changedRequest).pipe(
      tap((next) => {
        // do we need to do anythuing here?
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.userSerice.logout();
          }
          const appErrorHandler = this.injector.get(ErrorHandler);
          appErrorHandler.handleError(err);
        }
      })
    );
  }
}

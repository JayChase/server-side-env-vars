import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ServerStateInterceptor {
  constructor(private transferState: TransferState) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    } else {
      return next.handle(request).pipe(
        tap(event => {
          if (event instanceof HttpResponse && event.ok) {
            this.transferState.set(
              makeStateKey(request.urlWithParams),
              event.body
            );
          }
          return event;
        })
      );
    }
  }
}

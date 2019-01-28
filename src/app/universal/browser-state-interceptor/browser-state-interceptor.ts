import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Observable ,  of } from 'rxjs';

@Injectable()
export class BrowserStateInterceptor {
  constructor(private transferState: TransferState) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    } else {
      const msk = makeStateKey;
      //console.log(makeStateKey(request.urlWithParams));
      const state = this.transferState.get(
        makeStateKey(request.urlWithParams),
        null
      );

      if (state) {
        const res = new HttpResponse({
          body: state
        });

        return of(res);
      } else {
        return next.handle(request);
      }
    }
  }
}

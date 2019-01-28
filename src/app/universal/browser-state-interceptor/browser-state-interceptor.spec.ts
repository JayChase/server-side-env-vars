import { BrowserStateInterceptor } from './browser-state-interceptor';
import { TestBed, inject } from '@angular/core/testing';
import {
  TransferState,
  BrowserModule,
  makeStateKey
} from '@angular/platform-browser';

describe('BrowserStateInterceptor', () => {
  let req: any;
  let next: any;

  beforeEach(() => {
    next = {
      handle: value => {}
    };

    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        TransferState,
        BrowserStateInterceptor,
        {
          provide: makeStateKey,
          useValue: key => key
        }
      ]
    });
  });

  it(
    'should create an instance',
    inject(
      [BrowserStateInterceptor, TransferState],
      (
        browserStateInterceptor: BrowserStateInterceptor,
        transferState: TransferState
      ) => {
        expect(browserStateInterceptor).toBeTruthy();
      }
    )
  );

  it(
    'should call next.handle(req) if request is not GET',
    inject(
      [BrowserStateInterceptor],
      (browserStateInterceptor: BrowserStateInterceptor) => {
        req = {
          method: 'POST'
        };
        spyOn(next, 'handle').and.callFake(() => {});

        browserStateInterceptor.intercept(req, next);

        expect(next.handle).toHaveBeenCalledWith(req);
      }
    )
  );

  describe('request is get', () => {
    it(
      'should check for any state entries with the key of the fullUrl',
      inject(
        [BrowserStateInterceptor, TransferState],
        (
          browserStateInterceptor: BrowserStateInterceptor,
          transferState: TransferState
        ) => {
          req = {
            method: 'GET',
            urlWithParams: 'testUrl'
          };

          spyOn(transferState, 'get').and.callFake(() => {});

          browserStateInterceptor.intercept(req, next);

          expect(transferState.get).toHaveBeenCalledWith(
            req.urlWithParams,
            null
          );
        }
      )
    );

    it('if state exists return state as response', done => {
      inject(
        [BrowserStateInterceptor, TransferState],
        (
          browserStateInterceptor: BrowserStateInterceptor,
          transferState: TransferState
        ) => {
          req = {
            method: 'GET',
            urlWithParams: 'testUrl'
          };

          const state = {};

          spyOn(transferState, 'get').and.callFake(() => state);

          browserStateInterceptor
            .intercept(req, next)
            .subscribe((result: any) => {
              expect(result.body).toBe(state);
              done();
            });
        }
      )();
    });

    it(
      'if not state call next with state',
      inject(
        [BrowserStateInterceptor, TransferState],
        (
          browserStateInterceptor: BrowserStateInterceptor,
          transferState: TransferState
        ) => {
          req = {
            method: 'GET',
            urlWithParams: 'testUrl'
          };

          spyOn(next, 'handle').and.callFake(() => {});
          spyOn(transferState, 'get').and.callFake(() => null);

          browserStateInterceptor.intercept(req, next);

          expect(next.handle).toHaveBeenCalledWith(req);
        }
      )
    );
  });
});

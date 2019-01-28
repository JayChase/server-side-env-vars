import { ServerStateInterceptor } from './server-state-interceptor';
import { TestBed, inject } from '@angular/core/testing';
import { TransferState, BrowserModule } from '@angular/platform-browser';

describe('ServerStateInterceptor', () => {
  const mockTransferState = {
    set: (key, value) => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [TransferState, ServerStateInterceptor]
    });
  });

  it(
    'should create an instance',
    inject(
      [ServerStateInterceptor],
      (serverStateInterceptor: ServerStateInterceptor) => {
        expect(serverStateInterceptor).toBeTruthy();
      }
    )
  );
});

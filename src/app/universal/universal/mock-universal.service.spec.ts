import { Injectable } from '@angular/core';
import { SsrSizes } from './ssr-sizes';
import { UniversalService } from './universal.service';

@Injectable()
export class MockUniversalService extends UniversalService {
  constructor() {
    super('browser', { get: () => null });
  }
}

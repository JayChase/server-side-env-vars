import { Injectable, PLATFORM_ID, Inject, Injector } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { SsrSizes } from './ssr-sizes';

@Injectable()
export class UniversalService {
  private ssrIsMobile: boolean;

  constructor(
    @Inject(PLATFORM_ID) public platform_id: any,
    injector: Injector
  ) {
    if (this.isServer()) {
      const ssrSettings = injector.get('ssrSettings');
      this.ssrIsMobile = ssrSettings.isMobile;
    }
  }

  /**
   * Returns true is the code is running on browser, false for every other environment
   */
  isBrowser(): boolean {
    return isPlatformBrowser(this.platform_id);
  }

  isServer(): boolean {
    return isPlatformServer(this.platform_id);
  }

  ssrScreenSize(): SsrSizes | string {
    if (this.isBrowser()) {
      return '';
    } else {
      return this.ssrIsMobile ? 'sm' : 'lg';
    }
  }

  ssrMobile(): boolean {
    if (this.isServer()) {
      return this.ssrIsMobile;
    } else {
      return false;
    }
  }
}

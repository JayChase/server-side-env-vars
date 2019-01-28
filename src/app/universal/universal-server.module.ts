import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { UniversalService } from './universal/universal.service';

@NgModule({
  imports: [CommonModule]
})
export class UniversalServerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UniversalServerModule,
      providers: [UniversalService]
    };
  }
}

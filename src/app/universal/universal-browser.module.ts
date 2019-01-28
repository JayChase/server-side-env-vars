import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { UniversalService } from './universal/universal.service';


@NgModule({
  imports: [CommonModule]
})
export class UniversalBrowserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UniversalBrowserModule,
      providers: [UniversalService]
    };
  }
}

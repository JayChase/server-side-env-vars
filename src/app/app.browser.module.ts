import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserTransferStateModule,
  makeStateKey,
  TransferState
} from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { BrowserStateInterceptor } from './universal/browser-state-interceptor/browser-state-interceptor';

@NgModule({
  imports: [AppModule, BrowserTransferStateModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserStateInterceptor,
      multi: true,
      deps: [TransferState]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {
  constructor(private transferState: TransferState) {
    this.setEnvironmentVariables();
  }

  private setEnvironmentVariables() {
    const injectedEnvVars = this.transferState.get<any>(
      makeStateKey('INJECTED_ENV_VARS'),
      null
    );

    // not working yet need to handle properties that exist on environment but not injectedVars
    if (injectedEnvVars) {
      this.applyInjectedValues(environment, injectedEnvVars);
    }

    return environment;
  }

  private applyInjectedValues(
    environmentObject: any,
    injectedEnvVars: any,
    propertyName?: string
  ) {
    const injectedEnvVarProperty = propertyName
      ? injectedEnvVars[propertyName]
      : injectedEnvVars;
    if (injectedEnvVarProperty instanceof Object) {
      Object.keys(injectedEnvVarProperty).forEach(propertyKey => {
        this.applyInjectedValues(
          propertyName ? environmentObject[propertyName] : environmentObject,
          injectedEnvVarProperty,
          propertyKey
        );
      });
    } else {
      environmentObject[propertyName] = injectedEnvVars[propertyName];
    }
  }
}

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Inject, Injector, NgModule } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import {
  ServerModule,
  ServerTransferStateModule
} from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { DYNAMIC_ENVIRONMENT } from './dynamic-environment.token';
import { ServerStateInterceptor } from './universal/server-state-interceptor/server-state-interceptor';
import { UniversalServerModule } from './universal/universal-server.module';

export function DynamicEnvVarsFactory(
  transferState: TransferState,
  injector: Injector
) {
  const injectedEnvVars = injector.get('injectedEnvVars');
  console.log(`injectedEnvVar ${JSON.stringify(injectedEnvVars)}`);
  // add the env vars to the transfer state so the browser app module can load them
  transferState.set(makeStateKey('INJECTED_ENV_VARS'), injectedEnvVars);
  return injectedEnvVars;
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    UniversalServerModule.forRoot(),
    ServerTransferStateModule,
    ModuleMapLoaderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerStateInterceptor,
      multi: true,
      deps: [TransferState]
    },
    {
      provide: DYNAMIC_ENVIRONMENT,
      useFactory: DynamicEnvVarsFactory,
      deps: [TransferState, Injector]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
  constructor(@Inject(DYNAMIC_ENVIRONMENT) private dynamicEnvironment: any) {}
}

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule.withServerTransition({
      appId: 'env-app'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ItemsComponent } from './items/items.component'
import { BenchComponent } from './bench/bench.component'
import { ChampionsComponent } from './champions/champions.component'

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    BenchComponent,
    ChampionsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

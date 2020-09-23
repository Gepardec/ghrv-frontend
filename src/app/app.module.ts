import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { MaterialModule } from './material.module';
import { ChartComponent } from './components/chart/chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './components/app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ViewModeComponent } from './components/sidebar/filter/view-mode/view-mode.component';
import { RepoSelectionComponent } from './components/sidebar/filter/repo-selection/repo-selection.component';
import { BestReposComponent } from './components/sidebar/filter/best-repos/best-repos.component';
import { DateSelectionComponent } from './components/sidebar/filter/date-selection/date-selection.component';
import { StorageService } from './services/storage.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LanguageComponent } from './components/sidebar/language/language.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DEFAULT_LANG } from './globals';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    SidebarComponent,
    ViewModeComponent,
    RepoSelectionComponent,
    BestReposComponent,
    DateSelectionComponent,
    LanguageComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: DEFAULT_LANG,
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    })
  ],
  providers: [StorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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
import { HelpComponent } from './components/sidebar/help/help.component';

import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    SidebarComponent,
    ViewModeComponent,
    RepoSelectionComponent,
    BestReposComponent,
    DateSelectionComponent,
    HelpComponent
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
  ],
  providers: [StorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

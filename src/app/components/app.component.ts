import { Component, HostListener, OnInit } from '@angular/core';
import { Stat } from '../models/stat';
import { ViewMode } from '../models/view-mode';
import * as moment from 'moment';
import { Moment } from 'moment';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';
import { ChartSidebarCommunicationService } from '../services/chart-sidebar-communication.service';
import { DateSelection } from '../models/date-selection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  stats = new Map<string, Stat[]>();
  allRepos: string[] = [];

  selectedRepos: string[] = [];
  bestCount: number;
  viewMode: ViewMode;
  fromDate: Moment;
  toDate: Moment;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    public communicationService: ChartSidebarCommunicationService) {
  }

  ngOnInit(): void {
    const uiSettings = this.storageService.readUiSettings();

    this.toDate = moment().subtract(1, 'day');
    this.fromDate = this.toDate.clone().subtract(1, 'month');
    this.viewMode = uiSettings.viewMode;
    this.bestCount = uiSettings.bestCount;

    this.loadData();
  }

  loadData(): void {
    this.communicationService.sidebarInitialized.emit(false);

    this.httpService.findAllGrouped(this.fromDate, this.toDate).subscribe(
      data => {
        this.stats.clear();
        for (const key of Object.keys(data)) {
          this.stats.set(key, data[key]);
        }
        this.allRepos = Array.from(this.stats.keys()).sort((a, b) => a.localeCompare(b));
        this.storeBestCountRepos(this.bestCount);
        this.communicationService.sidebarInitialized.emit(true);
      },
      error => {
        console.error(error);
      }
    );
  }

  onViewModeChange(viewMode: ViewMode): void {
    this.viewMode = viewMode;
  }

  onRepoSelectionChange(selectedRepos: string[]): void {
    this.selectedRepos = selectedRepos;
  }

  onBestCountChange(bestCount: number): void {
    this.bestCount = bestCount;
    this.storeBestCountRepos(this.bestCount);
  }

  onDateSelectionChange(dateSelection: DateSelection): void {
    this.fromDate = dateSelection.fromDate;
    this.toDate = dateSelection.toDate;
    this.loadData();
  }

  onRestoreDefaultChange(): void {
    this.storageService.removeUiSettings();
    this.ngOnInit();
  }

  private storeBestCountRepos(bestCount: number): void {
    const bestStats = [];
    for (const repo of this.allRepos) {
      const sum = this.stats.get(repo).reduce((acc, stat) => acc + stat[this.viewMode.apiName], 0);
      bestStats.push({repo, sum});
    }
    this.selectedRepos = bestStats.sort((a, b) => b.sum - a.sum).slice(0, bestCount).map(s => s.repo);
  }

  @HostListener('window:beforeunload', ['$event'])
  private storeUiSettings($event: Event): void {
    this.storageService.storeUiSettings({
      viewMode: this.viewMode,
      bestCount: this.bestCount
    });
  }
}

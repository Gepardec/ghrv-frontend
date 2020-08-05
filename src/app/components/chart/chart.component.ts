import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Stat } from '../../models/stat';
import { Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { MatSelectChange } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';
import { LocalStorageService } from '../../services/local-storage.service';
import { ViewMode } from '../../models/view-mode';

export const DATE_FORMAT = 'YYYY-MM-DD';
// noinspection SpellCheckingInspection
export const datePickerFormat = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: DATE_FORMAT,
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: datePickerFormat}
  ]
})

export class ChartComponent implements OnInit {
  statsMappedByRepository: Map<string, Stat[]> = new Map();
  topStats: Map<string, number> = new Map();
  chartLabelsXAxis: Label[] = [];
  chartData: ChartDataSets[] = [];
  allRepoNames: string[] = [];
  selectedRepoNames: string[] = [];

  viewMode: ViewMode = ViewMode.TOTAL;
  viewModeKeys = Object.keys(ViewMode);
  viewModeClassReference = ViewMode;

  topNRepos: number;
  toDate: Moment = moment().subtract(1, 'day');
  fromDate: Moment = this.toDate.clone().subtract(1, 'month');

  MIN_DATE: Moment = moment('2020-01-01');
  MAX_DATE: Moment = moment().subtract(1, 'day');

  initFinished = false;
  initiallyLoaded = false;

  chartOptions: ChartOptions;

  constructor(private httpService: HttpService, private storageService: LocalStorageService) {
  }

  ngOnInit(): void {
    const uiSettings = this.storageService.readUiSettingsFromLocalStorage();
    this.viewMode = uiSettings.viewMode;
    this.topNRepos = uiSettings.topNRepos;
    this.loadDataAndInit();
  }

  loadDataAndInit(): void {
    this.httpService.findAllGrouped(this.fromDate, this.toDate).subscribe(
      data => {
        this.statsMappedByRepository.clear();
        for (const key of Object.keys(data)) {
          this.statsMappedByRepository.set(key, data[key]);
        }

        const itemSize = this.statsMappedByRepository.size;
        console.log(itemSize);
        if (itemSize === 0) {
          this.initFinished = true;
          return;
        } else if (itemSize >= 1 && itemSize <= 5) {
          this.topNRepos = itemSize;
        } else if (itemSize > 5 || !this.topNRepos) {
          this.topNRepos = this.storageService.readUiSettingsFromLocalStorage().topNRepos;
        } else {

        }

        this.allRepoNames = Array.from(this.statsMappedByRepository.keys()).sort();
        this.fillTopStats();
        this.initChartOptions();
        this.filterBestNRepos();
        this.initiallyLoaded = true;
      },
      error => {
        console.error(error);
        this.initFinished = true;
      }
    );
  }

  public isStorageModified(): boolean {
    const selectedReposFromStorage = this.storageService.readUiSettingsFromLocalStorage().repositories;
    return !selectedReposFromStorage.every(value => this.selectedRepoNames.includes(value));
  }

  fillTopStats(): void {
    this.topStats.clear();
    for (const repo of this.allRepoNames) {
      let cnt = 0;
      for (const statReduced of this.statsMappedByRepository.get(repo)) {
        cnt += statReduced.totalViews;
      }
      this.topStats.set(repo, cnt);
    }
  }

  initChart(): void {
    const dates = this.getDateListBetween();
    this.chartLabelsXAxis = dates;

    for (const repo of this.statsMappedByRepository.keys()) {
      const statArr: Stat[] = this.statsMappedByRepository.get(repo);
      for (const date of dates) {
        if (!statArr.map(stat => stat.statDate).includes(date)) {
          statArr.push({totalViews: 0, statDate: date, uniqueViews: 0});
        }
      }
      this.statsMappedByRepository.set(
        repo,
        statArr.sort((a, b) => {
          return moment(a.statDate).diff(moment(b.statDate), 'day');
        }));
    }

    for (const repo of this.selectedRepoNames) {
      const repoChartDataSets: ChartDataSets = {
        label: repo, data: [], lineTension: 0, borderWidth: 1
      };
      for (const stat of this.statsMappedByRepository.get(repo)) {
        (repoChartDataSets.data as any[]).push({x: stat.statDate, y: stat[this.viewMode.apiName]});
      }
      this.chartData.push(repoChartDataSets);
    }
    this.storeDataInLocalStorage();
    this.initFinished = true;
  }

  onSelectChanged(event: MatSelectChange): void {
    this.resetChart();
    this.selectedRepoNames = event.value;
    this.initChart();
  }

  onCurrentModeChange(): void {
    this.resetChart();
    this.initChartOptions();
    this.initChart();
  }

  onSelectAllClicked(): void {
    this.selectedRepoNames = this.allRepoNames;
    const uiSettings = this.storageService.readUiSettingsFromLocalStorage();
    uiSettings.repositories = this.selectedRepoNames;
    this.storageService.storeUiSettingsInLocalStorage(uiSettings);
    this.resetChart();
    this.initChart();
  }

  onDeselectAllClicked(): void {
    this.selectedRepoNames = [];
    this.resetChart();
    this.initChart();
  }

  resetChart(): void {
    this.initFinished = false;
    this.chartData = [];
    this.chartLabelsXAxis = [];
  }

  filterBestNRepos(): void {
    this.resetChart();

    this.topStats = new Map([...this.topStats.entries()].sort((pair1, pair2) => pair2[1] - pair1[1]));
    this.selectedRepoNames = Array.from({length: +this.topNRepos}, function(): any {
      return this.next().value;
    }, this.topStats.keys());

    if (this.storageService.readUiSettingsFromLocalStorage().repositories !== null) {
      if (!this.initiallyLoaded && this.isStorageModified()) {
        this.selectedRepoNames = this.storageService.readUiSettingsFromLocalStorage().repositories;
      }
    }
    this.initChart();
  }

  isValidBestReposN(): boolean {
    return this.topNRepos && this.topNRepos >= 1 && this.topNRepos <= this.allRepoNames.length;
  }

  shouldShowFilterCards(): boolean {
    return this.statsMappedByRepository && this.statsMappedByRepository.size > 0;
  }

  public restoreDefaults(): void {
    this.storageService.initializeLocalStorage();
    this.initFinished = false;
    this.ngOnInit();
  }

  private getDateListBetween(): string[] {
    const dates: string[] = [];
    for (const currentDate = moment(this.fromDate); currentDate.isBefore(this.toDate, 'day'); currentDate.add(1, 'day')) {
      dates.push(currentDate.format(DATE_FORMAT));
    }
    return dates;
  }

  private initChartOptions(): void {
    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date'
          },
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'YYYY-MM-DD'
            }
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: (this.viewMode === ViewMode.TOTAL ? 'Total' : 'Unique') + ' views'
          }
        }]
      },
    };
  }

  private storeDataInLocalStorage(): void {
    const toDate: Moment = moment().subtract(1, 'day');
    this.storageService.storeUiSettingsInLocalStorage({
      viewMode: this.viewMode,
      repositories: this.selectedRepoNames,
      topNRepos: this.topNRepos,
      toDate,
      fromDate: toDate.clone().subtract(1, 'month')
    });
  }
}

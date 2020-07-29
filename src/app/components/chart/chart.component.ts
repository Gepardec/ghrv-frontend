import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Stat} from '../../models/stat';
import {Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {MatSelectChange} from '@angular/material/select';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import * as moment from 'moment';
import {Moment} from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';
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
  groupedStats: Map<string, Stat[]> = new Map();
  topStats: Map<string, number> = new Map();
  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [];
  allRepos: string[] = [];
  selectedRepos: string[] = [];
  currentMode = 'count';
  bestReposN;
  toDate: Moment = moment().subtract(1, 'day');
  fromDate: Moment = this.toDate.clone().subtract(1, 'month');

  MIN_DATE: Moment = moment('2020-01-01');
  MAX_DATE: Moment = moment().subtract(1, 'day');

  initFinished = false;

  public chartOptions: ChartOptions;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.loadDataAndInit();
  }

  loadDataAndInit(): void {
    this.httpService.findAllGrouped(this.fromDate, this.toDate).subscribe(
      data => {
        this.groupedStats.clear();
        for (const key of Object.keys(data)) {
          this.groupedStats.set(key, data[key]);
        }
        const itemSize = this.groupedStats.size;
        if (itemSize === 0) {
          this.initFinished = true;
          return;
        } else if (itemSize > 0 && itemSize <= 5) {
          this.bestReposN = itemSize;
        } else if (!this.bestReposN) {
          this.bestReposN = 5;
        }
        this.allRepos = Array.from(this.groupedStats.keys()).sort();
        this.fillTopStats();
        this.initChartOptions();
        this.filterBestNRepos();
      },
      error => {
        console.error(error);
      }
    );
  }

  fillTopStats(): void {
    this.topStats.clear();
    for (const repo of this.allRepos) {
      let cnt = 0;
      for (const statReduced of this.groupedStats.get(repo)) {
        cnt += statReduced.count;
      }
      this.topStats.set(repo, cnt);
    }
  }

  initChart(): void {
    const dates = this.getDateListBetween();
    this.chartLabels = dates;

    for (const repo of this.groupedStats.keys()) {
      const statArr: Stat[] = this.groupedStats.get(repo);
      for (const date of dates) {
        if (!statArr.map(stat => stat.statDate).includes(date)) {
          statArr.push({count: 0, statDate: date, uniques: 0});
        }
      }
      this.groupedStats.set(
        repo,
        statArr.sort((a, b) => {
          return moment(a.statDate).diff(moment(b.statDate), 'day');
        }));
    }

    for (const repo of this.selectedRepos) {
      const repoChartDataSets: ChartDataSets = {
        label: repo, data: [], lineTension: 0, borderWidth: 1
      };
      for (const stat of this.groupedStats.get(repo)) {
        (repoChartDataSets.data as any[]).push({x: stat.statDate, y: stat[this.currentMode]});
      }
      this.chartData.push(repoChartDataSets);
    }

    this.initFinished = true;
  }

  onSelectChanged(event: MatSelectChange): void {
    this.resetChart();
    this.selectedRepos = event.value;
    this.initChart();
  }

  onCurrentModeChange(): void {
    this.resetChart();
    this.initChartOptions();
    this.initChart();
  }

  onSelectAllClicked(): void {
    this.selectedRepos = this.allRepos;
    this.resetChart();
    this.initChart();
  }

  onDeselectAllClicked(): void {
    this.selectedRepos = [];
    this.resetChart();
    this.initChart();
  }

  resetChart(): void {
    this.initFinished = false;
    this.chartData = [];
    this.chartLabels = [];
  }

  filterBestNRepos(): void {
    this.resetChart();

    this.topStats = new Map([...this.topStats.entries()].sort((pair1, pair2) => pair2[1] - pair1[1]));
    this.selectedRepos = Array.from({length: +this.bestReposN}, function() {
      return this.next().value;
    }, this.topStats.keys());

    this.initChart();
  }

  isValidBestReposN(): boolean {
    return this.bestReposN && this.bestReposN >= 1 && this.bestReposN <= this.allRepos.length;
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
            labelString: (this.currentMode === 'count' ? 'Total' : 'Unique') + ' views'
          }
        }]
      },
    };
  }

}

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Stat } from '../../models/stat';
import { Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ViewMode } from '../../models/view-mode';
import { DATE_FORMAT } from '../../globals';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnChanges, OnInit {
  @Input() stats: Map<string, Stat[]>;
  @Input() selectedRepos: string[];
  @Input() toDate: Moment;
  @Input() fromDate: Moment;
  @Input() viewMode: ViewMode;

  chartLabelsXAxis: Label[] = [];
  chartDataSets: ChartDataSets[] = [];
  chartOptions: ChartOptions;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe(async () => await this.initChartOptions());
  }

  async ngOnChanges(): Promise<void> {
    this.resetChart();
    await this.initChartOptions();
    this.initChart();
  }

  initChart(): void {
    const dates = this.getDateListBetween();
    this.chartLabelsXAxis = dates;

    for (const repo of this.stats.keys()) {
      if (this.selectedRepos.includes(repo)) {
        const statArr: Stat[] = this.stats.get(repo);
        for (const date of dates) {
          if (!statArr.map(stat => stat.statDate).includes(date)) {
            statArr.push({totalViews: 0, statDate: date, uniqueViews: 0});
          }
        }
        this.stats.set(
          repo,
          statArr.sort((a, b) => {
            return moment(a.statDate).diff(moment(b.statDate), 'day');
          }));
      }
    }

    for (const repo of this.selectedRepos) {
      if (this.selectedRepos.includes(repo)) {
        const repoChartDataSets: ChartDataSets = {
          label: repo, data: [], lineTension: 0, borderWidth: 3, steppedLine: false, fill: true
        };
        for (const stat of this.stats.get(repo)) {
          (repoChartDataSets.data as any[]).push({x: stat.statDate, y: stat['' + this.viewMode]});
        }
        this.chartDataSets.push(repoChartDataSets);
      }
    }
  }

  resetChart(): void {
    this.chartDataSets = [];
    this.chartLabelsXAxis = [];
  }

  private getDateListBetween(): string[] {
    const dates: string[] = [];
    for (const currentDate = moment(this.fromDate);
         currentDate.isSameOrBefore(this.toDate, 'day');
         currentDate.add(1, 'day')) {
      dates.push(currentDate.format(DATE_FORMAT));
    }
    return dates;
  }

  private async initChartOptions(): Promise<void> {
    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 0
      },
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
              day: DATE_FORMAT
            }
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: await this.translateService
              .get('view-mode.' + Object.keys(ViewMode)[Object.values(ViewMode).indexOf(this.viewMode)])
              .toPromise()
          },
          ticks: {
            beginAtZero: true
          }
        }]
      },
    };
  }
}

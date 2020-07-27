import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {StatReduced} from '../../models/stat';
import {Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {MatSelectChange} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {
  stats: Map<string, StatReduced[]>;
  topStats: Map<string, number> = new Map<string, number>();
  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [];
  initFinished = false;
  allRepos: string[] = [];
  selectedRepos: string[] = [];
  currentMode = 'count';
  bestReposN = 5;

  public chartOptions: ChartOptions;

  constructor(private httpService: HttpService, private snackBarController: MatSnackBar) {
  }

  ngOnInit(): void {

    this.httpService.findAllGrouped().subscribe(
      data => {
        console.log(data);
        this.stats = data;
        this.allRepos = Object.keys(this.stats).sort();

        for (const key of this.allRepos) {
          let cnt = 0;
          for (const statReduced of this.stats[key]) {
            cnt += statReduced.count;
          }
          this.topStats.set(key, cnt);
        }

        this.initChartOptions();
        this.filterBestN();

      },
      error => {
        console.error(error);
      }
    );
  }

  initChart(): void {
    let min = new Date().getTime();
    let max = 0;

    let dates = this.getDateListBetweenDates(new Date('2020-07-01'), new Date());
    this.chartLabels = dates;

    for (const key in this.stats) {
      const statArr: StatReduced[] = this.stats[key];
      for (const date of dates) {
        let temp = this.getCleanedISOString(new Date(date));
        if (!statArr.map(value => value.statDate).includes(temp)) {
          statArr.push({count: 0, statDate: temp, uniques: 0});
        }
      }
      this.stats[key] = statArr.sort((a, b) => new Date(a.statDate).getTime() - new Date(b.statDate).getTime());
    }

    for (const key of this.selectedRepos) {
      const temp = {
        label: key, data: [], lineTension: 0.2, fill: false
      };
      for (const statReduced of this.stats[key]) {

        temp.data.push({x: new Date(statReduced.statDate).toDateString(), y: statReduced[this.currentMode]});
        if (statReduced.statDate < min) {
          min = statReduced.statDate;
        } else if (statReduced.statDate > max) {
          max = statReduced.statDate;
        }
      }
      this.chartData.push(temp);
    }


    this.initFinished = true;
  }

  onSelectChanged(event: MatSelectChange): void {
    this.clearVariables();
    this.selectedRepos = event.value;
    this.initChart();
  }

  onCurrentModeChange(): void {
    this.clearVariables();
    this.initChartOptions();
    this.initChart();
  }

  onSelectAllClicked(): void {
    this.selectedRepos = this.allRepos;
    this.clearVariables();
    this.initChart();
  }

  onDeselectAllClicked(): void {
    this.selectedRepos = [];
    this.clearVariables();
    this.initChart();
  }

  clearVariables(): void {
    this.initFinished = false;
    this.chartData = [];
    this.chartLabels = [];
  }

  private initChartOptions(): void {
    this.chartOptions = {
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

  filterBestN(): void {
    this.clearVariables();
    this.topStats = new Map([...this.topStats.entries()].sort((pair1, pair2) => pair2[1] - pair1[1]));
    this.selectedRepos = Array.from({length: +this.bestReposN}, function() {
      return this.next().value;
    }, this.topStats.keys());

    this.initChart();
  }

  isValidBestReposN(): boolean {
    return !(!this.bestReposN || this.bestReposN < 1 || this.bestReposN > this.allRepos.length);
  }

  getDateListBetweenDates(minDate: Date, maxDate: Date): any {
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);

    const dateRanges: string[] = [];

    for (const currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
      dateRanges.push(currentDate.toString());
      // this.getCleanedISOString(currentDate));
    }

    return dateRanges;
  }

  getCleanedISOString(date: Date): string {
    const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(date.getTime() - tzoffset).toISOString();
    return localISOTime;
  }
}

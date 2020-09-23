import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DateSelection } from '../../../../models/date-selection';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_PICKER_CONFIG } from '../../../../globals';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-date-selection',
  templateUrl: './date-selection.component.html',
  styleUrls: ['./date-selection.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_CONFIG}
  ]
})
export class DateSelectionComponent implements OnInit {
  @Input() fromDate: Moment;
  @Input() toDate: Moment;
  @Output() change = new EventEmitter<DateSelection>();

  MIN_DATE: Moment = moment('2020-01-01');
  MAX_DATE: Moment = moment().subtract(1, 'day');

  constructor(
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<any>
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale(this.translateService.currentLang);
    this.translateService.onLangChange.subscribe(
      (val) => {
        this.dateAdapter.setLocale(val.lang);
      }, error => {
      });
  }

  onChange(): void {
    this.change.emit({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }
}

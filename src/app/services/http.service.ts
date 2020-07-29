import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Stat} from '../models/stat';
import {environment} from '../../environments/environment';
import {DATE_FORMAT} from '../components/chart/chart.component';
import * as moment from 'moment';
import {Moment} from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  findAllGrouped(fromDate?: Moment, toDate?: Moment): Observable<Map<string, Stat[]>> {
    fromDate = fromDate ? fromDate : moment().startOf('month');
    toDate = toDate ? toDate : moment().subtract(1, 'day');

    let queryParams = `fromDate=${fromDate.format(DATE_FORMAT)}&`;
    queryParams += `toDate=${toDate.format(DATE_FORMAT)}&`;

    console.log(fromDate.format(DATE_FORMAT));
    console.log(toDate.format(DATE_FORMAT));
    console.log(`${environment.API_URL}/allStatsGrouped?${queryParams}`);

    return this.http.get<Map<string, Stat[]>>(`${environment.API_URL}/allStatsGrouped?${queryParams}`);
  }
}

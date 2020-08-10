import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stat } from '../models/stat';
import { Moment } from 'moment';
import { API_URL, DATE_FORMAT } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  findAllGrouped(fromDate: Moment, toDate: Moment): Observable<Map<string, Stat[]>> {
    let queryParams = '';
    queryParams += fromDate ? `fromDate=${fromDate.format(DATE_FORMAT)}&` : '';
    queryParams += toDate ? `toDate=${toDate.format(DATE_FORMAT)}&` : '';
    return this.http.get<Map<string, Stat[]>>(`${API_URL}/allStatsGrouped?${queryParams}`);
  }
}

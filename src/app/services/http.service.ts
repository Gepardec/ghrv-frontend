import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StatReduced} from '../models/stat';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  findAllGrouped(): Observable<Map<string, StatReduced[]>> {
    console.log(environment.API_URL + '/allStatsGrouped');
    return this.http.get<Map<string, StatReduced[]>>(environment.API_URL + '/allStatsGrouped');
  }
}

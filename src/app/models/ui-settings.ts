import { ViewMode } from './view-mode';
import { Moment } from 'moment';

export interface UiSettings {
  viewMode: ViewMode;
  topNRepos: number;
  repositories: string[];
  fromDate: Moment;
  toDate: Moment;
}

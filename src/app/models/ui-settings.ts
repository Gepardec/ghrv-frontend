import {ViewMode} from './view-mode';

export interface UiSettings {
  viewMode: ViewMode;
  topNRepos: number;
  repositories: string[];
}

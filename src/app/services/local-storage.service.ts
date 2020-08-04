import {Injectable} from '@angular/core';
import {UiSettings} from '../models/ui-settings';
import {ViewMode} from '../models/view-mode';

const STORAGE_KEY = 'ui-settings';
const STORAGE_KEY_MODE = 'local_mode';
const STORAGE_KEY_SELECTED_REPOS = 'local_selected_repos';
const STORAGE_KEY_TOP_N_REPOS = 'local_top_n_repos';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public storeUiSettingsInLocalStorage(uiSettings: UiSettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uiSettings));
  }

  public readUiSettingsFromLocalStorage(): UiSettings {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.storeUiSettingsInLocalStorage({viewMode: ViewMode.TOTAL, topNRepos: 5, repositories: []});
    }
    const uiSettings: UiSettings = JSON.parse(localStorage.getItem(STORAGE_KEY));
    for (const key of Object.keys(ViewMode)) {
      if (uiSettings.viewMode.apiName === ViewMode[key].apiName) {
        uiSettings.viewMode = ViewMode[key];
      }
    }
    return uiSettings;
  }
}

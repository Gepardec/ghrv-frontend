import { Injectable } from '@angular/core';
import { UiSettings } from '../models/ui-settings';
import { ViewMode } from '../models/view-mode';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private static readonly STORAGE_KEY = 'UI_SETTINGS';

  constructor(private translateService: TranslateService) {
  }

  public removeUiSettings(): void {
    localStorage.removeItem(StorageService.STORAGE_KEY);
  }

  public storeUiSettings(uiSettings: UiSettings): void {
    uiSettings.language = this.translateService.currentLang ? this.translateService.currentLang : DEFAULT_LANG;
    localStorage.setItem(StorageService.STORAGE_KEY, JSON.stringify(uiSettings));
  }

  public readUiSettings(): UiSettings {
    if (!localStorage.getItem(StorageService.STORAGE_KEY)) {
      this.initLocalStorage();
    }
    const uiSettings: UiSettings = JSON.parse(localStorage.getItem(StorageService.STORAGE_KEY));
    for (const key of Object.keys(ViewMode)) {
      if (uiSettings.viewMode === ViewMode[key]) {
        uiSettings.viewMode = ViewMode[key];
      }
    }
    return uiSettings;
  }

  private initLocalStorage(): void {
    this.storeUiSettings({
      viewMode: ViewMode.TOTAL,
      bestCount: 5,
      language: DEFAULT_LANG
    });
  }
}

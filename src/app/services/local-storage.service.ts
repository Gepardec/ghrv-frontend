import {Inject, Injectable} from '@angular/core';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';

const STORAGE_KEY_MODE = 'local_mode';
const STORAGE_KEY_SELECTED_REPOS = 'local_selected_repos';
const STORAGE_KEY_TOP_N_REPOS = 'local_top_n_repos';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
  }

  public storeModeOnLocalStorage(mode: string): void {
    this.storage.set(STORAGE_KEY_MODE, mode);
  }

  public storeSelectedReposOnLocalStorage(selectedRepos: string[]): void {
    const currentSelectedRepos: string[] = [];
    for (const repo of selectedRepos) {
      currentSelectedRepos.push(repo);
    }
    this.storage.set(STORAGE_KEY_SELECTED_REPOS, currentSelectedRepos);
  }

  public storeTopNReposOnLocalStorage(topNRepos: number): void {
    this.storage.set(STORAGE_KEY_TOP_N_REPOS, topNRepos);
  }

  public readModeFromLocalStorage(): string {
    return this.storage.get(STORAGE_KEY_MODE);
  }

  public readSelectedReposFromLocalStorage(): string[] {
    return this.storage.get(STORAGE_KEY_SELECTED_REPOS);
  }

  public readTopNReposFromLocalStorage(): number {
    return this.storage.get(STORAGE_KEY_TOP_N_REPOS);
  }
}

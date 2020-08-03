import {Injectable} from '@angular/core';

const STORAGE_KEY_MODE = 'local_mode';
const STORAGE_KEY_SELECTED_REPOS = 'local_selected_repos';
const STORAGE_KEY_TOP_N_REPOS = 'local_top_n_repos';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public storeModeOnLocalStorage(mode: string): void {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  }

  public storeSelectedReposOnLocalStorage(selectedRepos: string[]): void {
    const currentSelectedRepos: string[] = [];
    for (const repo of selectedRepos) {
      currentSelectedRepos.push(repo);
    }
    localStorage.setItem(STORAGE_KEY_SELECTED_REPOS, JSON.stringify(currentSelectedRepos));
  }

  public storeTopNReposOnLocalStorage(topNRepos: number): void {
    localStorage.setItem(STORAGE_KEY_TOP_N_REPOS, topNRepos.toString());
  }

  public readModeFromLocalStorage(): string {
    return localStorage.getItem(STORAGE_KEY_MODE);
  }

  public readSelectedReposFromLocalStorage(): string[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_SELECTED_REPOS));
  }

  public readTopNReposFromLocalStorage(): number {
    return +localStorage.getItem(STORAGE_KEY_TOP_N_REPOS);
  }
}

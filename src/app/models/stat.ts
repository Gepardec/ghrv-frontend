export interface Stat {
  id: string;
  count: number;
  uniques: number;
  repoName: number;
  statDate: string;
}

export interface StatReduced {
  count: number;
  uniques: number;
  statDate: string;
}

export class ViewMode {
  public static readonly TOTAL = new ViewMode('totalViews', 'Total views');
  public static readonly UNIQUE = new ViewMode('uniqueViews', 'Unique views');

  public readonly apiName: string;
  public readonly displayName: string;

  private constructor(apiName: string, displayName: string) {
    this.apiName = apiName;
    this.displayName = displayName;
  }
}

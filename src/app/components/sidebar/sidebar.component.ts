import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewMode } from '../../models/view-mode';
import { DateSelection } from '../../models/date-selection';
import { Moment } from 'moment';
import { Stat } from '../../models/stat';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() stats: Map<string, Stat[]>;
  @Input() allRepos: string[];
  @Input() selectedRepos: string[];
  @Input() viewMode: ViewMode;
  @Input() toDate: Moment;
  @Input() fromDate: Moment;
  @Input() bestCount: number;

  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() dateSelectionChange = new EventEmitter<DateSelection>();
  @Output() repoSelectionChange = new EventEmitter<string[]>();
  @Output() bestCountChange = new EventEmitter<number>();
  @Output() restoreDefaultChange = new EventEmitter();

  constructor() {
  }

  onViewModeChange(viewMode: ViewMode): void {
    this.viewModeChange.emit(viewMode);
  }

  onRepoSelectionChange(selectedRepos: string[]): void {
    this.repoSelectionChange.emit(selectedRepos);
  }

  onBestReposChange(bestCount: number): void {
    this.bestCountChange.emit(bestCount);
  }

  onDateSelectionChange(dateSelection: DateSelection): void {
    this.dateSelectionChange.emit(dateSelection);
  }

  onRestoreDefaultChange(): void {
    this.restoreDefaultChange.emit();
  }
}

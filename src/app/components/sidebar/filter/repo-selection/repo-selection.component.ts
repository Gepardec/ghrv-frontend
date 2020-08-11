import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-repo-selection',
  templateUrl: './repo-selection.component.html',
  styleUrls: ['./repo-selection.component.css']
})
export class RepoSelectionComponent {
  @Input() allRepos: string[];
  @Input() selectedRepos: string[];
  @Output() change = new EventEmitter<string[]>();

  onChange(repos: string[]): void {
    this.selectedRepos = repos;
    this.change.emit(this.selectedRepos);
  }
}

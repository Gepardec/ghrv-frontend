import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-repo-selection',
  templateUrl: './repo-selection.component.html',
  styleUrls: ['./repo-selection.component.css']
})
export class RepoSelectionComponent implements OnInit {
  @ViewChild('select') select: MatSelect;
  @Input() allRepos: string[];
  @Input() selectedRepos: string[];
  @Output() change = new EventEmitter<string[]>();
  filteredRepos: string[];

  ngOnInit(): void {
    this.filteredRepos = this.allRepos;
  }

  onSearch(searchString: string): void {
    if (!searchString) {
      this.filteredRepos = this.allRepos;
      return;
    }
    this.filteredRepos = this.allRepos.filter(repo => repo.toLowerCase().includes(searchString.toLowerCase().trim()));
  }

  onSelectionChange(values: string[]): void {
    this.change.emit(values);
  }

  selection(type: 'selectAll' | 'deselectAll'): void {
    this.select.options.forEach(option => {
      if (option.value) {
        switch (type) {
          case 'selectAll':
            option.select();
            break;
          case 'deselectAll':
            option.deselect();
            break;
        }
      }
    });
    this.change.emit(this.selectedRepos);
  }
}

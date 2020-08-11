import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-best-repos',
  templateUrl: './best-repos.component.html',
  styleUrls: ['./best-repos.component.css']
})
export class BestReposComponent {
  @Input() bestCount: number;
  @Output() change = new EventEmitter<number>();

  onChange(): void {
    this.change.emit(this.bestCount);
  }
}

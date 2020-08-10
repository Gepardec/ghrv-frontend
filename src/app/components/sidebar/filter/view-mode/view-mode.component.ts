import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewMode } from '../../../../models/view-mode';

@Component({
  selector: 'app-view-mode',
  templateUrl: './view-mode.component.html',
  styleUrls: ['./view-mode.component.css']
})
export class ViewModeComponent {
  @Input() viewMode: ViewMode;
  @Output() change = new EventEmitter<ViewMode>();

  viewModeReference = ViewMode;
  viewModeKeys: string[] = Object.keys(this.viewModeReference);

  onChange(): void {
    this.change.emit(this.viewMode);
  }
}

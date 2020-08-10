import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartSidebarCommunicationService {

  sidebarInitialized = new EventEmitter<boolean>();

  constructor() {
  }
}

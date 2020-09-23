import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../services/storage.service';
import { LANGS } from '../../../globals';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  constructor(
    public translateService: TranslateService,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.translateService.addLangs(LANGS);
    this.translateService.use(this.storageService.readUiSettings().language);
  }

}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ChampionModel } from '../model'
import { DataService } from '../data.service'

@Component({
  selector: 'app-champions',
  templateUrl: './champions.component.html',
  styleUrls: ['./champions.component.less']
})
export class ChampionsComponent implements OnInit {

  @Output() selectChampion = new EventEmitter<ChampionModel>();

  champions: ChampionModel[] = []

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getChampions()
  }

  getChampions(): void {
    this.champions = this.dataService.getChampions()
  }

  onSelectChampion(champion: ChampionModel): void {
    this.selectChampion.emit(champion)
  }
}

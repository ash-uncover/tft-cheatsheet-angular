import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import {
  TraitCategoryModel,
  ChampionModel,
} from '../model'
import { DataService } from '../data.service'

@Component({
  selector: 'app-champions',
  templateUrl: './champions.component.html',
  styleUrls: ['./champions.component.less']
})
export class ChampionsComponent implements OnInit {

  @Output() selectChampion = new EventEmitter<ChampionModel>();

  categories: TraitCategoryModel[] = []
  champions: ChampionModel[] = []

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getCategories()
    this.getChampions()
  }

  getCategories(): void {
    this.categories = this.dataService.getCategories()
  }

  getChampions(): void {
    this.champions = this.dataService.getChampions()
  }

  onSelectChampion(champion: ChampionModel): void {
    this.selectChampion.emit(champion)
  }
}

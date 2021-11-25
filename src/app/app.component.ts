import { Component } from '@angular/core';

import { ComponentModel, ItemModel, ChampionModel } from './model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'tft-cheatsheet-angular'

  selectedComponents: ComponentModel[] = []
  selectedItems: ItemModel[] = []
  selectedChampions: ChampionModel[] = []

  constructor() { }

  ngOnInit(): void {
  }

  onComponentSelected(component: ComponentModel): void {
    this.selectedComponents.push(component)
  }

  onComponentRemoved(component: ComponentModel): void {
    const indexComponent = this.selectedComponents.indexOf(component)
    this.selectedComponents.splice(indexComponent, 1)
  }

  onItemSelected(item: ItemModel): void {
    this.selectedItems.push(item)
  }

  onItemRemoved(item: ItemModel): void {
    const indexItem = this.selectedItems.indexOf(item)
    this.selectedItems.splice(indexItem, 1)
  }

  onChampionSelected(champion: ChampionModel): void {
    this.selectedChampions.push(champion)
  }

  onChampionRemoved(champion: ChampionModel): void {
    const indexChampion = this.selectedChampions.indexOf(champion)
    this.selectedChampions.splice(indexChampion, 1)
  }
}

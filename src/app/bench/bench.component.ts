import { Component, OnInit, DoCheck, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

import { ItemBaseModel, ItemModel, ComponentModel } from '../model'

import { DataService } from '../services/data.service'
import { LolchessService } from '../services/lolchess.service'

@Component({
  selector: 'app-bench',
  templateUrl: './bench.component.html',
  styleUrls: ['./bench.component.less']
})
export class BenchComponent implements OnInit, DoCheck {

  @Input() components?: ComponentModel[];
  @Input() items?: ItemModel[];

  @Output() removeComponent = new EventEmitter<ComponentModel>();
  @Output() removeItem = new EventEmitter<ItemModel>();

  previousComponentsLength: number = -1
  itemsProposal: ItemBaseModel[][] = []
  itemsData: ItemModel[] = []

  constructor(private dataService: DataService, private lolchessService: LolchessService) {}

  ngOnInit(): void {
    this.getItemsData()
    this.getItemsTrend()
  }

  ngDoCheck(): void {
    if (this.components && this.components.length !== this.previousComponentsLength) {
      this.previousComponentsLength = this.components ? this.components.length : -1
      this.itemsProposal = this.dataService.findPossibleItems(this.components)
    } else if (!this.components && this.previousComponentsLength !== -1) {
      this.previousComponentsLength === -1
      this.itemsProposal = []
    }
  }

  onRemoveComponent(component: ComponentModel): void {
    this.removeComponent.emit(component)
  }

  onRemoveItem(item: ItemModel): void {
    this.removeItem.emit(item)
  }

  getItemsData(): void {
    this.itemsData = this.dataService.getItems()
  }

  getItemsTrend(): void {
    this.lolchessService.getItemsTrend()
  }
}

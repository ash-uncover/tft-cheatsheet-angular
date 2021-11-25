import { Component, OnInit, EventEmitter, Output } from '@angular/core'

import { ItemModel, ComponentModel } from '../model'
import { DataService } from '../data.service'

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.less']
})
export class ItemsComponent implements OnInit {

  @Output() selectComponent = new EventEmitter<ComponentModel>();
  @Output() selectItem = new EventEmitter<ItemModel>();

  components: ComponentModel[] = []

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getComponents()
  }

  getComponents(): void {
    this.components = this.dataService.getComponents()
  }

  onSelectComponent(component: ComponentModel): void {
    this.selectComponent.emit(component)
  }

  onSelectItem(item: ItemModel): void {
    this.selectItem.emit(item)
  }
}

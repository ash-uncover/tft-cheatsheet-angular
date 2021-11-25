import { Injectable } from '@angular/core';

import { ItemData, ItemModel, ComponentModel, ChampionData, ChampionModel } from './model';

import DataJson from '../assets/json/data.json';

const COMPONENTS_ID = [1, 2, 5, 6, 3, 4, 7, 9, 8];
const ITEMS_ID = [
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 23, 24, 25, 26, 27, 28, 29,
  31, 32, 33, 34, 35, 36, 37, 38, 39,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 52, 53, 54, 55, 56, 57, 58, 59,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 72, 73, 74, 75, 76, 77, 78, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
  2190
];

const ITEMS: ItemData[] = Object.values(DataJson.items.reduce<any>((acc, item) => {
  if (COMPONENTS_ID.indexOf(item.id) !== -1 || ITEMS_ID.indexOf(item.id) !== -1) {
    const entry = `item${item.id}`;
    acc[entry] = item;
  }
  return acc;
}, {}));

const CHAMPIONS: ChampionData[] = DataJson.sets['6'].champions

const IMAGE_URL = 'https://raw.communitydragon.org/11.23/game/';

const comparatorComponents = function (component1: ComponentModel, component2: ComponentModel) {
  return COMPONENTS_ID.indexOf(component1.id) - COMPONENTS_ID.indexOf(component2.id)
}

const comparatorItems = function (item1: ItemModel, item2: ItemModel) {
  return ITEMS_ID.indexOf(item1.id) - ITEMS_ID.indexOf(item2.id)
}

const memoizationGetItemsByComponent: any = {}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  champions: ChampionModel[];
  items: ItemModel[];
  components: ComponentModel[];

  constructor() {
    this.components = ITEMS
      .filter((item: ItemData) => COMPONENTS_ID.indexOf(item.id) !== -1)
      .map((item: ItemData): ComponentModel => ({
        id: item.id,
        name: item.name,
        desc: item.desc,
        icon: `${IMAGE_URL}${item.icon}`.replace('.dds', '.png').toLowerCase(),
        items: [] as ItemModel[],
        unique: item.unique
      }))
      .sort(comparatorComponents);

    this.items = ITEMS
      .filter((item: ItemData) => ITEMS_ID.indexOf(item.id) !== -1)
      .map((item: ItemData): ItemModel => {
        const result = {
          id: item.id,
          name: item.name,
          desc: item.desc,
          icon: `${IMAGE_URL}${item.icon}`.replace('.dds', '.png').toLowerCase(),
          components: [] as ComponentModel[],
          unique: item.unique
        };
        item.from.forEach((id: number) => {
          const component = this.getComponent(id)!;
          if (!component.items.some((i: ItemModel) => i.id === result.id)) {
            component.items.push(result);
          }
          result.components.push(component);
        });
        return result;
      })
      .sort((item1: ItemModel, item2: ItemModel) => item1.id - item2.id);

    this.components.forEach((component) => {
      component.items.sort((item1: ItemModel, item2: ItemModel) => {
        const comp1 = item1.components.find(comp => comp.id !== component.id) || component;
        const comp2 = item2.components.find(comp => comp.id !== component.id) || component;
        return comparatorComponents(comp1, comp2);
      })
    })

    this.champions = CHAMPIONS.map(champion => {
      return {
        id: champion.apiName,
        name: champion.name,
        icon: `${IMAGE_URL}${champion.icon}`.replace('.dds', '.png').toLowerCase(),
        cost: champion.cost,
        traits: champion.traits
      }
    }).sort((champ1, champ2) => champ1.name.localeCompare(champ2.name))
  }

  getComponents(): ComponentModel[] {
    return this.components;
  }
  getComponent(id: number): ComponentModel | undefined {
    return this.components.find((component: ComponentModel) => component.id === id);
  }

  getItems(): ItemModel[] {
    return this.items;
  }
  getItem(id: number): ItemModel | undefined {
    return this.items.find((item: ItemModel) => item.id === id);
  }
  getItemByComponents(component1: ComponentModel, component2: ComponentModel): ItemModel {
    if (memoizationGetItemsByComponent[`${component1.id}-${component2.id}`]) {
      return memoizationGetItemsByComponent[`${component1.id}-${component2.id}`]
    }
    if (component1 === component2) {
      const result = this.items.find(
        (item: ItemModel) => item.components.every(
          (component: ComponentModel) => component === component1
        )
      )
      memoizationGetItemsByComponent[`${component1.id}-${component2.id}`] = result
      return result!
    } else {
      const result = this.items.find(
        (item: ItemModel) => (item.components[0] === component1 && item.components[1] === component2) || (item.components[0] === component2 && item.components[1] === component1)
      )
      memoizationGetItemsByComponent[`${component1.id}-${component2.id}`] = result
      memoizationGetItemsByComponent[`${component2.id}-${component1.id}`] = result
      return result!
    }
  }

  findPossibleItems(components: ComponentModel[]): ItemModel[][] {
    if (components.length < 2) {
      return []
    } else if (components.length === 2) {
      const comp1 = components[0]
      const comp2 = components[1]
      const item = this.getItemByComponents(comp1, comp2)
      return [[item]]
    }
    const all: ItemModel[][] = []
    for (let i = 0; i < components.length; i++) {
      for (let j = 0; j < i; j++) {
        const comp1 = components[i]
        const comp2 = components[j]
        const currentItem = this.getItemByComponents(comp1, comp2)
        const newComponents = components.slice()
        newComponents.splice(i, 1)
        newComponents.splice(j, 1)
        const childResults = this.findPossibleItems(newComponents)
        if (childResults.length) {
          childResults.forEach(entry => all.push([currentItem].concat(entry)))
        } else {
          all.push([currentItem])
        }
      }
    }
    const result: ItemModel[][] = []
    all.forEach(combination => {
      const dupplicate = result.some(res => this.compareItems(res, combination))
      if (!dupplicate) {
        result.push(combination)
      }
    })
    return result
  }

  compareItems(items1: ItemModel[], items2: ItemModel[]): boolean {
    if (items1.length !== items2.length) {
      return false
    }
    const remainingChecks = items2.slice()
    return !items1.some((item) => {
      const index = remainingChecks.indexOf(item);
      if (index !== -1) {
        remainingChecks.splice(index, 1)
        return false
      }
      return true
    })
  }

  getChampions(): ChampionModel[] {
    return this.champions;
  }
}

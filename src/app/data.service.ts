import { Injectable } from '@angular/core';

import {
  ItemData,
  ItemModel,
  ComponentModel,
  TraitData,
  TraitCategoryModel,
  TraitModel,
  ChampionData,
  ChampionModel,
} from './model';

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
const TRAIT_ORIGINS = [
  'Academy',
  'Chemtech',
  'Clockwork',
  'Cuddly',
  'Enforcer',
  'Glutton',
  'Imperial',
  'Mercenary',
  'Mutant',
  'Scrap',
  'Sister',
  'Socialite',
  'Syndicate',
  'Yordle',
];

const ITEMS: ItemData[] = Object.values(DataJson.items.reduce<any>((acc, item) => {
  if (COMPONENTS_ID.indexOf(item.id) !== -1 || ITEMS_ID.indexOf(item.id) !== -1) {
    const entry = `item${item.id}`;
    acc[entry] = item;
  }
  return acc;
}, {}));

const TRAITS: TraitData[] = DataJson.sets['6'].traits
const CHAMPIONS: ChampionData[] = DataJson.sets['6'].champions

const ITEM_IMAGE_URL = 'https://raw.communitydragon.org/11.23/game/';
const CHAMPION_IMAGE_URL_2 = 'https://raw.communitydragon.org/11.23/game/assets/characters/';
const CHAMPION_IMAGE_URL = 'https://ddragon.leagueoflegends.com/cdn/11.23.1/img/champion/';

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

  traits: TraitModel[]
  categories: TraitCategoryModel[]
  champions: ChampionModel[]
  items: ItemModel[]
  components: ComponentModel[]

  constructor() {
    this.components = ITEMS
      .filter((item: ItemData) => COMPONENTS_ID.indexOf(item.id) !== -1)
      .map((item: ItemData): ComponentModel => ({
        id: item.id,
        name: item.name,
        desc: item.desc,
        icon: `${ITEM_IMAGE_URL}${item.icon}`.replace('.dds', '.png').toLowerCase(),
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
          icon: `${ITEM_IMAGE_URL}${item.icon}`.replace('.dds', '.png').toLowerCase(),
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

    const categoryOrigin = {
      id: 'origin',
      name: 'Origin',
      traits: [] as TraitModel[],
    }
    const categoryClass = {
      id: 'class',
      name: 'Class',
      traits: [] as TraitModel[],
    }
    this.categories = [categoryClass, categoryOrigin ]

    this.traits = TRAITS.map(trait => {
      const model = {
        id: trait.apiName,
        name: trait.name,
        icon: `${ITEM_IMAGE_URL}${trait.icon}`.replace('.dds', '.png').toLowerCase(),
        category: TRAIT_ORIGINS.indexOf(trait.name) === -1 ? categoryClass : categoryOrigin,
        champions: [] as ChampionModel[],
      }
      if (model.category === categoryOrigin) {
        categoryOrigin.traits.push(model)
      } else {
        categoryClass.traits.push(model)
      }
      return model
    })

    this.champions = CHAMPIONS.map(champion => {
      const championIconUrl = champion.ability.icon.split('/')
      const championIconName = championIconUrl[2].replace('TFT6_', '')
      const championIcon2 = `${CHAMPION_IMAGE_URL_2}${championIconName}/hud/${championIconName}_square.png`
      const championModel = {
        id: champion.apiName,
        name: champion.name,
        icon: `${CHAMPION_IMAGE_URL}${championIconName}.png`,
        cost: champion.cost,
        traits: [] as TraitModel[]
      }
      const championTraits = champion.traits.map((traitName) => {
        const championTrait = this.traits.find(trait => trait.name === traitName)!
        championTrait.champions.push(championModel)
        return championTrait
      })
      championModel.traits = championTraits

      return championModel
    }).sort((champ1, champ2) => champ1.name.localeCompare(champ2.name))
  }

  getCategories(): TraitCategoryModel[] {
    return this.categories;
  }

  getTraits(): TraitModel[] {
    return this.traits;
  }

  getChampions(): ChampionModel[] {
    return this.champions;
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
}

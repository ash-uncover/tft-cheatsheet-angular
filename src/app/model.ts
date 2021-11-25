export interface ItemBaseModel {
  id: number,
  name: string,
  desc: string,
  icon: string,
  unique: boolean,
}

export interface ItemData extends ItemBaseModel {
  from: number[],
}

export interface ItemModel extends ItemBaseModel {
  components: ComponentModel[],
}

export interface ComponentModel extends ItemBaseModel {
  items: ItemModel[],
}

export interface TraitData {
  apiName: string,
  icon: string,
  name: string,
}

export interface TraitCategoryModel {
  id: string,
  name: string,
  traits: TraitModel[],
}

export interface TraitModel {
  id: string,
  category: TraitCategoryModel,
  icon: string,
  name: string,
  champions: ChampionModel[],
}

export interface ChampionData {
  apiName: string,
  ability: {
    icon: string
  },
  name: string,
  icon: string,
  cost: number,
  traits: string[],
}

export interface ChampionModel {
  id: string,
  name: string,
  icon: string,
  cost: number,
  traits: TraitModel[],
}
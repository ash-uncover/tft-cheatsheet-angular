export interface ItemBaseModel {
  id: number,
  name: string,
  desc: string,
  icon: string,
  unique: boolean
}

export interface ItemData extends ItemBaseModel {
  from: number[]
}

export interface ItemModel extends ItemBaseModel {
  components: ComponentModel[]
}

export interface ComponentModel extends ItemBaseModel {
  items: ItemModel[]
}

export interface ChampionData {
  apiName: string,
  name: string,
  icon: string,
  cost: number,
  traits: string[]
}

export interface ChampionModel {
  id: string,
  name: string,
  icon: string,
  cost: number,
  traits: string[]
}
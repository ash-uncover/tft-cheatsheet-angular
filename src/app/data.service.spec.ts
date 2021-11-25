import { TestBed } from '@angular/core/testing'

import { DataService } from './data.service'

import { ItemModel, ComponentModel } from './model';

describe('DataService', () => {
  let service: DataService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(DataService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getComponents', () => {
    it('should return the list of components', () => {
      const components = service.getComponents()
      expect(components.length).toBe(9)
    })
  })

  describe('getComponent', () => {
    it('when called with a valid id', () => {
      const component = service.getComponent(8)
      expect(component).toBeTruthy()
      expect(component!.name).toBe('Spatula')
    })
    it('when called with a invalid id', () => {
      const component = service.getComponent(100)
      expect(component).toBeUndefined()
    })
  })

  describe('getItems', () => {
    it('should return the list of items', () => {
      const items = service.getItems()
      expect(items).toBeTruthy()
    })
  })

  describe('getItem', () => {
    it('when called with a valid id', () => {
      const item = service.getItem(22)
      expect(item).toBeTruthy()
      expect(item!.name).toBe('Rapid Firecannon')
    })
    it('when called with a invalid id', () => {
      const item = service.getItem(500)
      expect(item).toBeUndefined()
    })
  })

  describe('getItemByComponents', () => {
    it('when called with the same component', () => {
      const comp1 = service.getComponent(8)
      const item = service.getItemByComponents(comp1!, comp1!)
      expect(item).toBeTruthy()
      expect(item!.name).toBe('Tactician\'s Crown')
    })
    it('when called with two different components', () => {
      const comp1 = service.getComponent(1)
      const comp2 = service.getComponent(8)
      const item = service.getItemByComponents(comp1!, comp2!)
      expect(item).toBeTruthy()
      expect(item!.name).toBe('Imperial Emblem')
    })
  })

  describe('findPossibleItems', () => {
    it('when there is only one component', () => {
      const comp1 = service.getComponent(1)
      const result = service.findPossibleItems([comp1!])
      expect(result.length).toEqual(0)
    })
    it('when there are two components', () => {
      const comp1 = service.getComponent(8)
      const result = service.findPossibleItems([comp1!, comp1!])
      expect(result.length).toEqual(1)
      expect(result[0].length).toEqual(1)
    })
    it('when there are three different components', () => {
      const comp1 = service.getComponent(1)
      const comp2 = service.getComponent(2)
      const comp3 = service.getComponent(8)
      const result = service.findPossibleItems([comp1!, comp2!, comp3!])
      expect(result.length).toEqual(3)
      expect(result[0].length).toEqual(1)
      expect(result[1].length).toEqual(1)
      expect(result[2].length).toEqual(1)
    })
    it('when there are three times the same component', () => {
      const comp1 = service.getComponent(1)
      const result = service.findPossibleItems([comp1!, comp1!, comp1!])
      expect(result.length).toEqual(1)
      expect(result[0].length).toEqual(1)
    })
    it('when there are four different components', () => {
      const comp1 = service.getComponent(1)
      const comp2 = service.getComponent(2)
      const comp3 = service.getComponent(8)
      const comp4 = service.getComponent(3)
      const result = service.findPossibleItems([comp1!, comp2!, comp3!, comp4!])
      expect(result.length).toEqual(3)
      expect(result[0].length).toEqual(2)
      expect(result[1].length).toEqual(2)
      expect(result[2].length).toEqual(2)
    })
  })

  describe('compareItems', () => {
    it('when the arrays do not have the same size', () => {
      const item = service.getItem(21)!
      const result = service.compareItems([item], [])
      expect(result).toBeFalse()
    })
    it('when the arrays contains the same items in the same order', () => {
      const item1 = service.getItem(21)!
      const item2 = service.getItem(22)!
      const result = service.compareItems([item1, item2], [item1, item2])
      expect(result).toBeTrue()
    })
    it('when the arrays contains the same items in the different order', () => {
      const item1 = service.getItem(21)!
      const item2 = service.getItem(22)!
      const item3 = service.getItem(23)!
      const result = service.compareItems([item1, item2, item3], [item2, item3, item1])
      expect(result).toBeTrue()
    })
    it('when the arrays contains the different items', () => {
      const item1 = service.getItem(21)!
      const item2 = service.getItem(22)!
      const item3 = service.getItem(23)!
      const item4 = service.getItem(24)!
      const result = service.compareItems([item1, item2, item3], [item4, item3, item1])
      expect(result).toBeFalse()
    })
    it('when the arrays contains the same items with the some dupplicated items', () => {
      const item1 = service.getItem(21)!
      const item2 = service.getItem(22)!
      const item3 = service.getItem(23)!
      const result = service.compareItems([item1, item2, item3, item1], [item1, item3, item1, item2])
      expect(result).toBeTrue()
    })
  })
})

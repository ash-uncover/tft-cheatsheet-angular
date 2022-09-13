import { TestBed } from '@angular/core/testing'

import { LolchessService } from './lolchess.service'

describe('LolchessService', () => {
  let service: LolchessService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LolchessService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  });
});

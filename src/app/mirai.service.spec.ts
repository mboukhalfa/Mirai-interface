import { TestBed } from '@angular/core/testing';

import { MiraiService } from './mirai.service';

describe('MiraiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiraiService = TestBed.get(MiraiService);
    expect(service).toBeTruthy();
  });
});

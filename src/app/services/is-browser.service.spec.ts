import { TestBed } from '@angular/core/testing';

import { IsBrowserService } from './is-browser.service';

describe('IsBrowserService', () => {
  let service: IsBrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsBrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

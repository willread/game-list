import { FilterGamesPipe } from './pipes/filter-games.pipe';

describe('FilterGamesPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterGamesPipe();
    expect(pipe).toBeTruthy();
  });
});

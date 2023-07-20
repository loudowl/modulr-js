/**
 * @jest-environment jsdom
 */

import { randomCat } from './randomCat';

describe('randomCat', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({ url: 'https://placekitten.com' }) as jest.Mock;

    global.fetch = fetchMock;
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('should load a cat', async () => {
    const cat = await randomCat.loadACat();
    expect(cat).toBeDefined();
    expect(cat.url).toContain('https://placekitten.com');
  });
});

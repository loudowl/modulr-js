import { randomCat } from './util/randomCat';

console.log(
  'load randomCat from /util/randomCat.js in src/app/main js',
  randomCat,
);

console.log('Now load an async function from the helper', randomCat.loadACat());

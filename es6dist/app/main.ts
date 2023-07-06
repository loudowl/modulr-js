import { randomCat } from './util/randomCat.ts';
import { bigConsole } from './util/bigConsole.js';

console.log(
  'load randomCat from /util/randomCat.js in src/app/main js',
  randomCat,
);

console.log('Now load an async function from the helper', randomCat.loadACat());

bigConsole('we are now transpiling es6 js and es6 TS!!!');

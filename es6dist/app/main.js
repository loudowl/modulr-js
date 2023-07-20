"use strict";

var _randomCat = require("./util/randomCat");
console.log('load randomCat from /util/randomCat.js in src/app/main js', _randomCat.randomCat);
console.log('Now load an async function from the helper', _randomCat.randomCat.loadACat());
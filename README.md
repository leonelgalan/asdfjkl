# asdfjkl

[![Build Status](https://travis-ci.org/leonelgalan/asdfjkl.svg)](https://travis-ci.org/leonelgalan/asdfjkl)
[![npm Version](https://badge.fury.io/js/asdfjkl.svg)](http://badge.fury.io/js/asdfjkl)

Determines if text contains gibberish. Based on Rob Neuhaus's [Gibberish-Detector](https://github.com/rrenaud/Gibberish-Detector) (Python), inspired in the [PHP](https://github.com/buggedcom/Gibberish-Detector-PHP) and [Ruby](https://github.com/mchitten/gibberish_detector) ports.

## How it works

The build-in model is built by feeding "The Adventures of Sherlock Holmes" (_data/big.txt_) into the cli: `asdfjkl --train`. The resulting model stores the probability of transitioning from each character to other character. This is later used to determine if the text being tested has similar transitions or not. A better explanation can be found in the original author's [README - Hot it works](https://github.com/rrenaud/Gibberish-Detector#how-it-works)

## Usage

```js
import asdfjkl from 'asdfjkl';

asdfjkl('asdfjkl');
// true
asdfjkl('Hello World!');
// false
```

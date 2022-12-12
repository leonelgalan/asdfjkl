#!/usr/bin/env node

import asdfjkl, { train } from './asdfjkl'
import program from 'commander'
import pjson from '../package.json'

program
  .version(pjson.version)
  .option('-T, --train [fileName]', 'Train the model with your own file')
  .option('-t, --try <text>', 'Text to try Asdfjkl')

program.parse(process.argv)
const options = program.opts()

if (!options.train && !options.try) program.help()

if (options.train) {
  const flagOrFileName = options.train
  flagOrFileName === true ? train() : train(flagOrFileName)
}

if (options.try) {
  const text = options.try
  const result = asdfjkl(text)
  console.log(`Result for "${text}": ${result}`)
}

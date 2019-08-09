#!/usr/bin/env node

import asdfjkl, { train } from './asdfjkl'
import program from 'commander'
import pjson from '../package.json'

program
  .version(pjson.version)
  .option('-T, --train [fileName]', 'Train the model with your own file')
  .option('-t, --try <text>', 'Text to try Asdfjkl')
  .parse(process.argv)

if (!program.train && !program.try) program.help()

if (program.train) {
  const flagOrFileName = program.train
  flagOrFileName === true ? train() : train(flagOrFileName)
}

if (program.try) {
  const text = program.try
  const result = asdfjkl(text)
  console.log(`Result for "${text}": ${result}`)
}

import _ from 'lodash'
import fs from 'fs'
import modelData from './model.json'

const encoding = 'utf8'
const defaultTrainingFileName = './data/big.txt'
const modelFileName = './lib/model.json'
const acceptedChars = 'abcdefghijklmnopqrstuvwxyz '
const pos = _.fromPairs(acceptedChars.split('').map((char, i) => [char, i]))

const normalize = (line) => {
  let lowerCaseChars = _.map(line.split(''), _.toLower)
  return _.filter(lowerCaseChars, (char) => _.includes(acceptedChars, char))
}

const ngram = (n, line, iteratee) => {
  let filtered = normalize(line)
  for (let start = 0; start <= filtered.length - n; start++) {
    iteratee(...filtered.slice(start, start + n))
  }
}

const readLines = (fileName) => {
  return _.compact(fs.readFileSync(fileName, encoding).split('\n'))
}

export function averageTransitionProbability (line, probabilityMatrix) {
  let logaritmicProbability = 0
  let transitionCount = 0
  ngram(2, line, (a, b) => {
    logaritmicProbability += probabilityMatrix[pos[a]][pos[b]]
    transitionCount += 1
  })
  return Math.exp(logaritmicProbability / (transitionCount || 1))
}

export function train (trainingFileName = defaultTrainingFileName) {
  let k = acceptedChars.length
  let matrix = [...Array(k)].map(() => [...Array(k)].map(() => 10))

  let lines = readLines(trainingFileName)
  lines.forEach((line) => {
    ngram(2, line, (a, b) => { matrix[pos[a]][pos[b]] += 1 })
  })

  matrix.forEach((row, i) => {
    let rowSum = _.sum(row)
    _.range(row.length).forEach((j) => {
      matrix[i][j] = Math.log(row[j] / rowSum)
    })
  })

  let good = _.map(readLines('./data/good.txt'), (line) => averageTransitionProbability(line, matrix))
  let bad = _.map(readLines('./data/bad.txt'), (line) => averageTransitionProbability(line, matrix))

  console.assert(_.min(good) > _.max(bad), 'Good Model')

  let threshold = (_.min(good) + _.max(bad)) / 2

  let content = JSON.stringify({ matrix, threshold })
  fs.writeFileSync(modelFileName, content, encoding)
}

export default function (text) {
  return averageTransitionProbability(text, modelData.matrix) <= modelData.threshold
}

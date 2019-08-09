import _ from 'lodash'
import fs from 'fs'
import modelData from './model.json'

const encoding = 'utf8'
const defaultTrainingFileName = './data/big.txt'
const modelFileName = './lib/model.json'
const acceptedChars = 'abcdefghijklmnopqrstuvwxyz '
const pos = _.fromPairs(acceptedChars.split('').map((char, i) => [char, i]))

const normalize = (line) => {
  const lowerCaseChars = _.map(line.split(''), _.toLower)
  return _.filter(lowerCaseChars, (char) => _.includes(acceptedChars, char))
}

const ngram = (n, line, iteratee) => {
  const filtered = normalize(line)
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
  const k = acceptedChars.length
  const matrix = [...Array(k)].map(() => [...Array(k)].map(() => 10))

  const lines = readLines(trainingFileName)
  lines.forEach((line) => {
    ngram(2, line, (a, b) => { matrix[pos[a]][pos[b]] += 1 })
  })

  matrix.forEach((row, i) => {
    const rowSum = _.sum(row)
    _.range(row.length).forEach((j) => {
      matrix[i][j] = Math.log(row[j] / rowSum)
    })
  })

  const good = _.map(readLines('./data/good.txt'), (line) => averageTransitionProbability(line, matrix))
  const bad = _.map(readLines('./data/bad.txt'), (line) => averageTransitionProbability(line, matrix))

  console.assert(_.min(good) > _.max(bad), 'Good Model')

  const threshold = (_.min(good) + _.max(bad)) / 2

  const content = JSON.stringify({ matrix, threshold })
  fs.writeFileSync(modelFileName, content, encoding)
}

export default function (text) {
  return averageTransitionProbability(text, modelData.matrix) <= modelData.threshold
}

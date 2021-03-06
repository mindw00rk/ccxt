"use strict";

const fs = require ('fs')
const ccxt = require ('./ccxt')
const log  = require ('ololog')
const ansi = require ('ansicolor').nice

//-----------------------------------------------------------------------------

let readmeRst = 'README.rst'

log.bright.cyan ('Updating badges →', readmeRst.yellow)

let rst = fs.readFileSync (readmeRst, 'utf8')
let rstNew =
    rst.replace (/\`([^\`]+)\s\<\#[^\`]+\>\`\_\_/g, '$1') // PyPI doesn't like urls containing anchor hash symbol '#', strip it off to plain text
        .replace (/\\\|/g, '|') // PyPI doesn't like escaped vertical bars
        // .replace (/\|\\(\_[^\|]+)\|([\ ]+)\|/g, '|$1| $2|')
        // .replace (/\|\\(\_[^\|]+)\|/g, '|$1|')

let rstExchangeTableRegex = /([\s\S]+?)APIs:[\n][\n](\+\-\-[\s\S]+\-\-\+)[\n][\n]([\s\S]+)/
let match = rstExchangeTableRegex.exec (rstNew)
let rstExchangeTableLines = match[2].split ("\n")

let newRstExchangeTable = rstExchangeTableLines.map (line => {
    return line.replace (/(\||\+)(.).+?(\s|\=|\-)(\||\+)/, '$1') // replace ascii table graphics
}).join ("\n")

//-----------------------------------------------------------------------------

function updateExchangeCount (fileName) {

    log.bright.cyan ('Updating exchange count →', fileName.yellow)

    let oldContent = fs.readFileSync (fileName, 'utf8')
    let newContent =
        oldContent.replace (/shields\.io\/badge\/exchanges\-[0-9]+\-blue/g, 'shields.io/badge/exchanges-' + ccxt.exchanges.length + '-blue')

    fs.truncateSync (fileName)
    fs.writeFileSync (fileName, newContent)

}

updateExchangeCount ('README.md')
updateExchangeCount ('README.rst')

log.bright.green ('Badges updated successfully.')

//-----------------------------------------------------------------------------
/*
* https://download.geonames.org/export/dump/countryInfo.txt
*  */

function camelOrPascalToSnake(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")  // 匹配小写或数字后紧跟大写的情况
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2") // 匹配两个连续大写字母后跟小写字母的情况
    .toLowerCase();
}

const fs = require('node:fs')
const path = require('node:path')

const a = fs.readFileSync(path.resolve(__dirname, './resource.txt'), { encoding: 'utf8' })

let keys = []
const ret = a.split("\n")?.map((row,index) => {
  if(index === 0) {
    keys = row.split("\t").map(i => camelOrPascalToSnake(i.trim()).toLowerCase().toLocaleLowerCase().replaceAll(" ", "_").replaceAll("-", "_").replaceAll("#", ""))
    return
  }
  const r = {}
  row.split("\t").forEach((i,index) => {
    r[keys[index]] = i
  })
  return r
}).filter(Boolean)

fs.writeFileSync(path.resolve(__dirname, './resource.json'), JSON.stringify(ret, null, 2))

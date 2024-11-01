/*
https://download.geonames.org/export/dump/timeZones.txt
*/

const fs = require('node:fs')
const path = require('node:path')

const a = fs.readFileSync(path.resolve(__dirname, './resource.txt'), { encoding: 'utf8' })

const ret = a.split("\n")?.map((row,index) => {
  if(index === 0) return
  const country_code = row.split("\t")[0]
  const timezone = row.split("\t")[1]
  if(!country_code || !timezone) {
    return
  }
  return {
    country_code,
    timezone
  }
}).filter(Boolean)

fs.writeFileSync(path.resolve(__dirname, './timezones.json'), JSON.stringify(ret, null, 2))

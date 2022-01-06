/*
    xls --> csv로 저장
    데이터 영역 외에 윗 부분 삭제
    하단 마지막에 빈 라인 삭제
*/
const fs = require('fs')
const data = fs.readFileSync(
  '/Volumes/3TB-MAC/work/work-game/0.neocrew/0.amore/AP 인사 정보(업체제공용)_최종_pw2021_신대표님 전달용.csv'
)
const lines = data.toString('utf-8').split('\n')

const COLUMN = {
  NUMBER: 0,
  NAME: 1,
  PNUM: 2,
  BIRTH: 3,
}

const ret = []

for (let i = 0; i < lines.length; i++) {
  const cols = lines[i].split(',')
  if (cols.length === 5) {
    cols[1] = `${cols[1]},${cols[2]}`
    cols[1] = cols[1].replace(/\"/gi, '')
    cols[2] = cols[3]
    cols[3] = cols[4]
  }
  if (cols[0])
    ret.push({
      name: cols[COLUMN.NAME],
      pnum: cols[COLUMN.PNUM],
      birth: cols[COLUMN.BIRTH],
    })
}
console.log(JSON.stringify(ret))

/*
    xls --> csv로 저장
    데이터 영역 외에 윗 부분 삭제
    하단 마지막에 빈 라인 삭제
*/
const fs = require('fs')
const data = fs.readFileSync('./test6.csv')
const lines = data.toString('utf-8').split('\n')

const COLUMN={
    HASLEVEL:1,
    LEVEL:2,
    URLNAME:3,
    Q:4,
    R1:5,
    R2:6,
    R3:7,
    R4:8,
    A:9,
    URL:10
}
const ret=[]
let item=null
let currlevel=''
for (let i=0;i<lines.length;i++) {
    const cols = lines[i].split(',')
    if (cols[COLUMN.URLNAME].length>0) {
        if (item!==null) {
            ret.push(item)
        } 
        if (cols[COLUMN.LEVEL].length>0)
            currlevel=cols[COLUMN.LEVEL]
        item = {
            level:currlevel,
            quizlist:[{
                quiz:cols[COLUMN.Q],
                ref:[
                    cols[COLUMN.R1],
                    cols[COLUMN.R2],
                    cols[COLUMN.R3],
                    cols[COLUMN.R4],
                ],
                answer:cols[COLUMN.A]
            }],
            url:`https://dev.nimble-kona.com/movies/${cols[COLUMN.URLNAME]}.mp4`,
            urlname:cols[COLUMN.URLNAME]
        }
    } else {
        item.quizlist.push({
            quiz:cols[COLUMN.Q],
            ref:[
                cols[COLUMN.R1],
                cols[COLUMN.R2],
                cols[COLUMN.R3],
                cols[COLUMN.R4],
            ],
            answer:cols[COLUMN.A]
        })
    }
}
console.log(JSON.stringify(ret))
const sample = [
  "macaddr",
  "80:DE:CC:14:A6:1F",
  "80:DE:CC:14:A6:21",
  "80:DE:CC:14:A6:22",
  "80:DE:CC:14:A6:23",
  "80:DE:CC:14:A6:24",
  "80:DE:CC:14:A6:25",
  "80:DE:CC:14:A6:26",
  "80:DE:CC:14:A6:27",
  "80:DE:CC:14:A6:28",
  "80:DE:CC:14:A6:29",
  "80:DE:CC:14:A6:2A",
  "80:DE:CC:14:A6:2B",
  "80:DE:CC:15:A6:21",
  "80:DE:CC:15:A6:22",
  "80:DE:CC:15:A6:23",
  "80:DE:CC:15:A6:24",
  "80:DE:CC:15:A6:25",
  "80:DE:CC:15:A6:26",
  "80:DE:CC:15:A6:27",
  "80:DE:CC:15:A6:28",
  "80:DE:CC:15:A6:29",
  "80:DE:CC:15:A6:2A",
  "80:DE:CC:15:A6:2B"
]

const parse3 = (buf) => {
  const r = buf.join("")
  const int = parseInt(r, 16)
  return int
}

const test = () => {
  const items = sample
  const group = []
  let curr = 0
  let curr2 = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const buf = item.split(":")
    if (buf.length !== 6) continue
    const r = parse3(buf.slice(0, 3))
    const r2 = parse3(buf.slice(3, 6))
    if (r !== curr) {
      console.log("curr not eq", curr, r)
      curr = r
      group.push({
        first: buf.slice(0, 3).join(":"),
        start: buf.slice(3, 6).join(":"),
        startnum: r2,
        endnum: r2,
        count: 1
      })
    } else {
      const last = group[group.length - 1]
      if (r2 === last.endnum + 1) {
        last.endnum = r2
        last.count = last.count + 1
      } else {
        console.log("last not eq", last.endnum, r2)
        group.push({
          first: buf.slice(0, 3).join(":"),
          start: buf.slice(3, 6).join(":"),
          startnum: r2,
          endnum: r2,
          count: 1
        })
      }
    }
  }
  console.log(group)
}

// test()
const split3 = (num) => {
  return (
    num
      .split(/([\d\w]{2})/)
      .filter((e) => e)
      // .map((e) => console.log(e))
      .join(":")
  )
}

// console.log(split3('aabbccddff'))

const list1 = [
  { start: 0, end: 123 },
  { start: 337, end: 412 },
  { start: 505, end: 528 }
]

const check = (list, count) => {
  let startnum = 0
  if (list.length > 0) {
    let min = 0
    for (let i = 0; i < list.length; i++) {
      let c = list[i]
      if (min < c.start) {
        if (min + count < c.start) {
          break
        } else {
          min = c.end + 1
        }
      } else {
        min = c.end + 1
      }
    }
    startnum = min
  } else {
    startnum = 7
  }
  console.log(`start:${startnum}, end:${startnum + count - 1}`)
}

// check([], 30)
const hasFile = (url) => {
  const buf = url?.split("/")
  return buf.length > 1 && buf[buf.length - 1].indexOf(".") >= 0
}

// console.log(hasFile("url/datas"), hasFile("url/datas/canvas.png"))

// export default class IndexBuffer {
//   constructor(maxInstance) {
//     this.maxInstance = maxInstance
//     this.ptr = 0 // 검색 포인터 초기화
//     this._init()
//   }

//   _init() {
//     // 모든 인덱스를 사용 가능 상태(0)로 초기화
//     this.freeIndices = new Array(this.maxInstance).fill(0)
//     this.nextIndex = 0 // 다음 할당 시작 위치 (현재는 최적화 용도)
//     this.count = 0 // 현재 사용 중인 인덱스 개수
//     this.ptr = 0 // 검색 포인터 리셋
//     console.log("init", this.freeIndices, this.count)
//   }

//   init() {
//     this._init()
//   }

//   clear() {
//     this._init()
//   }

//   /**
//    * 사용 가능한 인덱스를 가져옵니다 (현재 위치부터 검색)
//    * @param {boolean} [fromStart=false] 처음부터 검색할지 여부
//    * @returns {number} 사용 가능한 인덱스 또는 -1 (없을 경우)
//    */
//   getIndex(fromStart = false) {
//     if (fromStart) {
//       this.ptr = 0 // 검색 포인터를 맨 앞으로 리셋
//     }

//     // 현재 포인터 위치부터 사용 가능한 인덱스(값이 0인 곳)를 찾습니다
//     while (this.ptr < this.maxInstance && this.freeIndices[this.ptr] === 0) {
//       this.ptr++
//     }

//     const result = this.ptr < this.maxInstance ? this.ptr : -1

//     // 사용 가능한 인덱스를 찾았다면, 포인터를 다음 후보 위치로 이동
//     if (result !== -1) {
//       this.ptr++
//     }

//     // console.log("getindex", result, this.ptr)
//     return result
//   }

//   /**
//    * 새로운 인덱스를 할당합니다
//    * @returns {number} 새로 할당된 인덱스 또는 -1 (풀이 꽉 찼을 경우)
//    */
//   add() {
//     // const idx = this.getIndex(true) // 사용 가능한 인덱스를 찾습니다
//     while (this.ptr < this.maxInstance && this.freeIndices[this.ptr] !== 0) {
//       this.ptr++
//     }
//     const idx = this.ptr
//     if (idx === -1) {
//       return -1 // 사용 가능한 인덱스가 없음
//     }

//     this.freeIndices[idx] = 1 // 인덱스를 사용 중으로 표시
//     this.count++ // 사용 중인 인덱스 개수 증가
//     // console.log("add", idx, this.count)
//     return idx
//   }

//   /**
//    * 단일 인덱스를 해제합니다
//    * @param {number} i 해제할 인덱스
//    */
//   remove(i) {
//     // 인덱스 범위 검증
//     if (i < 0 || i >= this.maxInstance) {
//       return // 유효하지 않은 인덱스는 무시
//     }

//     // 인덱스가 사용 중이라면 해제합니다
//     if (this.freeIndices[i] === 1) {
//       this.freeIndices[i] = 0 // 인덱스를 사용 가능으로 표시
//       this.count-- // 사용 중인 인덱스 개수 감소

//       // nextIndex를 최소한의 해제된 인덱스로 업데이트 (재사용 우선 순위)
//       this.nextIndex = Math.min(i, this.nextIndex)
//       // console.log("remove", i, this.count)
//     } else {
//       console.log("remove fail", i, this.count)
//     }
//   }

//   /**
//    * 여러 인덱스를 일괄 해제합니다
//    * @param {number[]} ids 해제할 인덱스 배열
//    */
//   removes(ids) {
//     let validFrees = 0 // 성공적으로 해제된 유효 인덱스 개수

//     for (const i of ids) {
//       // 유효하지 않은 인덱스는 건너뜁니다
//       if (i < 0 || i >= this.maxInstance) {
//         continue
//       }

//       // 인덱스가 사용 중이라면 해제합니다
//       if (this.freeIndices[i] === 1) {
//         this.freeIndices[i] = 0 // 인덱스 해제
//         validFrees++
//       }
//     }

//     this.count -= validFrees // 사용 중인 인덱스 개수 감소 (실제 해제된 개수만큼)

//     // nextIndex를 최소한의 해제된 인덱스로 업데이트 (재사용 우선 순위)
//     if (ids.length > 0) {
//       const validIds = ids.filter((id) => id >= 0 && id < this.maxInstance)
//       if (validIds.length > 0) {
//         const minId = Math.min(...validIds)
//         this.nextIndex = Math.min(minId, this.nextIndex)
//       }
//     }
//   }
// }

const buf = new IndexBuffer(5)
console.log(buf)
buf.add()
buf.add()
buf.add()
console.log(buf)
buf.remove(0)
buf.remove(2)
console.log(buf)
buf.add()
buf.add()
buf.add()
console.log(buf)

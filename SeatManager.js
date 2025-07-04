import { v4 as uuidv4 } from "uuid"

class Seat {
  constructor(x, y, color, label) {
    this.id = uuidv4()
    this.x = x
    this.y = y
    this.color = color
    this.label = label
  }
  toString() {
    return `Seat ID: ${this.id}, Position: (${this.x}, ${this.y}), Color: ${this.color}, Label: ${this.label}`
  }
}

class Row extends Array {
  constructor(id = null) {
    super()
    this.id = id === null ? uuidv4() : id
  }
  toString() {
    let res = `Row ID: ${this.id}, Seats: ${this.length}`
    this.forEach((seat) => {
      res += `\n  - ${seat.toString()}`
    })
    return res
  }
}

class Group extends Array {
  constructor(id = null) {
    super()
    this.id = id === null ? uuidv4() : id
  }
  toString() {
    let res = `Group ID: ${this.id}, Rows: ${this.length}`
    this.forEach((row) => {
      res += `\n  - ${row.toString()}`
    })
    return res
  }
}

export class SeatManager {
  constructor() {
    this.seats = {}
    this.rows = {}
    this.groups = {}
  }

  addSeat(x, y, color, label) {
    const seat = new Seat(x, y, color, label)
    this.seats[seat.id] = seat
    return seat
  }

  removeSeat(seatId) {
    if (this.seats[seatId]) {
      if (this.seats[seatId].rowId !== null) {
        const row = this.getRowById(this.seats[seatId].rowId)
        this.removeSeatFromRow(seatId, row)
      }
      delete this.seats[seatId]
    }
  }

  seatDetail(seatId) {
    const seat = this.getSeatById(seatId)
    if (seat) {
      const row = this.getRowById(seat.rowId)
      const group = this.getGroupById(row.groupId)

      return `Seat ID: ${seat.id}, Row ID: ${row.id}, Group ID: ${group.id}, Position: (${seat.x}, ${seat.y}), Color: ${seat.color}, Label: ${seat.label}`
    }
    return ""
  }

  getRowById(rowId) {
    if (!this.rows[rowId]) {
      const r = new Row(rowId)
      this.rows[r.id] = r
      return r
    } else {
      return this.rows[rowId]
    }
  }

  addRow(rowId = null, seats) {
    const row = this.getRowById(rowId)
    if (seats) {
      for (const seat of seats) {
        this.addSeatToRow(seat, row)
      }
    }

    return row
  }

  removeRow(rowId) {
    if (this.rows[rowId]) {
      if (this.rows[rowId].groupId !== null) {
        const group = this.getGroupById(this.rows[rowId].groupId)
        this.removeRowFromGroup(rowId, group)
      }
      const seatIds = this.rows[rowId].map((seat) => seat.id)
      for (const seatid of seatIds) {
        this.removeSeat(seatid)
      }
      delete this.rows[rowId]
    }
  }
  getGroupById(groupId) {
    if (!this.groups[groupId]) {
      const g = new Group(groupId)
      this.groups[g.id] = g
      return g
    } else {
      return this.groups[groupId]
    }
  }

  addGroup(groupId = null, rows) {
    const group = this.getGroupById(groupId)

    if (rows) {
      for (const row of rows) {
        this.addRowToGroup(row, group)
      }
    }
    return group
  }

  removeGroup(groupId) {
    if (this.groups[groupId]) {
      const rowids = this.groups[groupId].map((row) => row.id)
      for (const rowid of rowids) {
        this.removeRow(rowid)
      }

      delete this.groups[groupId]
    }
  }

  addSeatToRow(seat, row) {
    // console.log("addSeatToRow", seat, row)
    seat.rowId = row.id
    row.push(seat)
  }

  removeSeatFromRow(seatId, row) {
    const index = row.findIndex((s) => s.id === seatId)

    if (index !== -1) {
      row.splice(index, 1)
    }
  }

  addRowToGroup(row, group) {
    // console.log("addRowToGroup", row, group)
    row.groupId = group.id
    group.push(row)
  }

  removeRowFromGroup(rowId, group) {
    const index = group.findIndex((r) => r.id === rowId)

    if (index !== -1) {
      group.splice(index, 1)
    }
  }

  getAllSeats() {
    return Object.values(this.seats)
  }

  getSeatById(id) {
    return this.seats[id]
  }

  getAll() {
    Object.keys(this.groups).forEach((groupId) => {
      const group = this.groups[groupId]
      console.log(`Group ID: ${group.id}`)
      group.forEach((row) => {
        console.log(`  - Row ID: ${row.id}`)
        row.forEach((seat) => {
          console.log(
            // `    - Seat ID: ${seat.id} Label: ${seat.label} Color: ${seat.color} Position: (${seat.x}, ${seat.y})`
            this.seatDetail(seat.id) // Using the seatDetail method for better formatting
          )
        })
      })
    })
    return { group: Object.keys(this.groups), row: Object.keys(this.rows) }
  }

  // Add other methods similar to above...
}

const seatManager = new SeatManager()

for (let i = 0; i < 3; i++) {
  const group = seatManager.addGroup(i)
  for (let j = 0; j < 3; j++) {
    const row = seatManager.addRow(`${i}-${j}`)
    seatManager.addRowToGroup(row, group)
    for (let k = 0; k < 3; k++) {
      const seat = seatManager.addSeat(k, j, "red", `A${k}`)
      seatManager.addSeatToRow(seat, row)
    }
  }
}

console.log(`Total ${Object.keys(seatManager.seats).length} seats\r\n`)
console.log(`Total ${Object.keys(seatManager.rows).length} rows\r\n`)
console.log(`Total ${Object.keys(seatManager.groups).length} groups\r\n`)
// console.log("All seats:")
console.log(seatManager.getAll())
seatManager.removeRow("1-1")
console.log(seatManager.getAll())
console.log("\r\n ======================\r\n")
console.log(`Total ${Object.keys(seatManager.seats).length} seats\r\n`)
console.log(`Total ${Object.keys(seatManager.rows).length} rows\r\n`)
console.log(`Total ${Object.keys(seatManager.groups).length} groups\r\n`)
seatManager.removeGroup(1)
console.log("\r\n ======================\r\n")
console.log(`Total ${Object.keys(seatManager.seats).length} seats\r\n`)
console.log(`Total ${Object.keys(seatManager.rows).length} rows\r\n`)
console.log(`Total ${Object.keys(seatManager.groups).length} groups\r\n`)
console.log(seatManager.getAll())

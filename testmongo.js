// const mongoose = require('mongoose')
import mongoose from 'mongoose'
const Schema = new mongoose.Schema({
  idx: {
    type: Number,
    index: true,
  },
  msg: {
    type: String,
    index: true,
  },
})
Schema.index({ msg: 'text' }, { background: true })
export const Model = mongoose.model('test', Schema)

const dbSingleton = (() => {
  const db = mongoose.connection
  let instance = null
  const init = async (url) => {
    mongoose.Promise = Promise
    db.on('error', console.log)
    db.on('connected', () => {
      console.log('MONGO] connected')
    })
    db.on('reconnected', () => {
      console.log('MONGO] reconnected')
    })
    db.on('disconnected', () => {
      console.log('MONGO] disconnected')
    })
    db.on('close', () => {
      console.log('MONGO] closed')
    })
    db.once('open', function () {
      console.log('MONGO] open')
    })
    //   const url = cfg.mongohost
    const conn = await mongoose.connect(url, {
      // useNewUrlParser: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
      // useUnifiedTopology: true,
    })
    console.log(`url (${url}) connected`)
    // await initDB(db.db)
    console.log('database initialized')
    return {
      conn: conn,
    }
  }

  return {
    createDatabase: (url) => {
      if (!instance) {
        init(url).then((r) => {
          instance = r
          return r
        })
      } else return instance
    },
  }
})()

export default dbSingleton.createDatabase('mongodb://localhost:27017/test')

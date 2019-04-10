const express = require('express')
      bodyParser = require('body-parser')
      mongoose = require('mongoose')
      app = express()

mongoose.connect('mongodb://ajdin:qqqq1111@ds135726.mlab.com:35726/engineer', { useNewUrlParser: true })

const appSchema = new mongoose.Schema({
    _id: ObjectId,
    type: String,
    name: String,
    createdAt: Date,
    deleted: Boolean,
    enabled: Boolean,
    price: Number,
    meta: {
    package: String,
    platform: String,
    }
  })
const pointsSchema = new mongoose.Schema ({
    _id: ObjectId,
    applicationId: String,
    points: Number,
    status: String,
    updatedAt: Date,
    createdAt: Date,
    completedAt : Date
  })

const Applications = mongoose.model('applications', appSchema)
const Points = mongoose.model('points', pointsSchema )

app.get('/', (req,res) => res.send('Hello !!'))

app.listen(3000, () => console.log('Server ready!!!'))
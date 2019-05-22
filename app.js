const express = require('express')
      bodyParser = require('body-parser')
      mongoose = require('mongoose')
      app = express()

mongoose.connect('mongodb://ajdin:qqqq1111@ds135726.mlab.com:35726/engineer', { useNewUrlParser: true })

const appSchema = new mongoose.Schema({
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
    applicationId: String,
    points: Number,
    status: String,
    updatedAt: Date,
    createdAt: Date,
    completedAt : Date
  })

const Applications = mongoose.model('applications', appSchema)
const Points = mongoose.model('points', pointsSchema)

app.get('/api/application', async (req,res) => {
  const [applications, points] = await Promise.all([
    Applications.find({}),
    Points.find({ status: 'complete'})
  ])
  const appFilter = applications.map(x => ({applicationId: x.id, name: x.name,platform: x.meta.platform}))
  const grouped = Array.from(points
    .filter(x => x.points)
    .reduce((m, { applicationId, points }) => m.set(applicationId, (m.get(applicationId) || 0) + points), new Map),
    ([applicationId, points]) => ({ applicationId, points })
  )
  const resultFilter = []
  appFilter.forEach((itm, i) => {
    resultFilter.push({...itm, ...grouped[i]})
  })
  console.log(resultFilter)
  res.json(resultFilter)
})

app.get('/api/application/:id' , async (req,res) => {
  const {id} = req.params
  let responseFromDb
  Applications.findById(id, function (err, result) { 
    if(err) {
      console.log(err)
    } else {
      return result
    }
  })
  const responseFromDb = {id: req.params.name}
  console.log(responseFromDb)
  res.json(id)
})

app.listen(3000, () => console.log('Server ready!!!'))
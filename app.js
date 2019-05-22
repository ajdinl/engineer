const express = require('express')
      bodyParser = require('body-parser')
      mongoose = require('mongoose')
      app = express()

mongoose.connect('mongodb://ajdin:qqqq1111@ds135726.mlab.com:35726/engineer', { useNewUrlParser: true })

const appSchema = new mongoose.Schema({
    _id: String,
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
    _id : String,
    applicationId: String,
    points: Number,
    status: String,
    updatedAt: Date,
    createdAt: Date,
    completedAt : Date
  })

const Applications = mongoose.model('application', appSchema)
const Points = mongoose.model('point', pointsSchema)

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
  res.json(resultFilter)
})

app.get('/api/application/:id' ,  (req,res) => {
  const {id, name} = req.params
  let responseFromDb
  Applications.findById(id, 'name meta.platform' , (err, result) => {
    if(err){
      console.log(err)
    } else {
      result
    }
    responseFromDb = {id: result._id, name: result.name, platform: result.meta.platform}
  })
  Points.find({status: 'complete',applicationId:id}, (err,result) =>{
    if(err){
      console.log(err)
    } else {
      result
    }
    const pointsSum = Array.from(result
      .filter(x => x.points)
      .reduce((m, { applicationId, points }) => m.set(applicationId, (m.get(applicationId) || 0) + points), new Map),
      ([applicationId, points]) => ({ applicationId, points })
    )
    const zaBobana = {responseFromDb, pointsSum}
    res.json(zaBobana)
  })
})

app.listen(3000, () => console.log('Server ready!!!'))
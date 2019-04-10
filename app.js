const express = require('express')
      bodyParser = require('body-parser')
      mongoose = require('mongoose')
      app = express()

mongoose.connect('mongodb://ajdin:qqqq1111@ds135726.mlab.com:35726/engineer', { useNewUrlParser: true })

app.get('/', (req,res) => res.send('Hello !!'))

app.listen(3000, () => console.log('Server ready!!!'))
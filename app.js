const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if(process.env.NODE_ENV === 'production'){
  app.use('/', express.static(path.join(__dirname, 'client','build')))

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        }, err => {
            if(err) throw err;
            console.log('Connected to MongoDB')
        })
    }catch (e){
        console.log('Server error', e.message)
        process.exit(1)
    }
}
start()
app.listen(PORT, ()=> console.log(`Server is started on port ${PORT}`))
const path = require('path')
const express = require('express');
const {cutSprite, removeAllSprites, udloadFile} = require('./cutter');
const fs = require('fs')


const PORT = 3000;
const app = express()

let baseSaveDir = path.resolve(__dirname, './../../sounds/cutted')

app.setMaxListeners(20);

app.use(express.static(path.resolve(__dirname, '../../sounds')))
app.use(express.static(path.resolve(__dirname, '../frontend')))
//const urlencodedParser = express.urlencoded({extended: false})
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: false, limit: '50mb'}))


app.listen(PORT, ()=>{
   console.log('App started on port '+ PORT);
});

app.get('/', (req, res) =>{
   res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.get('/api/cut', (req, res) =>{
   try {
      cutSprite(req.query['sprite'], baseSaveDir);
      res.send('ok');
   } catch {
      console.log('Некорректный путь к папке')
      res.sendStatus(400)
   }
});

app.post('/api/change-json', async (req, res) => {
   //console.log(req.body)
   const file = req.body.file
   const dir = path.resolve(__dirname, '../../sounds')
   const name = 'sound.json'
   await udloadFile({file, dir, name})
   res.send('ok')
})


app.get('/api/get-json', (req, res) => {
   removeAllSprites(path.resolve(__dirname, './../../sounds/cutted'))
   
   
   if (fs.existsSync(path.resolve(__dirname, '../../sounds/sound.json'))) {
      res.sendFile(path.resolve(__dirname, '../../sounds/sound.json'))
   } else {
      res.send('not exist')
   }
   
});

app.get('/api/cut-all', (req, res) => {
   const allSprites = req.query.sprites.split(',')
   allSprites.forEach(sprite => {
      cutSprite(sprite, baseSaveDir)
   })
   res.send('ok')
})

app.post('/api/change-sound', async (req, res) => {
   const file = req.body.file
   const dir = path.resolve(__dirname, './../../sounds')
   const name =  req.body.name
   await udloadFile({file, dir, name})
   res.send('ok')
})

app.get('/api/change-dir', (req, res) => {
   if (req.query.value == 'default-path') {
      baseSaveDir = path.resolve(__dirname, './../../sounds/cutted')
      return res.sendStatus(200)
   }
   const dirArr = req.query.value.split('\\')
   baseSaveDir = dirArr.reduce((prev, cur) => {
      return prev + '/' + cur
   })
   if (fs.existsSync(baseSaveDir)) {
      res.sendStatus(200)
   } else {
      console.log('Некорректный путь к папке')
      res.sendStatus(400)
   }
   
})
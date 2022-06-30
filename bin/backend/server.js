const path = require('path')
const express = require('express');
const cutSprite = require('./cutter')

const PORT = 3000;
const app = express()

app.setMaxListeners(20);

app.use(express.static(path.resolve(__dirname, '../../sounds')))
console.log(path.resolve(__dirname, '../../sounds'))
app.use(express.static(path.resolve(__dirname, '../frontend')))


app.listen(PORT, ()=>{
   console.log('App started on port '+ PORT);
});

app.get('/', (req, res) =>{
   res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.get('/api/cut', (req, res) =>{
   cutSprite(req.query['sprite']);
   res.send('ok');
});


app.get('/api/get-json', (req, res) => {
   res.sendFile(path.resolve(__dirname, '../../sounds/sound.json'));
});
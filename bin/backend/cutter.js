const MP3Cutter = require('mp3-cutter');
const path = require('path')
const fs = require('fs');

//path.join('C:/Users/Данила/Documents/dumps', name + '.mp3')

async function cutSprite(name, base){
   const soundJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../../sounds/sound.json'), 'utf-8'));
   const sprite = soundJSON.sprite[name];
   await MP3Cutter.cut({
      src: path.resolve(__dirname, './../../sounds/sound.mp3'),
      target: path.resolve(base, name + '.mp3'),
      start: (sprite[0] / 1000),
      end: (sprite[0] + sprite[1])/1000
   }); 
}

function removeAllSprites(dir){
   fs.readdir(dir, (err, files) => {
      files.forEach(file => {
         fs.unlink(path.resolve(dir, file), err => {
            if (err) console.log(err)
         })
      })
   })
}

async function udloadFile(responce){
   // responce = {data, dir, name}
   const clearData = responce.file.split(',')[1]
   const buffer = await Buffer.from(clearData, 'base64');
   const saveDir = path.resolve(responce.dir, responce.name)
  
   await fs.writeFile(saveDir, buffer, function(err) { 
      if (err) console.log(err)
    });
}

module.exports = {cutSprite, removeAllSprites, udloadFile}
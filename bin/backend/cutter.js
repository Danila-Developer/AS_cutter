const MP3Cutter = require('mp3-cutter');
const path = require('path')
const fs = require('fs');
const soundJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../../sounds/sound.json'), 'utf-8'));


async function cutSprite(name){
   const sprite = soundJSON.sprite[name];
   await MP3Cutter.cut({
      src: path.resolve(__dirname, './../../sounds/sound.mp3'),
      target: path.resolve(__dirname, './../../sounds/cutted', name + '.mp3'),
      start: (sprite[0] / 1000),
      end: (sprite[0] + sprite[1])/1000
   }); 
}

module.exports = cutSprite;
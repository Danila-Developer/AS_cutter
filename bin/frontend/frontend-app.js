window.onclick = (e) => {
   if (e.target.classList.contains('pad-button__play-img')) {
      let soundToPlay = e.target.dataset.sound;
      drums.stop();
      drums.play(soundToPlay);
   }
   if (e.target.classList.contains('pad-button__cut-img')) {
      fetch('http://localhost:3000/api/cut?sprite=' + e.target.dataset.sound);
      e.target.parentNode.parentNode.parentNode.classList.add('pad-cutted');
   }
}

function createPad(name) {
   let pad = document.createElement('div');
   pad.classList.add('pad');
   pad.dataset.sound = name;
   let padName = document.createElement('div');
   padName.innerText = name;
   padName.classList.add('pad-name');
   pad.appendChild(padName);

   padButtons = document.createElement('div');
   padButtons.classList.add('pad-buttons');

   padButtonPlay = document.createElement('div');
   padButtonPlay.classList.add('pad-button__play');
   padButtonPlay.dataset.sound = name;
   playImg = document.createElement('img');
   playImg.classList.add('pad-button__play-img')
   playImg.src = 'img/play.png';
   playImg.dataset.sound = name;
   padButtonPlay.appendChild(playImg);
   padButtons.appendChild(padButtonPlay);

   padButtonCut = document.createElement('div');
   padButtonCut.classList.add('pad-button__cut');
   cutImg = document.createElement('img');
   cutImg.src = 'img/cutting.png';
   cutImg.dataset.sound = name;
   cutImg.classList.add('pad-button__cut-img');
   padButtonCut.appendChild(cutImg);
   padButtons.appendChild(padButtonCut);
   pad.appendChild(padButtons);

   document.querySelector('.dramkit').appendChild(pad);
}

let soundJSON;
let drums;
async function fetchSoundJSON() {
   await fetch('http://localhost:3000/api/get-json')
      .then(data => data.json())
      .then(json => {
         soundJSON = parseSoundJSON(json);
         drums = new Howl(soundJSON);
      });
}
fetchSoundJSON()
   .then(() => {
      let spriteNames = [];
      for (sprite in soundJSON.sprite) {
         spriteNames.push(sprite)
      }
      for (i in spriteNames) {
         createPad(spriteNames[i]);
      }
   });

let isIgnoreLoop = false;
document.querySelector('#loop-checkbox').onclick = (e)=>{
   isIgnoreLoop = e.target.checked;
   drums.stop();
   drums = new Howl(parseSoundJSON(soundJSON));
}

function parseSoundJSON(soundJSON) {
   let newJSON = {};

   if (soundJSON.src === undefined) {

      newJSON.src = soundJSON[Object.keys(soundJSON)[0]];
      newJSON.sprite = {};

      if (isIgnoreLoop) {
         for (spriteName in soundJSON.sprite) {
            newJSON.sprite[spriteName] = soundJSON.sprite[spriteName];
            newJSON.sprite[spriteName] = []
            newJSON.sprite[spriteName][0] = soundJSON.sprite[spriteName][0];
            newJSON.sprite[spriteName][1] = soundJSON.sprite[spriteName][1];
         }
      } else {
         for (spriteName in soundJSON.sprite) {
            newJSON.sprite[spriteName] = soundJSON.sprite[spriteName];
            newJSON.sprite[spriteName] = []
            newJSON.sprite[spriteName][0] = soundJSON.sprite[spriteName][0];
            newJSON.sprite[spriteName][1] = soundJSON.sprite[spriteName][1];
            if (soundJSON.sprite[spriteName][2] !== undefined) {
               newJSON.sprite[spriteName][2] = soundJSON.sprite[spriteName][2];
            }
         }
      }
      return newJSON;
   } else {
      if (isIgnoreLoop) {
         newJSON.src = soundJSON.src;
         newJSON.sprite = {};
         for (spriteName in soundJSON.sprite) {
            newJSON.sprite[spriteName] = soundJSON.sprite[spriteName];
            newJSON.sprite[spriteName] = []
            newJSON.sprite[spriteName][0] = soundJSON.sprite[spriteName][0];
            newJSON.sprite[spriteName][1] = soundJSON.sprite[spriteName][1];
         }
         return newJSON;

      } else {

         return soundJSON;
      }
   }
}





const defaulJSON = {
   "src": [
     ""
   ],
   "sprite": {
     "": []
   }
}
      


window.onclick = (e) => {
   if (e.target.classList.contains('pad-button__play-img')) {
      let soundToPlay = e.target.dataset.sound;
      drums.stop();
      drums.play(soundToPlay);
   }
   if (e.target.classList.contains('pad-button__cut-img')) {
      fetch('http://localhost:3000/api/cut?sprite=' + e.target.dataset.sound)
      .then( () => {
         e.target.parentNode.parentNode.parentNode.classList.add('pad-cutted');
      })
   }
}

const allStrites = []

function createPad(name) {
   allStrites.push(name)
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
         try{
            soundJSON = parseSoundJSON(json);
            drums = new Howl(soundJSON);
         } catch {
            soundJSON = defaulJSON
            drums = new Howl(soundJSON);
         }
         
      });
}
function fetchAndCreatePads(){
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
}
fetchAndCreatePads()


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

function cutAll(){
   document.querySelector('.cut-all').onclick = (e) => {
      fetch(`http://localhost:3000/api/cut-all?sprites=${allStrites}`)
      .then(()=>{
         document.querySelector('.cut-all').classList.add('pad-cutted')
      })
   }
}

cutAll()

const sountInput = document.querySelector('#sound-input_input')
const jsonInput = document.querySelector('#json-input_input')

document.querySelector('#json-input_input').onchange = (e) => {
   let file = e.target.files[0]
   let reader = new FileReader()
   reader.readAsDataURL(file)

   reader.onload = () => {
      fetch('http://localhost:3000/api/change-json', {
         headers: {
             'Content-Type': 'application/json'
         },
         method: 'POST',
         body: JSON.stringify({file: reader.result})
      }).then(()=> {
         if (sountInput.files[0]) {
            removeAllPads()
            fetchAndCreatePads()
            location.reload()
         }
      })
   }
}



document.querySelector('#sound-input_input').onchange = (e) => {
   Array.from(e.target.files).forEach(file => {
      const fileName = file.name.split('.')
      
      let reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
         fetch('http://localhost:3000/api/change-sound', {
            headers: {
               'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({file: reader.result, name: req.body.name})
         }).then(()=> {
            
         })
      }
   })
   
}

function removeAllPads(){
   document.querySelectorAll('.pad').forEach(pad => {
      pad.remove()
   })
}

document.querySelector('#save-input_input').onchange = (e) => {
   if (document.querySelector('#save-checkbox').checked) {
      fetch(`http://localhost:3000/api/change-dir?value=${e.target.value}`)
   }
}

document.querySelector('#save-checkbox').onchange = async (e) => {
   const input = document.querySelector('#save-input_input')
   if (e.target.checked) {
      input.disabled = false
   } else {
      input.disabled = true
      await fetch(`http://localhost:3000/api/change-dir?value=default-path`)
   }
}



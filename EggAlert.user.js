// ==UserScript==
// @name         Egg Alert
// @namespace    Heasleys.EggAlert
// @version      1.0.1
// @description  Alert and glow on Easter Eggs
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/EggAlert.user.js
// ==/UserScript==

GM_addStyle(`
#EasterEgg {
  border-radius: 50%;
  box-shadow: 0px 0px 90px 40px #FFC107;
  animation: glow 1.5s ease-out infinite alternate;
}

@keyframes glow{
  to {
    box-shadow: 0px 0px 30px 20px #FFC107;
  }
}
`);

var observer = new MutationObserver(function(mutations, observer) {
      mutations.forEach(function(mutation) {
        for (const element of mutation.addedNodes) {
          if (element.querySelector && element.querySelector('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]')) {
            var image = element.querySelector('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]');
            image.onload = function() {detectEgg(this);}
            observer.disconnect();
          }
        }
      });
});

observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

function detectEgg(image) {
  var opac = opacityRatio(image);
  if (opac == 0) {
    console.log(`Fake Easter Egg found. Ignoring...`);
    $('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]').hide(); //prevent accidentally clicking
  } else {
    $('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]').attr('id', 'EasterEgg');
    
    alert(`Easter Egg found. Look closely on the page to find it!`);
    console.log(`Easter Egg found. Look closely on the page to find it!`);
  }
}


function opacityRatio(image) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let opacity = 0;
    for (let i = 0; i < data.length; i += 4) {
        opacity += data[i + 3];
    }
    return (opacity / 255) / (data.length / 4);
}

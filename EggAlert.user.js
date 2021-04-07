// ==UserScript==
// @name         Egg Alert
// @namespace    Heasleys.EggAlert
// @version      1.0.5a
// @description  Alert and glow on Easter Eggs
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/EggAlert.user.js
// ==/UserScript==

// anonymous function wrapper to prevent other scripts interfering with this script
(function() {

      // Scan the page for changes in the DOM (elements on the page)
var observer = new MutationObserver(function(mutations, observer) {
      // For each "mutation" (change) ->
      mutations.forEach(function(mutation) {
            // For the elements/nodes added to the page
        for (const element of mutation.addedNodes) {
            // if the element exists and the element contains the following information (image source that starts (^) with "competiton.php"  
            // AND image source contains "step=eggImage" AND source contains "access_token=", then select the element (which is an egg)
          if (element.querySelector && element.querySelector('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]')) {
            // save image element to variable (the egg selected above)
            var image = element.querySelector('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]');
            // when the image loads, start the function "detectEgg" passing the egg image with it
            image.onload = function() {detectEgg(this);}
          }
        }
      });
});

// Start the MutationObserver created above
observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});



function detectEgg(image) {
      // initialize CSS (styling)
  initCSS();
      // start the function to check the opacity of the image (invisible or not)
  var opac = opacityRatio(image);
      // check if the opacity level is 0 (invisible)
  if (opac == 0) {
        //if we get here, we have found a fake/invisible egg. send message to console declaring fake egg
    console.log(`Fake Easter Egg found. Ignoring...`);
        // hide the invisible egg to prevent accidentally clicking the fake egg
    $('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]').hide(); //prevent accidentally clicking
  } else {
        // otherwise, if we get here, the egg is not invisible (Real egg)
        // set the ID of the egg to 'EasterEgg' which corresponds to the CSS styling from before
    $('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]').attr('id', 'EasterEgg');
    
        // send an alert to inform user of an egg, and to stop accidental clicking off page
    alert(`Easter Egg found. Look closely on the page to find it!`);
        // send message to console that real egg has been found
    console.log(`Easter Egg found. Look closely on the page to find it!`);
  }
}


function opacityRatio(image) {
      // create a blank canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
      // set canvas to the egg width and height
    canvas.width = image.width;
    canvas.height = image.height;
      // draw the image
    context.drawImage(image, 0, 0);
      //grab the pixel data from the drawn image
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      // initialize variable
    let opacity = 0;
      // loop through the pixels of the drawn image to check for opacity
    for (let i = 0; i < data.length; i += 4) {
        opacity += data[i + 3];
    }
      // return the opacity level [0-1]
    return (opacity / 255) / (data.length / 4);
}


function initCSS() {
      // insert CSS styles into the page, animation coloring for highlights
  const ele= document.createElement('style');
  ele.type = 'text/css';
  ele.innerHTML = `
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
  `;
  document.head.appendChild(ele); // append the css styles above to the header of the page
}

})();// end of anonymous function wrapper, then start the anonymous function

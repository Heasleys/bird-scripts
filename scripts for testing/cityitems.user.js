// ==UserScript==
// @name         Spawn City Items
// @namespace    heasley.cityspawns
// @version      0.1
// @description  Spawn City Items for fun or testing
// @author       Heasleys4hemp
// @match        https://www.torn.com/city.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// ==/UserScript==


GM_addStyle(`
.wb_pane {
	width: 200px;
	height: 200px;
	border: 1px solid #000;
    border-radius: 5px;
	box-sizing: border-box;
    position: absolute;
    background: grey;
    left: 10px;
    top: 200px;
}

.wb_pane input {
  margin-top: 5px;
  margin-bottom: 5px;
}

.wb_pane button {
  background: white;
  border-radius: 3px;
  border: 1px black solid;
  alig
`);

const MINITEM = 1;
const MAXITEM = 1294;
const MINMAPH = 10;
const MAXMAPH = 448;
const MINMAPW = 10;
const MAXMAPW = 776;

(function() {
    'use strict';
    insertThing();
})();




function insertThing() {
    $('body').after(`
     <div class="wb_pane">
       <p>Number of items to spawn</p>
       <input type="number" id="num" value="10">
       <button id="itemSpawn">Spawn Items</button>
     </div>
`);
   $('#min').val(MINITEM);
   $('#max').val(MAXITEM);

    $('#itemSpawn').click(function() {
        let num = $('#num').val();
        var zndx = 300;

        for (let step = 0; step < num; step++) {
            const item = randomIntFromInterval(MINITEM, MAXITEM);
            const x = randomIntFromInterval(MINMAPW, MAXMAPW);
            const y = randomIntFromInterval(MINMAPH, MAXMAPH);
            $('.leaflet-marker-pane').append(`
            <img src="https://www.torn.com/images/items/${item}/small.png" class="leaflet-marker-icon map-user-item-icon leaflet-zoom-hide leaflet-clickable" tabindex="0" style="transform: translate3d(${x}px, ${y}px, 0px); z-index: ${zndx}; display: none;">
            `);
            zndx++;
        }

    });

}


function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

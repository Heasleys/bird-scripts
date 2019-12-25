// ==UserScript==
// @name         CTMAP - Extended View
// @namespace    Heasleys.ctextended
// @version      1.0
// @description  My weird project to extend and redesign the christmas town map viewer
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/ctextended.user.js
// ==/UserScript==



$(window).load(function () {

 function extendview() {

    var contentwrapper = $('.content-wrapper');

    var usermap = $('.user-map-container');
    var ctwrap = $('#ct-wrap');
    var buttonmap = $('.user-map');
    var mapoverview = $('.map-overview');

    var statuscontainer = $('.status-area-container');
    var itemcontainer = $('.items-container');

    contentwrapper.css({"width": "100%"});

    statuscontainer.hide();
    usermap.css({"width": "100%","height": "100%"});
    var mapwidth = usermap.width();
    var mapheight = usermap.height();

    mapoverview.css({"width": "100%","height": mapheight});
    buttonmap.css({"width": "100%","height": mapheight});
    itemcontainer.css({"width": "100%"});
    ctwrap.css({"height": "100%","position": "relative"});
    statuscontainer.css({"width": "100%","height": mapheight,"position":"absolute"});



    usermap.before(`<p id="ct-message">Welcome to Christmas Town!</p>`);


    $('#toggleTextArea').on('click', function(){
        statuscontainer.toggle();
    });

    $('#toggleBorder').on('click', function(){
        buttonmap.toggleClass('wb-user-map');


    });

     $('#toggleBorder').toggle(
            function(){$("#world").css({"left": "18%"});},
            function(){$("#world").css({"left": "33%"});}
     );

    $('ul.items-list > li:not([class=""])').on('click', function(){
        statuscontainer.toggle();
        return true;
    });


    interceptFetch('christmas_town.php', (response, url) => {
        console.log(response);
        if (response.mapData) {
            if (response.mapData.trigger) {
                if (response.mapData.trigger.message) {
                  $('#ct-message').text(response.mapData.trigger.message);
                }

                if (response.mapData.trigger.miniGameType && response.mapData.trigger.miniGameType != "Teleport") {
                    console.log("I found a mini game");
                    console.log(response.mapData.trigger.miniGameType);
                    statuscontainer.show();
                } else {
                    statuscontainer.hide();
                }

                if (response.mapData.trigger.item) {
                    $('#ct-message').html($('#ct-message').text() + "<br><div class='itemImage___2Czno'><img src='" + response.mapData.trigger.item.image.url + "'></div>");
                }
            }

            if (response.mapData.cellEvent && response.mapData.cellEvent.type != "teleport") {
                statuscontainer.show();
            } else {
                statuscontainer.hide();
            }
        }

    });



GM_addStyle(`
#ct-message {
  text-align: center;
  font-size: 15px;
  letter-spacing: 1px;
  font-weight: 400;
  line-height: 1.6;
  padding: 6px;
  color: rgb(102, 143, 163);
  background: url(/images/v2/christmas_town/bg_image_path.jpg) center 0 no-repeat;
  background-size: cover;
  height: 72px;
  border: 1px solid #bfd0d8;
}

.user-map {
  margin: auto;
}

.wb-user-map {
  width: 60% !important;
}

.d #ct-wrap.ct-user-wrap .map-overview .world {
  left: 33%;
  top: 18%;
}

.d #ct-wrap .user-map-container .user-map:before {
  background: none !important;
}

.d #ct-wrap .user-map-container .map-controls {
  //background: url(/images/v2/christmas_town/edge_fade.png) 0 0 no-repeat !important;
}

.d .status-area-container .text-container {
  background-size: cover !important;
  height: 100% !important;
}

.d .map-directions>.direction {
  background: rgba(250, 250, 250, 0.7) !important;
}

.d .map-directions>.direction.south {
  width: 100% !important;
  top: `+(mapheight-39)+`px !important;
}

.d .map-directions>.direction.north {
  width: 100% !important;
}

.d .map-directions>.direction.east {
  height: `+mapheight+`px !important;
  top: 0 !important;
}

.d .map-directions>.direction.west {
  height: `+mapheight+`px !important;
  top: 0 !important;
}

.d .map-directions>.direction.east:before {
  top: 50% !important;
}

.d .map-directions>.direction.west:before {
  top: 50% !important;
}

.d .map-directions>.direction.north:before {
  left: 50% !important;
}

.d .map-directions>.direction.south:before {
  left: 50% !important;
}

.d #ct-wrap .items-container, .d .items-container {
  min-height: 0 !important;
}

.game-start-screen___1Rx4- {
  background: url(/images/v2/christmas_town/minigames/congratulation_bg.jpg) no-repeat !important;
  background-size: cover !important;
}

.alphabet___2llXk {
  padding: 1px 35px !important;
}

.d .status-area-container .chest-dialog {
  padding-top: 10% !important;
  height: 100% !important;
  background-size: cover !important;
}

.wrap___lfcFL {
  height: 100% !important;
  background-size: cover !important;
  padding-top: 35px !important;
}

.game-board___2ea-E {
  height: `+mapheight+`px !important;
  background-size: cover !important;
}

.game-board___2ea-E > ul {
  top: 0 !important;
  padding-top: 30% !important;
}

.message___3gqFK {
  bottom: 10% !important;
}

.voting___3t92W {
  background-size: cover !important;
}

.wrap___1algu {
  padding: 35px !important;
}

.wrap___lfcFL {
  padding: 35px !important;
}

.wrap___2Eoyc {
  padding: 35px !important;
  background-size: cover !important;
}

.board___1EROF {
  height: 100% !important;
}

.christmas-wreath___2WA9B {
  height: 100% !important;
  padding: 35px !important;
}

.snow___1XpPy {
  visibility: hidden !important;
}

.snow___1XpPy > img {
  visibility: hidden !important;
}

.level-end___2JUgA {
  height: 100% !important;
  background-size: cover !important;
  padding-top: 35px !important;
}

.level-end___18FRy {
  height: 100% !important;
  background-size: cover !important;
  padding-top: 35px !important;
}

.level-end___34YTy {
  height: 100% !important;
  background-size: cover !important;
  padding-top: 35px !important;
}

.score-board___2z2Q_ {
  padding: 0 35px !important;
}

.cookies-layer___gxu__{
  left: 20% !important;
}

.board___3zmTp {
  height: 100% !important;
}

`);

 } //extendview function



  $('.core-layout__viewport').before(`<div class="wb-ct-title"><span>CT Extended<button class="wb-ct-button" id="toggleExtend">Extend View</button><button class="wb-ct-button" id="toggleTextArea">Text View</button><button class="wb-ct-button" id="toggleBorder">Toggle Fog</button></span></div>`);

    $('#toggleExtend').on('click', function(){
        extendview();
        $(this).prop('disabled', true);
    });

GM_addStyle(`

.wb-ct-title {
  border: 1px solid #a7bec9;
  padding: 5px;
  margin-bottom: 10px;
  display: block;
  color: #668fa3;
  text-shadow: 0 1px 0 hsla(0,0%,100%,.45);
  font-size: 15px;
  letter-spacing: 1px;
  font-weight: 400;
  line-height: 1.6;
  background: linear-gradient(180deg,#fff,#e0edf3 99%);
  border-radius: 5px 5px 0 0;
}

.wb-ct-title > span {
  padding-left: 5px;
  padding-right: 10px;
}

.wb-ct-button {
    border-radius: 5px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    color: rgb(51, 51, 51);
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: 1px solid #a7bec9;
    text-decoration: none;
    overflow: hidden;
    padding: 0 5px;
    margin: 0 5px;
}
.wb-ct-button:disabled {
  background-color: rgb(219, 219, 219);
 }
.wb-ct-button:hover:enabled {
  background-color: rgb(250, 250, 250);
 }

`);

});



//
function interceptFetch(url, callback) {
    unsafeWindow.fetch = async (input, options) => {
        const response = await fetch(input, options)

        if (response.url.startsWith("https://www.torn.com/" + url)) {
            let res = response.clone();

            Promise.resolve(res.json().then((json) => callback(json, res.url)));
        }

        return response;
    }
}

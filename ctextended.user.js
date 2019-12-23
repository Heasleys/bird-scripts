// ==UserScript==
// @name         CTMAP - Extended View
// @namespace    Heasleys.ctextended
// @version      0.5
// @description  My weird project to extend the christmas town map viewer
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/ctextended.user.js
// ==/UserScript==



$(window).load(function () {

    var usermap = $('.user-map-container');
    var ctwrap = $('#ct-wrap');
    var buttonmap = $('.user-map');
    var mapoverview = $('.map-overview');
    var textcontainer = $('.status-area-container');
    var itemcontainer = $('.items-container');


    textcontainer.hide();
    usermap.css({"width": "100%","height": "125%"});
    mapoverview.css({"width": usermap.width(),"height": usermap.height()});
    buttonmap.css({"width": usermap.width(),"height": usermap.height()});
    itemcontainer.css({"width": usermap.width()});
    ctwrap.css({"height": "100%"});
    textcontainer.css({"width": usermap.width(),"height": usermap.height(),"position":"absolute"});

    var mapheight = usermap.height();


    usermap.before(`<p id="ct-message">Welcome to Christmas Town!</p>`);


    $('#form').submit(function(){
        alert('I do something before the actual submission');
        return true;
    });


    interceptFetch('christmas_town.php', (response, url) => {
        console.log(response);
        console.log(url);
        if (response.mapData && response.mapData.trigger) {
            $('#ct-message').text(response.mapData.trigger.message);

            if (response.mapData.trigger.miniGameType) {
                console.log("I found a mini game");
                textcontainer.show();
            } else {
                textcontainer.hide();
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
}

.d #ct-wrap.ct-user-wrap .map-overview .world {
  left: 33%;
  top: 25%;
}

.d #ct-wrap .user-map-container .user-map:before {
  background: none;
}

.d #ct-wrap .user-map-container .map-controls {
  //background: url(/images/v2/christmas_town/edge_fade.png) 0 0 no-repeat;
}

.d .map-directions>.direction {
  background: rgba(205, 205, 205, 0.3)
}

.d .map-directions>.direction.south {
  width: 100%;
  top: `+(mapheight-39)+`px;
}

.d .map-directions>.direction.north {
  width: 100%;
}

.d .map-directions>.direction.east {
  height: `+mapheight+`px;
  top: 0;
}

.d .map-directions>.direction.west {
  height: `+mapheight+`px;
  top: 0;
}

.d .map-directions>.direction.east:before {
  top: 50%;
}

.d .map-directions>.direction.west:before {
  top: 50%;
}

.d .map-directions>.direction.north:before {
  left: 50%;
}

.d .map-directions>.direction.south:before {
  left: 50%;
}

.d #ct-wrap .items-container, .d .items-container {
  min-height: 0;
}

.game-start-screen___1Rx4- {
  background: url(/images/v2/christmas_town/minigames/congratulation_bg.jpg) no-repeat;
  background-size: cover !important;
}


`);



});

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

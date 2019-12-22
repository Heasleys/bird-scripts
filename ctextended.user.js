// ==UserScript==
// @name         CTMAP - Extended View
// @namespace    Heasleys.ctextended
// @version      0.1
// @description  My weird project to extend the christmas town map viewer
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/ctextended.user.js
// ==/UserScript==



$(window).load(function () {

    var usermap = $('.user-map-container');
    var buttonmap = $('.user-map');
    var mapoverview = $('.map-overview');



    usermap.css({"width": "100%","height": "125%"});
    mapoverview.css({"width": usermap.width(),"height": usermap.height()});
    buttonmap.css({"width": usermap.width(),"height": usermap.height()});

    var mapheight = usermap.height();

    GM_addStyle(`
.d #ct-wrap.ct-user-wrap .map-overview .world {
  left: 33%;
  top: 25%;
}

.d #ct-wrap .user-map-container .user-map:before {
  background: none;
}

.d #ct-wrap .user-map-container .map-controls {
  background: url(/images/v2/christmas_town/edge_fade.png) 0 0 no-repeat;
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

`);

});

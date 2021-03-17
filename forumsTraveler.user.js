// ==UserScript==
// @name         Forum Traveler
// @namespace    Heasleys.ForumsTraveler
// @version      0.1
// @description  Traverse through all forums by forum id
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/forums.php*
// @grant        GM_addStyle
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/forumsTraveler.user.js
// ==/UserScript==

GM_addStyle(`
div.wb_container {
display: flex;
flex-direction: column;
padding-left: 20px;
}

div.wb_head {
border-bottom: none;
border-radius: 5px 5px 5px 5px;
box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px;
padding: 6px 10px;
background-color: rgb(202, 185, 0);
background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
background-size: 4px;
}

span.wb_title {
color: #ffffff;
font-size: 13px;
letter-spacing: 1px;
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
font-weight: 700;
line-height: 19px;
}

.wb_button {
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
cursor: pointer;
font-weight: 400;
text-transform: none;
position: relative;
text-align: center;
line-height: 1.2;
color: rgb(255, 255, 255);
margin-left: 0.5em;
-webkit-appearance: none;
font-size: 14px;
background-color: rgba(255, 255, 255, 0.15);
box-shadow: rgba(255, 255, 255, 0.5) 0px 1px 1px 0px inset, rgba(0, 0, 0, 0.25) 0px 1px 1px 1px;
padding: 2px 10px;
border-radius: 4px;
border-width: initial;
border-style: none;
border-color: initial;
border-image: initial;
text-decoration: none;
}

.float-right {
float: right;
}
`);

var wb_header = `
<div class="wb_container">
<div class="wb_head"><span class="wb_title">Traverse Forums</span></div>
</div>
`;

(function() {
    'use strict';
    $('.content-wrapper').before(wb_header);
    var url = window.location.toString();
    var forum_id = url.split("=").pop();

    $('.wb_title').append('<span id="wb_buttons" class="float-right"><a id="b1" class="wb_button" href="https://www.torn.com/forums.php#/p=threads&f=44&t='+ (Number(forum_id)-1) +'">Forum: ' + (Number(forum_id)-1) + '</a><a id="b2" class="wb_button" href="https://www.torn.com/forums.php#/p=threads&f=44&t='+ (Number(forum_id)+1) +'">Forum: ' + (Number(forum_id)+1) + '</a></span>');


    window.addEventListener('hashchange',()=>{
        url = window.location.toString();
        console.log(url);

        if (url.includes('&t=')) {
            forum_id = url.split("=").pop();
            if ($('#wb_buttons').length == 0) {

                $('.wb_title').append('<span id="wb_buttons" class="float-right"><a id="b1" class="wb_button" href="https://www.torn.com/forums.php#/p=threads&f=44&t='+ (Number(forum_id)-1) +'">Forum: ' + (Number(forum_id)-1) + '</a><a id="b2" class="wb_button" href="https://www.torn.com/forums.php#/p=threads&f=44&t='+ (Number(forum_id)+1) +'">Forum: ' + (Number(forum_id)+1) + '</a></span>');

            } else {

                $('#b1').attr('href', 'https://www.torn.com/forums.php#/p=threads&f=44&t='+ (Number(forum_id)-1));
                $('#b1').text('Forum: ' + (Number(forum_id)-1));
                $('#b2').attr('href', 'https://www.torn.com/forums.php#/p=threads&f=44&t='+ (Number(forum_id)+1));
                $('#b2').text('Forum: ' + (Number(forum_id)+1));
            }
        }
    });

})();

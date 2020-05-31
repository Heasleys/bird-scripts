// ==UserScript==
// @name         Gambling is bad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Don't gamble.
// @author       You
// @match        https://www.torn.com/casino.php
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('.games-list > li').each(function() {
    if ($(this).find('.title:contains("POKER")').length) {

    } else {
        $(this).remove();
    }
});

    $('.msg.right-round').text("Don't f**king gamble idiot. You always lose money.");
})();

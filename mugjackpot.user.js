// ==UserScript==
// @name         Attack Links on Casino Slots Page
// @namespace    Epic
// @version      0.2
// @description  Quick murder for slot jackpot winner
// @author       Heasleys4hemp
// @match        https://www.torn.com/loader.php?sid=viewSlotsStats
// @grant        none
// ==/UserScript==


    'use strict';

     var observer = new MutationObserver(function(mutations) {
            if ($('ul.cont-gray').length != 0) {
                observer.disconnect();
                dosomeshit();
            }
    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});



function dosomeshit() {
        $('ul.cont-gray').find('li.player').find('a.user').each(function( index ) {
        let href = $(this).attr('href');
        let userid = href.split("=").pop();
        $(this).attr('href', 'https://www.torn.com/loader.php?sid=attack&user2ID=' + userid);
        $(this).attr("target","_blank");
    });
}

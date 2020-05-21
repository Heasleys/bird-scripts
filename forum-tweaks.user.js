// ==UserScript==
// @name         Forum Tweaks
// @namespace    heasleys.forumtweaks
// @version      0.1
// @description  replace small award images with large award images
// @author       Heasleys4hemp[1468764]
// @match        https://www.torn.com/forums.php*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`

.d .forums-thread-wrap .thread-list .column-wrap .poster-wrap {
width: 240px;
}

.d .forums-thread-wrap .poster-wrap .poster {
width: 240px;
}

.d .forums-thread-wrap .info-wrap .status {
width: 240px;
}

`);

var observer = new MutationObserver(function(mutations) {

    if (document.contains(document.querySelector('.poster-wrap'))) {
        observer.disconnect();
        replaceAwardLinks();
    }

});

observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

function replaceAwardLinks() {
    $('img').each(function(){
        let imglink = $(this).attr('src').toString();
        if (imglink.includes('awardimages.torn.com')) {
            imglink = imglink.replace('small', 'large');
            $(this).attr('src', imglink);
        }
    });
}

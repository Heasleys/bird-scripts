// ==UserScript==
// @name         Company Tweaks
// @namespace    Heasleys.companytweaks
// @version      1.1.1
// @description  Fill company stock from last sold, highlight inactive users and users with -20+ addiction
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/companies.php
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// ==/UserScript==

if (location.hash === "#/option=stock") {
    setTimeout(fillStock, 1000);
}

if (location.hash === "#/option=employees") {
    setTimeout(checkInactive, 1000);
}


window.onhashchange = function () {
    if (location.hash === "#/option=stock") {
        setTimeout(fillStock, 1000);
    }

    if (location.hash === "#/option=employees") {
        setTimeout(checkInactive, 1000);
    }
};





function fillStock() {

    $('ul.stock-list > li').each(function() {
        let stockSold = $(this).find('div.sold-daily').text();

        var sold = stockSold.replace(/\D/g, "");

        const num = parseInt(sold);

        let input = $(this).find(".input-money-group > input");

        input.val(num);

    });

}

function checkInactive() {
    $('ul.employee-list > li').each(function() {
        let eff = $(this).find('div.effectiveness');
        if (eff.length != 0) {
            let aria = eff.attr('aria-label');
            let effData = eff.data('multipliers');
            //console.log(effData);
            //console.log(aria);
            if (aria) {
                // If Addiction multiplier is less -20 (bad) turn light red
                if (effData[7] <= -20) {
                    eff.css('background-color', 'rgba(255, 25, 0, 0.25)');
                }
                // If Inactivity is detected in aria-label, turn dark red
                if (aria.includes('Inactivity:')) {
                    eff.css('background-color', 'rgba(255, 25, 0, 0.75)');
                }
            }

        }
    });

}

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

/*
<div class="effectiveness clearfix" tabindex="0" aria-label="Vulture: Working stats: +134; Settled in: +10; Book: +50; Merits: +9; Director education: +12;  Effectiveness: 215; " 
data-multipliers="[134, 10, 50, 9, 12, 0, 0, 0, 0]" data-effectiveness="215" data-pfunds="">
<div class="arrow-999 t-show right"></div>
<p aria-hidden="true" class="desc effectiveness-value t-gray-9 effectiveness-bright-green">215</p>
<ul class="employee-effectiveness">
<li class="active"></li><li class="active"></li><li class="active"></li><li class="active"></li><li class="active"></li> </ul>
</div>

efficiency data = [145, 2, 0, 0, 12, 0, 0, -16, 0]
                  [134, 10, 50, 9, 12, 0, 0, 0, 0]

efficiency[0] = base efficiency from work stats
efficiency[1] = settled in bonus
efficiency[2] = book bonus
efficiency[3] = player merits bonus
efficiency[4] = Director education bonus
efficiency[5] =
efficiency[6] =
efficiency[7] = addiction penalty
efficiency[8] = inactivity penalty??

*/

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

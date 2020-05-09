// ==UserScript==
// @name         Portfolio Tweaks
// @namespace    Heasleys.portfoliotweaks
// @version      0.2
// @description  Adds net change to stocks
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/stockexchange.php?step=portfolio
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('ul.stock-cont > li.item-wrap').each(function() {
        let dir = '';
        let dirclass = '';
        let acro = $(this).data('stock');
        let info_tab = $(this).find('ul > li.info');

        let shares_tab = info_tab.find('div.b-price-wrap > div:contains("Shares:")');
        let shares = parseInt(shares_tab.text().replace(/\D/g,''));

        let length_wrap = info_tab.find('div.length-wrap');

        if (length_wrap.find('span.change.down').length) {dir = '-';}else{dir = '+'}

        let change_tab = length_wrap.find('span.value');
        let change = change_tab.text().split(" ").shift().replace('$','');

        let net = Math.floor(change * shares);

        let qualify_wrap = info_tab.find('div.qualify-wrap');

        if (dir == '-') {dirclass = 'bold change down';}
        if (dir == '+') {dirclass = 'bold change up';}

        let netFormatted = net.toLocaleString('en-US');

        qualify_wrap.append('<div style="float: right;"><span class="bold">Net Change: </span><span class="'+dirclass+'">' + dir + '$' + netFormatted + '</span></div>');


    });
})();

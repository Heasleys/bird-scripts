// ==UserScript==
// @name         Autofill Company Stock
// @namespace    Heasleys.autofillcompanystock
// @version      1.0
// @description  Fill company stock from last sold.
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/companies.php
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// ==/UserScript==

window.onhashchange = function () {
    console.log(location.hash);
    if (location.hash === "#/option=stock") {
        setTimeout(fillStock, 1000);
    }
};

if (location.hash === "#/option=stock") {
    setTimeout(fillStock, 1000);
    }



function fillStock() {
console.log($('ul.stock-list > li'));
    $('ul.stock-list > li').each(function() {
        let stockSold = $(this).find('div.sold-daily').text();

        var sold = stockSold.replace(/\D/g, "");

        const num = parseInt(sold);

        let input = $(this).find(".input-money-group > input");

        input.val(num);

    });

}

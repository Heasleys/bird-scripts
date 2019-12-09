// ==UserScript==
// @name         Bird Market
// @namespace    Heasleys.birdmarket
// @version      0.4.2
// @description  Instabuy/Show Prices in item market
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/imarket.php*
// @grant        none
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/birdmarket.user.js
// ==/UserScript==

$( document ).ajaxComplete(function( event, xhr, settings ) {
 if (settings.url.search("imarket.php") != "-1") {

    $("ul.m-items-list > li").each(function(){
        var li = $(this);
        var minprice = li.find("span.minprice").text();
        li.find(".item-amount.qty").text(minprice);
        });

       $('li.buy > span.buy-link.t-blue').each(function(){
           $(this).parent().html("<a class='yes-buy t-blue h bold' href='#' data-action='buyItemConfirm' data-id='" +  $(this).attr("data-id") + "' data-item='0'><span class='buy-icon'></span></a>");
        });

 }
 });

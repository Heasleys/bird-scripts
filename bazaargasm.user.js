// ==UserScript==
// @name         Bazaargasm
// @namespace    Heasleys.bazaargasm
// @version      0.2
// @description  Automatically sets max items in bazaar based on cash in hand.
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/bazaargasm.user.js
// ==/UserScript==

$( document ).ajaxComplete(function( event, xhr, settings ) {
 if (settings.url.search("bazaar.php") != "-1") {
    $( "span.info" ).each(function() {
        var info = $(this);
        if ($(window).width() <= 1000) {
            fill(info);
        } else {
        $(this).find("button.buy-h").on("click", function(){
            fill(info);
        });
    }
    });
 }//if
});

function fill (info) {
 var price = parseInt(info.find("div.price").text().replace("$", "").replace(/,/g, ""));
    var cash = parseInt($("#user-money").text().replace("$", "").replace(/,/g, ""));
    //console.log("Cash: " + cash);
    //console.log("Price: " + price);
    var amount = Math.floor((cash / price));
    //console.log("Amount: " + amount);
    var instock = parseInt(info.find("span.instock").text().replace(/,/g, ""));
    //console.log("Stock: " + instock);
    if (amount > instock) {
        info.find("input[name='item']").val(instock);
    } else {
        info.find("input[name='item']").val(amount);
    }
}

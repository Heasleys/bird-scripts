// ==UserScript==
// @name         Total Joins
// @namespace    Heasleys.totaljoins
// @version      0.3
// @description  Count total joins and clears for wall wars
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/war.php*
// @grant        none
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/total-joins.user.js
// ==/UserScript==

    function countJoins() {
        var total = 0;
        var num = 0;

        var joins = $('.your-faction').find('.joins');

        joins.each(function(){
            if ($.isNumeric(parseInt($(this).text()))) {
            num = parseInt($(this).text());
            total += num;
        }
        });

        var title = $("span.your").text();
        title += '- Joins: ' + total;
        $("span.your").text(title);
    }

    function countClears() {
        var total = 0;
        var num = 0;

        var clears = $('.enemy-faction').find('.knock-off');

        clears.each(function(){
            if ($.isNumeric(parseInt($(this).text()))) {
            num = parseInt($(this).text());
            total += num;
        }
        });

        var title = $("span.enemy").text();
        title += ' - Clears: ' + total;
        $("span.enemy").text(title);
    }

    countJoins();
    countClears();

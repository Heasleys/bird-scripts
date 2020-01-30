// ==UserScript==
// @name         Total Joins
// @namespace    Heasleys.totaljoins
// @version      0.4
// @description  Count total joins and clears for wall wars
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/war.php*
// @grant        none
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/total-joins.user.js
// ==/UserScript==

    function countFriendly() {
        var totaljoins = 0;
        var totalclears = 0;
        var num = 0;

        var joins = $('.your-faction').find('.joins');

        joins.each(function(){
            if ($.isNumeric(parseInt($(this).text()))) {
            num = parseInt($(this).text());
            totaljoins += num;
        }
        });

        var clears = $('.your-faction').find('.knock-off');

        clears.each(function(){
            if ($.isNumeric(parseInt($(this).text()))) {
            num = parseInt($(this).text());
            totalclears += num;
        }
        });

        var title = $("span.your").text();
        title += '- Joins: ' + totaljoins + ' - Clears: ' + totalclears;
        $("span.your").text(title);
    }




    function countEnemy() {
        var totaljoins = 0;
        var totalclears = 0;
        var num = 0;

        var joins = $('.enemy-faction').find('.joins');

        joins.each(function(){
            if ($.isNumeric(parseInt($(this).text()))) {
            num = parseInt($(this).text());
            totaljoins += num;
        }
        });

        var clears = $('.enemy-faction').find('.knock-off');

        clears.each(function(){
            if ($.isNumeric(parseInt($(this).text()))) {
            num = parseInt($(this).text());
            totalclears += num;
        }
        });

        var title = $("span.enemy").text();
        title += '- Joins: ' + totaljoins + ' - Clears: ' + totalclears;
        $("span.enemy").text(title);
    }

    countFriendly();
    countEnemy();

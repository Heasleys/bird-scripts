// ==UserScript==
// @name         War Reports
// @namespace    Heasleys.WarReports
// @version      1.3.1
// @description  Traverse Wall/Chain Reports + Total Joins for wall reports
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/war.php?step=*
// @grant        GM_addStyle
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/war-reports.user.js
// ==/UserScript==

GM_addStyle(`
div.wb_container {
display: flex;
flex-direction: column;
}

div.wb_head {
border-bottom: none;
border-radius: 5px 5px 5px 5px;
box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px;
padding: 6px 10px;
background-color: rgb(202, 185, 0);
background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
background-size: 4px;
}

span.wb_title {
color: #ffffff;
font-size: 13px;
letter-spacing: 1px;
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
font-weight: 700;
line-height: 19px;
}

.wb_button {
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
cursor: pointer;
font-weight: 400;
text-transform: none;
position: relative;
text-align: center;
line-height: 1.2;
color: rgb(255, 255, 255);
margin-left: 0.5em;
-webkit-appearance: none;
font-size: 14px;
background-color: rgba(255, 255, 255, 0.15);
box-shadow: rgba(255, 255, 255, 0.5) 0px 1px 1px 0px inset, rgba(0, 0, 0, 0.25) 0px 1px 1px 1px;
padding: 2px 10px;
border-radius: 4px;
border-width: initial;
border-style: none;
border-color: initial;
border-image: initial;
text-decoration: none;
}

.float-right {
float: right;
}

ul.members-names-rows li .user-status {
display: none !important;
}
ul.members-names-rows li a.user.faction {
display: none !important;
}
ul.members-names-rows li .t-overflow {
overflow: unset !important;
}

ul.members-names-rows li div.member.icons {
justify-content: left !important;
}
`);

var wb_header = `
<div class="wb_container">
<div class="wb_head"><span class="wb_title">Traverse Wars</span></div>
</div>
`;

(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {

        if (document.contains(document.querySelector('.report-members-stats-content'))) {

            let url = window.location.toString();

            if (url.includes('chainID')) {
                modifyNames();
                observer.disconnect();
            }

            if (url.includes('warID')) {
                countFriendly();
                countEnemy();
                observer.disconnect();
            }

            if (url.includes('raidID')) {
                countFriendly();
                countEnemy();
                observer.disconnect();
            }

            if (url.includes('rankID')) {
             observer.disconnect();
            }
            else {
             observer.disconnect();
            }


            
        }
    });

    var titleObserver = new MutationObserver(function(mutations) {
        if (document.contains(document.querySelector('.content-title'))) {
            $('.content-title').after(wb_header);

            let url = window.location.toString();

            if (url.includes('chainID')) {
                let chain_id = url.split("=").pop();
                $('.wb_title').append('<span class="float-right"><a class="wb_button" href="https://www.torn.com/war.php?step=chainreport&chainID='+ (Number(chain_id)-1) +'">Chain ID: ' + (Number(chain_id)-1) + '</a><a class="wb_button" href="https://www.torn.com/war.php?step=chainreport&chainID='+ (Number(chain_id)+1) +'">Chain ID: ' + (Number(chain_id)+1) + '</a></span>');
                titleObserver.disconnect();
            }

            if (url.includes('warID')) {
                let war_id = url.split("=").pop();
                $('.wb_title').append('<span class="float-right"><a class="wb_button" href="https://www.torn.com/war.php?step=warreport&warID='+ (Number(war_id)-1) +'">War ID: ' + (Number(war_id)-1) + '</a><a class="wb_button" href="https://www.torn.com/war.php?step=warreport&warID='+ (Number(war_id)+1) +'">War ID: ' + (Number(war_id)+1) + '</a></span>');
                titleObserver.disconnect();
            }

            if (url.includes('raidID')) {
                let raid_id = url.split("=").pop();
                $('.wb_title').append('<span class="float-right"><a class="wb_button" href="https://www.torn.com/war.php?step=raidreport&raidID='+ (Number(raid_id)-1) +'">Raid ID: ' + (Number(raid_id)-1) + '</a><a class="wb_button" href="https://www.torn.com/war.php?step=raidreport&raidID='+ (Number(raid_id)+1) +'">Raid ID: ' + (Number(raid_id)+1) + '</a></span>');
                titleObserver.disconnect();
            }

            if (url.includes('rankID')) {
                let rank_id = url.split("=").pop();
                $('.wb_title').append('<span class="float-right"><a class="wb_button" href="https://www.torn.com/war.php?step=rankreport&rankID='+ (Number(rank_id)-1) +'">Rank ID: ' + (Number(rank_id)-1) + '</a><a class="wb_button" href="https://www.torn.com/war.php?step=rankreport&rankID='+ (Number(rank_id)+1) +'">Rank ID: ' + (Number(rank_id)+1) + '</a></span>');
                titleObserver.disconnect();
            }
            else {
                titleObserver.disconnect();
            }
        }
    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    titleObserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

})();

function countFriendly() {
    let totaljoins = 0;
    let totalclears = 0;
    let num = 0;

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
    let faction = $("span.your").text();

    let li = `
<li class="">
<div class="member icons left"><b>`+faction+`</b></div>
<div class="lvl left"></div>
<div class="points left"><b>Totals: </b></div>
<div class="joins left"><b>`+totaljoins+`</b></div>
<div class="knock-off left"><b>`+totalclears+`</b></div>
<div class="clear"></div>
</li>
`;

$('#your-faction').find('ul.members-list').prepend(li);
}




function countEnemy() {
    let totaljoins = 0;
    let totalclears = 0;
    let num = 0;

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
    let faction = $("span.enemy").text();

    let li = `
<li class="">
<div class="member icons left"><b>`+faction+`</b></div>
<div class="lvl left"></div>
<div class="points left"><b>Totals: </b></div>
<div class="joins left"><b>`+totaljoins+`</b></div>
<div class="knock-off left"><b>`+totalclears+`</b></div>
<div class="clear"></div>
</li>
`;

$('#enemy-faction').find('ul.members-list').prepend(li);
}


function modifyNames() {
    $('.members-names-rows > li').each(function(){
       let a = $(this).find('a.user.name');
       let nameid = a.data('placeholder');
        a.find('div').text(nameid);
    });
};

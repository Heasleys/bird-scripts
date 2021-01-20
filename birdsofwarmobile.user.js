// ==UserScript==
// @name         Birds of War
// @namespace    Heasleys.birdsofwar
// @version      0.3.1
// @description  Bird script for real wars - ping for assistance or revives
// @author       Heasleys4hemp ]1468764]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      warbirds.rocks
// ==/UserScript==

const userID = document.cookie
.split('; ')
.find(row => row.startsWith('uid'))
.split('=')[1];
var enemyID = '';

let styles = `

.wb_attack_content {
    background-color: #f1f1f1;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    padding-top: 4px;
    padding-bottom: 4px;
    text-align: center;
}


.wb-attack-request-button {
    background: transparent linear-gradient(180deg,#CCCCCC 0%,#999999 60%,#666666 100%) 0 0 no-repeat;
    cursor: pointer;
    font-family: Arial,sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0;
    color: #333;
    text-shadow: 0 1px 0 #ffffff66;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 10px;
}

.wb-attack-request-button:hover {
   color: #757575;
}

.wb-disabled {
    background: transparent linear-gradient(180deg,#999999 0%,#CCCCCC 100%) 0 0 no-repeat;
    cursor: not-allowed;
    color: #777;
    box-shadow: 0 1px 0 #ffffffa6;
    text-shadow: 0 -1px 0 #ffffff66;
}

.wb-attack-span {
    margin-left: 10px;
}

.wb-attack-request-button.success {
    color: #798c3d;
    text-shadow: none;
    text-transform: uppercase;
}

.wb-sidebar-link.success {
    color: #798c3d;
    font-size: 11px;
    padding-left: 5px;
}

.success:hover {
    color: #798c3d;
}

.wb-attack-request-button.fail {
    color: #c30;
    text-shadow: none;
    text-transform: uppercase;
}

.wb-sidebar-link.fail {
    color: #c30;
    font-size: 11px;
    padding-left: 5px;
}

.fail:hover {
    color: #c30;
}

header.wb-sidebar-header {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    user-select: none;
    font-size: 12px;
    font-weight: 700;
    line-height: 22px;
    height: 22px;
    color: rgb(255, 255, 255);
    text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
    background-color: rgb(202, 185, 0);
    background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
    background-size: 4px;
    margin: 0px;
    padding-left: 10px;
}

.wb-sidebar-link {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    margin-top: 2px;
    margin-bottom: 2px;
    color: rgb(51, 51, 51);
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
    overflow: hidden;
    padding-left: 10px;
    width: 100%;
    height: 23px;
    text-align: left;
}

.wb-sidebar-link:hover {
   background-color: rgb(250, 250, 250);
}

.wb-sidebar-link-disabled {
    cursor: not-allowed;
    background-color: rgb(219, 219, 219);
    color: rgb(51 51 51 / 25%);
}

.wb-sidebar-link-mobile {
    border-radius: 5px;
    cursor: pointer;
    background-color: rgb(228, 228, 228);
    margin-top: 1px;
    margin-left: 5px;
    color: rgb(51, 51, 51);
    line-height: 23px;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid rgb(255, 255, 255);
    text-decoration: none;
    overflow: hidden;
    padding: 0px 10px;
    width: 20%;
}

`;



GM_addStyle(styles);

$(document).ready(function() {

    var assistElement = $('<div class="wb_attack_content"><button id="attackRequest" class="wb-attack-request-button" type="button" value="attack">Request Assistance</button><span class="wb-attack-span success" hidden></span></div>');
    var reviveElement = $('<div><header class="wb-sidebar-header"><span>Birds of War</span></header><button id="reviveRequest" class="wb-sidebar-link" type="button" value="revive">Request Revive</button></div>');

    var reviveMobileElement = $('<div><form id="reviveRequest"><input class="wb-sidebar-link-mobile" type="submit" value="Revive"></form></div>'); //broken





    var observer = new MutationObserver(function(mutations) {

        let urlCheck = window.location.href;

        //check if attack window
        if (urlCheck.indexOf("loader.php?sid=attack") > 0) {
            enemyID = urlCheck.split('=')[2].replace(/\D/g, "");
            console.log(enemyID);
            if (document.contains(document.querySelector('div.logStatsWrap___a4Wrt'))) {
                $('div.logStatsWrap___a4Wrt').first().before(assistElement);
                observer.disconnect();
            }
        } else {
            //if not attack window, add revive sidebar
            if (document.contains(document.querySelector('div.sidebar-block___181mP'))) {

                if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    $('.user-information-mobile___2RodB').first().after(reviveMobileElement);
                    observer.disconnect();
                } else {
                    $('div.sidebar-block___181mP').first().after(reviveElement);
                    observer.disconnect();
                }

            }
        }

    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});



    function sendRequest(type, enemyID, element) {
        console.log("Sending request...");


        let request = 'type='+type+'&user='+userID+'&enemy='+enemyID;
        var url = 'https://warbirds.rocks/dev/process/warRequest.php';
        GM.xmlHttpRequest({
            url: url,
            method: "POST",
            data: request,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            onload: function(response) {
                console.log(response.response);
                element.html(response.response);
                if (response.response.includes("successfully")) {
                    element.addClass("success");
                } else {
                    element.addClass("fail");
                }
            }
        });


    }


    $(document).on('click', '#reviveRequest', function(event){
        event.preventDefault();
        event.stopPropagation();

        $(this).toggleClass("wb-sidebar-link-disabled");
        $(this).prop('disabled',true);
        var val = $(this).html();
        $(this).html("Requesting Revive...");

        sendRequest('revive', '1', $(this));

        setTimeout(function(){$('#reviveRequest').removeClass("wb-sidebar-link-disabled success fail");$('#reviveRequest').prop('disabled',false); $('#reviveRequest').html(val); }, 5000);
    });



        $(document).on('click', '#attackRequest', function(event){
        event.preventDefault();
        event.stopPropagation();

        $(this).toggleClass("wb-disabled");
        $(this).prop('disabled',true);
        var val = $(this).html();
        $(this).html("Requesting Assistance...");

        sendRequest('attack', enemyID, $(this));

        setTimeout(function(){$('#attackRequest').removeClass("wb-disabled success fail");$('#attackRequest').prop('disabled',false); $('#attackRequest').html(val); }, 5000);
    });

});

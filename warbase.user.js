// ==UserScript==
// @name         Warbirds Warbase
// @namespace    https://github.com/Heasleys/bird-scripts/raw/master/warbase.user.js
// @version      0.5.1
// @description  Adds time to claim for territories, attack links in new tab, removes animation because it lags my chromebook
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/warbase.user.js
// ==/UserScript==
var styles = `
.wb-war-span {
    padding-left: 11px;
    padding-right: 5px;
    color: #888;
}

.wb-war-info {
    color: black;
}`;

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);



window.addEventListener('load', function() {
function addWarInfo() {
    $("div.status-wrap").each(function() {
        let war_id = "";
        var href = $(this).children("a").attr("href");
        if (href == "#/") {
            let url = window.location.toString();
            if (url.includes("war/")) {
                war_id = url.split("/").pop();
            }
        } else {
        war_id = href.split("/").pop();
        }
        $(this).find("div.name.clearfix").after( `<span class="wb-war-span">Claim in: </span><span class="wb-war-info" id="`+war_id+`">Loading...</span>` );
    });
}

addWarInfo();
function interceptFetch(url,q, callback) {
    var originalFetch = fetch;
    fetch = function() {
        return originalFetch.apply(this, arguments).then(function(data) {
            let dataurl = data.url.toString();
            if (dataurl.includes(url) && dataurl.includes(q)) {
               const clone = data.clone();
               clone.json().then((response) => callback(response, data.url));
            }
            return data;
        });
    };
}

    interceptFetch("faction_wars.php","step=getwardata", (response, url) => {
        $('li.enemy > div.attack.left > a').attr("target","_blank");
        $('li.row-animation').removeClass('row-animation');
        $.each(response.wars,function(index, value){
            if (index == 0) {return;}
            var time = "";
            var seconds = 0;

            if ((value.myFaction.membersQuantity - value.enemyFaction.membersQuantity) > 0) {
                seconds = Math.round((value.maxPoints - value.score) / (value.myFaction.membersQuantity - value.enemyFaction.membersQuantity));
                var numdays = Math.floor((seconds % 31536000) / 86400);
                var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
                var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
                var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
                if (numdays > 0) {time+=numdays + " days "; numseconds = 0;}
                if (numhours > 0) {time+=numhours + " hours "}
                if (numminutes > 0) {time+=numminutes + " minutes "}
                if (numseconds > 0) {time+=numseconds + " seconds"}
            } else {time = "Never";}



            $("span#"+value.key).text(time);
        });

    });


}, false);

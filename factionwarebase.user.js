// ==UserScript==
// @name         Faction Warbase
// @namespace    Heasleys.factionwarbase
// @version      1.0
// @description  Save other factions chains/walls to view later
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/factions.php?step=profile*
// @grant        none
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/factionwarbase.user.js
// ==/UserScript==
var warreports = JSON.parse(localStorage.getItem('wb_war_reports')) || {};
var CHAIN_LIMIT = localStorage.getItem('wb_war_reports_chain_limit') || '100';
var faction = '';
var styles = `div.wb_container{margin-top:10px;display:flex;flex-direction:column}div.wb_head{border-bottom:none;border-radius:5px 5px 5px 5px;box-shadow:rgba(0,0,0,.25) 0 1px 3px;padding:6px 10px;background-color:#cab900;background-image:linear-gradient(90deg,transparent 50%,rgba(0,0,0,.07) 0);background-size:4px;cursor:pointer}div.wb_head.expanded{border-bottom:none;border-radius:5px 5px 0 0}span.wb_title{color:#fff;font-size:13px;letter-spacing:1px;text-shadow:rgba(0,0,0,.65) 1px 1px 2px;font-weight:700;line-height:16px}.wb_content{background-color:#f2f2f2;border:1px solid rgba(0,0,0,.5);border-radius:0 0 5px 5px;border-top:none}.wb_row{display:flex;margin:.75em;justify-content:space-between}.wb_col{margin-left:20px;margin-right:20px}.wb_col>p{font-weight:700;font-size:16px;border-bottom:1px solid #363636;margin-bottom:3px;padding-bottom:2px}.wb_col input{vertical-align:middle}.wb_button{text-shadow:rgba(0,0,0,.65) 1px 1px 2px;cursor:pointer;font-weight:400;text-transform:none;position:relative;text-align:center;line-height:1.2;color:#fff;margin-left:.5em;-webkit-appearance:none;font-size:14px;background-color:rgba(255,255,255,.15);box-shadow:rgba(255,255,255,.5) 0 1px 1px 0 inset,rgba(0,0,0,.25) 0 1px 1px 1px;padding:2px 10px;border-radius:4px;border-width:initial;border-style:none;border-color:initial;border-image:initial;text-decoration:none}.float-right{float:right}span.wb_icon{align-items:center;justify-content:center;width:16px;float:right}span.wb_icon svg{display:block;height:16px;fill:#fff;cursor:pointer;margin-left:auto;margin-right:auto}.wb_input{width:118px;height:23px;border-radius:5px;border:1px solid rgba(0,0,0,.5);padding:0 4px 0 10px}.d .f-war-list.war-new .row-animation.to-right{-webkit-animation:none!important;animation:none!important}.d .f-war-list.war-new .row-animation.to-left{-webkit-animation:none!important;animation:none!important}.d .f-war-list.war-new .row-animation{background-image:none!important;background-position:0 0!important;background-repeat:no-repeat!important}.d .faction-info-wrap.another-faction .f-war-list .member-list.info-members>li .member-icons,.d .faction-info-wrap.another-faction .f-war-list .title>li.member-icons{width:203px!important}.d .faction-info-wrap.another-faction .f-war-list .title>li.act{display:block!important;padding-left:5px!important}.d .f-war-list.war-new .faction-war .tab-menu-cont .members-cont.profile-mode .user-icons{width:256px}.d .f-war-list.war-new .faction-war .tab-menu-cont .members-cont.profile-mode .attack{display:block!important}.d .f-war-list.war-new .faction-war .tab-menu-cont .members-cont.profile-mode .attack{display:block!important}`;
// ^ minified version of below v
/*
div.wb_container {
margin-top: 10px;
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
cursor: pointer;
}
div.wb_head.expanded {
border-bottom: none;
border-radius: 5px 5px 0px 0px;
}
span.wb_title {
color: #ffffff;
font-size: 13px;
letter-spacing: 1px;
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
font-weight: 700;
line-height: 16px;
}
.wb_content {
background-color: #F2F2F2;
border: 1px solid rgba(0, 0, 0, .5);
border-radius: 0px 0px 5px 5px;
border-top: none;
}
.wb_row {
display: flex;
margin: 0.75em;
justify-content: space-between;
}
.wb_col {
margin-left: 20px;
margin-right: 20px;
}
.wb_col > p {
font-weight: bold;
font-size: 16px;
border-bottom: 1px solid #363636;
margin-bottom: 3px;
padding-bottom: 2px;
}
.wb_col input {
vertical-align: middle;
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
span.wb_icon {
align-items: center;
justify-content: center;
width: 16px;
float: right;
}
span.wb_icon svg {
display: block;
height: 16px;
fill: white;
cursor: pointer;
margin-left: auto;
margin-right: auto;
}
.wb_input {
width: 118px;
height: 23px;
border-radius: 5px;
border: 1px solid rgba(0, 0, 0, .5);
padding: 0 4px 0 10px;
}
//remove animations on wall wars for less lag
.d .f-war-list.war-new .row-animation.to-right {
-webkit-animation: none !important;
animation: none !important;
}
.d .f-war-list.war-new .row-animation.to-left {
-webkit-animation: none !important;
animation: none !important;
}
.d .f-war-list.war-new .row-animation {
background-image: none !important;
background-position: 0px 0px !important;
background-repeat: no-repeat !important;
//add attack links to faction page
.d .faction-info-wrap .f-war-list .title>li.member-icons, .d .faction-info-wrap .f-war-list .member-list.info-members>li .member-icons {
width: 203px !important;
}
.d .faction-info-wrap.another-faction .f-war-list .title>li.member-icons, .d .faction-info-wrap.another-faction .f-war-list .member-list.info-members>li .member-icons {
width: 203px !important;
}
.d .faction-info-wrap.another-faction .f-war-list .title>li.act {
display: block !important;
padding-left: 5px !important;
}
.d .f-war-list.war-new .faction-war .tab-menu-cont .members-cont.profile-mode .user-icons {
width: 256px;
}
.d .f-war-list.war-new .faction-war .tab-menu-cont .members-cont.profile-mode .attack {
display: block !important;
}
.d .f-war-list.war-new .faction-war .tab-menu-cont .members-cont.profile-mode .attack {
display: block !important;
}
*/

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

window.addEventListener('load', function() {

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

    var observer = new MutationObserver(function(mutations) {
        if (document.contains(document.getElementById('war-react-root')) && document.contains(document.querySelector('.faction-info'))) {
            observer.disconnect();
            faction = $('.faction-info').data('faction');
            insertHeader();
            updateSelects();
        }
    });
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});


    interceptFetch("faction_wars.php","step=getwardata", (response, url) => {
        const wardata = response;

        let tempreports = JSON.parse(JSON.stringify(warreports));

        let fid = wardata.factionID;

        if (!warreports[fid]) {
            warreports[fid] = {
                'factionID' : fid,
                'factionChains' : {},
                'factionWalls' : {}
            };
        }

        if (wardata.wars[0].data.chain.ID && wardata.wars[0].data.chain.chain >= CHAIN_LIMIT) {
            let chainID = wardata.wars[0].data.chain.ID;
            if (!warreports[fid]['factionChains'][chainID]) {
                warreports[fid]['factionChains'][chainID] = {
                    'chainID' : chainID,
                    'chainLink' : '/war.php?step=chainreport&chainID='+chainID,
                    'startDate' : wardata.wars[0].data.chain.start
                }
            }
        }

        if (Object.keys( wardata.wars ).length > 1) {
            for (let i = 1; i < Object.keys(wardata.wars).length; i++) {
                if (wardata.wars[i].warID) {
                    let wallID = wardata.wars[i].warID;
                    if (!warreports[fid]['factionWalls'][wallID]) {
                        warreports[fid]['factionWalls'][wallID] = {
                            'wallID' : wallID,
                            'wallLink' : '/war.php?step=warreport&warID='+wallID,
                            'enemyID' : wardata.wars[i].enemyFaction.factionID,
                            'enemyName' : wardata.wars[i].enemyFaction.factionName,
                            'startDate' : wardata.wars[i].startDate
                        }
                    }
                }
            }
        }

        if (JSON.stringify(warreports) != JSON.stringify(tempreports)) {
            localStorage.setItem("wb_war_reports", JSON.stringify(warreports));
            warreports = JSON.parse(JSON.stringify(warreports));
            updateSelects();
        }

    });


    function updateSelects() {
        let chainstring = "";
        let wallstring = "";
        if (warreports[faction]) {
            if (Object.keys( warreports[faction].factionChains ).length > 0) {
                $.when(
                    $.each(warreports[faction].factionChains, function(index,element) {
                        let date = new Date(element.startDate).toDateString();
                        chainstring += '<option value="'+index+'" data-href="'+element.chainLink+'">['+index+'] '+date+'</option>';
                    })
                ).then(function() {
                    $("#war_chains").append(chainstring);
                });

            }
            if (Object.keys( warreports[faction].factionWalls ).length > 0) {
                $.when(
                    $.each(warreports[faction].factionWalls, function(index,element) {
                        let date = new Date(element.startDate).toDateString();
                        wallstring += '<option value="'+index+'" data-href="'+element.wallLink+'">['+index+'] '+date+' vs. '+element.enemyName+'['+element.enemyID+']</option>';
                    })
                ).then(function() {
                    $("#war_walls").append(wallstring);
                });

            }
        }
    }

    function insertHeader() {
        document.getElementById('war-react-root').insertAdjacentHTML('afterend', `
<hr class="delimiter-999 m-top10">
<div class="wb_container">
<div class="wb_head">
<span class="wb_title">Warbase</span>
<span class="wb_icon" id="wb_svg_right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon" id="wb_svg_down" hidden><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
<div class="wb_content" hidden>
<div class="wb_row">
<div class="wb_col">
<p>Faction Chains</p>
<select class="wb_input" id="war_chains"><option selected></option></select>
</div>
<div class="wb_col">
<p>Faction Walls</p>
<select class="wb_input" id="war_walls"><option selected></option></select>
</div>
</div>
</div>
</div>
`);

        $(".wb_head").click(function() {
            $(this).toggleClass("expanded");
            $(".wb_content").slideToggle("slow");

            if (!$("#wb_svg_right").is(':visible')) {
                $("#wb_svg_right").attr("hidden",false);
                $("#wb_svg_down").attr("hidden",true);
            } else {
                $("#wb_svg_right").attr("hidden",true);
                $("#wb_svg_down").attr("hidden",false);
            }
        });

        $("#war_chains").change(function(){
            if ($('option:selected', this).data('href')) {
                let href = $('option:selected', this).data('href');
                window.open(href, '_blank');
            }
        });

        $("#war_walls").change(function(){
            if ($('option:selected', this).data('href')) {
                let href = $('option:selected', this).data('href');
                window.open(href, '_blank');
            }
        });


    }
}, false);

(function() {
    'use strict';
    //ADD ATTACK LINKS TO FACTION PAGE
    $("ul.title.title-black.top-round > li.act").text("Attack");
    $("ul.member-list.info-members").children("li").each(function() {

        var href = $(this).find("a.user.name").attr("href");
        var href_id = href.split("=").pop();

        let attack_element = $(`<div class="act-cont" style="display: block;">
<a href="/loader.php?sid=attack&user2ID=` + href_id + `" class="attack t-blue h">Attack</a>
</div>`);

        $(this).children("div.member.icons").after(attack_element);

    });
})();

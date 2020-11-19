// ==UserScript==
// @name         Faction Warbase
// @namespace    Heasleys.factionwarbase
// @version      1.2.0
// @description  Save other factions chains/walls to view later
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/factions.php?step=profile*
// @match        https://www.torn.com/preferences.php*
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @connect      warbirds.rocks
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/factionwarbase.user.js
// ==/UserScript==
let $ = unsafeWindow.$;
var warreports = JSON.parse(localStorage.getItem('wb_war_reports')) || {};
var CHAIN_LIMIT = localStorage.getItem('wb_war_reports_chain_limit') || '100';
var faction = '';
var faction_name = '';
const userID = document.cookie
.split('; ')
.find(row => row.startsWith('uid'))
.split('=')[1];

GM_addStyle(`
div.wb_container {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
}
div.wb_head {
    border-bottom: none;
    border-radius: 5px 5px 5px 5px;
    box-shadow: rgba(0, 0, 0, 0.25) 0 1px 3px;
    padding: 6px 10px;
    background-color: #cab900;
    background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0);
    background-size: 4px;
    cursor: pointer;
}
div.wb_head.expanded {
    border-bottom: none;
    border-radius: 5px 5px 0 0;
}
span.wb_title {
    color: #fff;
    font-size: 13px;
    letter-spacing: 1px;
    text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
    font-weight: 700;
    line-height: 16px;
}
span.wb_success {
color: #478807;
text-shadow: none;
font-weight: 800;
}
.wb_content {
    background-color: #f2f2f2;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 0 0 5px 5px;
    border-top: none;
}
.wb_row {
    display: flex;
    margin: 0.75em;
    justify-content: space-evenly;
}
.wb_col {
    margin-left: 20px;
    margin-right: 20px;
}
.wb_col > p {
    font-weight: 700;
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
    color: #fff;
    margin-left: 0.5em;
    -webkit-appearance: none;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: rgba(255, 255, 255, 0.5) 0 1px 1px 0 inset, rgba(0, 0, 0, 0.25) 0 1px 1px 1px;
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
}
span.wb_icon.right {
float: right;
}
span.wb_icon.left {
float: left;
}
span.wb_icon svg {
display: block;
height: 16px;
cursor: pointer;
margin-left: auto;
margin-right: auto;
}
span.wb_icon svg.white {
fill: white;
}
span.wb_icon svg.black {
fill: black;
}
.wb_input {
    width: 118px;
    height: 23px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 0 4px 0 10px;
}
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
    background-position: 0 0 !important;
    background-repeat: no-repeat !important;
}

.wb-war-span {
    padding-left: 11px;
    padding-right: 5px;
    color: #888;
}

.wb-war-info {
    color: black;
}
`);


window.addEventListener('load', function() {

    function interceptFetch(url,q, callback) {
        var originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function() {
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

        if (window.location.pathname == "/factions.php" && window.location.search.includes("?step=profile") ) {
            if (document.contains(document.getElementById('war-react-root')) && document.contains(document.querySelector('.faction-info'))) {
                observer.disconnect();
                faction = $('div.faction-info').data('faction');
                faction_name = $('div.faction-info').data('name');
                insertHeader();
                updateSelects(faction);
            }
        }

        if (window.location.pathname == "/preferences.php") {
            if (document.contains(document.querySelector('.preferences-container'))) {
                observer.disconnect();
                insertSettings();
            }
        }
    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});


    interceptFetch("faction_wars.php","step=getwardata", (response, url) => {
        console.log(response);
        modifyWars(response);
        const wardata = response;
        let tempreports = JSON.parse(JSON.stringify(warreports));

        let fid = wardata.factionID;

        if (!warreports[fid]) {
            warreports[fid] = {
                'factionID' : fid,
                'factionChains' : {},
                'factionWalls' : {},
                'factionRaids' : {},
                'factionName' : faction_name
            };
        } else {
            if (!warreports[fid]['factionChains']) {
                warreports[fid]['factionChains'] = {};
            }
            if (!warreports[fid]['factionWalls']) {
                warreports[fid]['factionWalls'] = {};
            }
            if (!warreports[fid]['factionRaids']) {
                warreports[fid]['factionRaids'] = {};
            }
            if (!warreports[fid]['factionName']) {
                warreports[fid]['factionName'] = faction_name;
            }
            if (warreports[fid]['factionName'] && warreports[fid]['factionName'] != faction_name) {
                warreports[fid]['factionName'] = faction_name;
            }
        }

        if (Object.keys( wardata.wars ).length > 0) {
            for (let i = 0; i < Object.keys(wardata.wars).length; i++) {
                if (wardata.wars[i].data && wardata.wars[i].data.chain && wardata.wars[i].data.chain.ID && wardata.wars[i].data.chain.chain >= CHAIN_LIMIT) {
                    let chainID = wardata.wars[0].data.chain.ID;
                    if (!warreports[fid]['factionChains'][chainID]) {
                        warreports[fid]['factionChains'][chainID] = {
                            'chainID' : chainID,
                            'chainLink' : '/war.php?step=chainreport&chainID='+chainID,
                            'startDate' : wardata.wars[0].data.chain.start
                        }

                        uploadChainID(fid, chainID);
                    }
                }
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
                if (wardata.wars[i].ID) {
                    let raidID = wardata.wars[i].ID;
                    if (!warreports[fid]['factionRaids'][raidID]) {
                        warreports[fid]['factionRaids'][raidID] = {
                            'raidID' : raidID,
                            'raidLink' : '/war.php?step=raidreport&raidID='+raidID,
                            'enemyID' : wardata.wars[i].enemyFaction.ID,
                            'enemyName' : wardata.wars[i].enemyFaction.factionName,
                            'startDate' : (wardata.wars[i].start * 1000)
                        }
                    }
                }
            }
        }

        if (JSON.stringify(warreports) != JSON.stringify(tempreports)) {
            localStorage.setItem("wb_war_reports", JSON.stringify(warreports));
            warreports = JSON.parse(JSON.stringify(warreports));
            updateSelects(faction);
        }

    });


    function updateSelects(factionID) {
        let chainstring = "<option selected></option>";
        let wallstring = "<option selected></option>";
        let raidstring = "<option selected></option>";
        $("#war_chains").empty();
        $("#war_walls").empty();
        $("#war_raids").empty();
        if (warreports[factionID]) {
            if (Object.keys( warreports[factionID].factionChains ).length > 0) {
                $.when(
                    $.each(warreports[factionID].factionChains, function(index,element) {
                        let date = new Date(element.startDate).toDateString();
                        chainstring += '<option value="'+index+'" data-href="'+element.chainLink+'">['+index+'] '+date+'</option>';
                    })
                ).then(function() {
                    $("#war_chains").append(chainstring);
                });
            }
            if (Object.keys( warreports[factionID].factionWalls ).length > 0) {
                $.when(
                    $.each(warreports[factionID].factionWalls, function(index,element) {
                        let date = new Date(element.startDate).toDateString();
                        wallstring += '<option value="'+index+'" data-href="'+element.wallLink+'">['+index+'] '+date+' vs. '+element.enemyName+'['+element.enemyID+']</option>';
                    })
                ).then(function() {
                    $("#war_walls").append(wallstring);
                });
            }
            if (warreports[factionID]['factionRaids'] && Object.keys( warreports[factionID].factionRaids ).length > 0) {
                $.when(
                    $.each(warreports[factionID].factionRaids, function(index,element) {
                        let date = new Date(element.startDate).toDateString();
                        raidstring += '<option value="'+index+'" data-href="'+element.raidLink+'">['+index+'] '+date+' vs. '+element.enemyName+'['+element.enemyID+']</option>';
                    })
                ).then(function() {
                    $("#war_raids").append(raidstring);
                });
            }
        }
    }

    function modifyWars(response) {

        $.each(response.wars,function(index, value){

            if (!value.type) {return};

            if (value.type == "chain") {
                let chainID = value.data.chain.ID;
                let chainStart = parseInt(value.data.chain.start);
                chainStart = (chainStart / 1000);
                let time = (Math.round((Date.now()/1000)) - chainStart);
                let readableTime = secondsToText(time);

                let chainBox = $("div.chain-box").find("span.chain-box-title");
                let text = "Chain active: " + readableTime;
                chainBox.text(text);

            }

            if (value.type == "raid") {


            }

            if (value.type == "territory") {


            }
        });


    }

    function uploadChainID(factionID, chainID) {
        var url = 'https://warbirds.rocks/process/uploadChainID.php?userID='+userID+'&factionID='+factionID+'&chainID='+chainID;

        GM.xmlHttpRequest({
            url: url,
            type: "GET",
            processData: false,
            dataType: 'json',
            success: function(data) {
                console.log(data);
            }
        });
    }

    function loadFactionList() {
        var list = '<option selected></option>';
        if (Object.keys(warreports).length > 0) {
            $.when(
                $.each(warreports, function(index,element) {
                    list += '<option value="'+index+'" data-name="'+element.factionName+'">'+element.factionName+' ['+index+']</option>';
                })
            ).then(function() {
                $("#factions_list").empty();
                $("#factions_list").append(list);
            });
        }
    }

    function insertHeader() {
        document.getElementById('war-react-root').insertAdjacentHTML('afterend', `
<hr class="delimiter-999 m-top10">
<div class="wb_container">
<div class="wb_head">
<span class="wb_title">Faction Warbase</span>
<span class="wb_icon right" id="wb_svg_right"><svg class="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon right" id="wb_svg_down" hidden><svg class="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
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
<div class="wb_col">
<p>Faction Raids</p>
<select class="wb_input" id="war_raids"><option selected></option></select>
</div>
</div>
</div>
</div>
`);

        $(".wb_head").click(function() {
            $(this).toggleClass("expanded");
            $(".wb_content").slideToggle("fast");

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

        $("#war_raids").change(function(){
            if ($('option:selected', this).data('href')) {
                let href = $('option:selected', this).data('href');
                window.open(href, '_blank');
            }
        });

    }



    function insertSettings() {
        document.querySelector('.preferences-container').insertAdjacentHTML('afterend', `
<hr class="delimiter-999 m-top10">
<div class="wb_container">
<div class="wb_head">
<span class="wb_title">Faction Warbase Settings</span><span class="wb_success" hidden> - Data successfully uploaded.</span>
<span class="wb_icon right" id="wb_svg_right"><svg class="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon right" id="wb_svg_down" hidden><svg class="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
<div class="wb_content" hidden>
<div class="wb_row">
<div class="wb_col" align="center">
<p>Factions</p>
<select class="wb_input" id="factions_list"><option selected></option></select>
</div>
</div>
<div class="wb_row" id="wb_wars">
<div class="wb_col">
<p>Faction Chains<span class="wb_icon right" id="wb_refresh_chain"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M9 13.5c-2.49 0-4.5-2.01-4.5-4.5S6.51 4.5 9 4.5c1.24 0 2.36.52 3.17 1.33L10 8h5V3l-1.76 1.76C12.15 3.68 10.66 3 9 3 5.69 3 3.01 5.69 3.01 9S5.69 15 9 15c2.97 0 5.43-2.16 5.9-5h-1.52c-.46 2-2.24 3.5-4.38 3.5z"/></svg></span></p>
<select class="wb_input" id="war_chains"><option selected></option></select>
</div>
<div class="wb_col">
<p>Faction Walls</p>
<select class="wb_input" id="war_walls"><option selected></option></select>
</div>
<div class="wb_col">
<p>Faction Raids</p>
<select class="wb_input" id="war_raids"><option selected></option></select>
</div>
</div>
</div>
</div>
`);

        if (warreports != '') {
            loadFactionList();
        }
        $("#wb_wars").hide();

        $("#factions_list").change(function(){
            if ($('option:selected', this).val()) {
                let id = $(this).val();
                faction = id;
                let name = $(this).data("name");
                if (id != "") {
                    updateSelects(id);
                    $('#wb_wars').show();
                }
            } else {
                $('#wb_wars').hide();
            }
        });

        $("#wb_refresh_chain").click(function(e) {
            e.stopPropagation();
            if (warreports[faction]) {
                if (Object.keys( warreports[faction].factionChains ).length > 0) {
                    $.when(
                        $.each(warreports[faction].factionChains, function(i,e) {
                            uploadChainID(faction,i);
                        })
                    ).then(function() {
                        $(".wb_success").fadeToggle(100).delay(3000).fadeToggle(1000)
                    });
                }
            }
        });

        $(".wb_head").click(function() {
            $(this).toggleClass("expanded");
            $(".wb_content").slideToggle("fast");

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

        $("#war_raids").change(function(){
            if ($('option:selected', this).data('href')) {
                let href = $('option:selected', this).data('href');
                window.open(href, '_blank');
            }
        });
    }

    function secondsToText(seconds) {
        let time = "";
        let numdays = Math.floor((seconds % 31536000) / 86400);
        let numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        let numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        if (numdays > 0) {time+=numdays + " days "; numseconds = 0;}
        if (numhours > 0) {time+=numhours + " hours "}
        if (numminutes > 0) {time+=numminutes + " minutes "}
        if (numseconds > 0) {time+=numseconds + " seconds"}

        return time;
    }
}, false);

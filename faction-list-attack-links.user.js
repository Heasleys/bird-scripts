// ==UserScript==
// @name         Faction List Attack Links
// @namespace    Heasleys4hemp.attackLinks
// @version      1.0.1
// @description  Adds attack links to faction list
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/factions.php?step=profile&*ID=*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle(`
    .d .faction-info-wrap.another-faction .f-war-list .title>li.member-icons, .d .faction-info-wrap.another-faction .f-war-list .member-list.info-members>li .member-icons {
    width: 203px !important;
}

.d .faction-info-wrap.another-faction .f-war-list .title>li.act {
    display: block !important;
    padding-left: 5px !important;
}
`);

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

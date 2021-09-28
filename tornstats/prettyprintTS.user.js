// ==UserScript==
// @name         Pretty Print TornStats API
// @namespace    heasleys.prettyprintTS
// @version      1.0
// @description  Changes the API response on TornStats to pretty print
// @author       You
// @match        https://www.tornstats.com/api/v*
// @icon         https://www.google.com/s2/favicons?domain=tornstats.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var element = document.getElementsByTagName("pre")[0]
    var jsonstr = element.innerText || element.textContent;
    let obj = JSON.parse(jsonstr);
    let newstr = JSON.stringify(obj, null, 2);

    element.innerHTML = newstr;
})();

// ==UserScript==
// @name         Intercept Fetch
// @namespace    https://github.com/Heasleys/bird-scripts/blob/master/InterceptFetch.user.js
// @version      1.0.1
// @description  Different ways to intercept fetches/ajax requests on Torn
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/*
// @grant        none
// ==/UserScript==


(function () {
    jQuery.ajaxSetup({
        dataFilter: function (data, type) {
            console.log(data);
            return data;
        }
    });


    $( document ).ajaxComplete(function( event, request, settings ) {
        console.log(request.responseText);
    });


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

    interceptFetch("torn.com","torn.com", (response, url) => {
     console.log("Found a fetch from: " + url);
     console.log(response);
    });

})();

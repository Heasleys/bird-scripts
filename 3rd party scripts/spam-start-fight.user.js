// ==UserScript==
// @name        spam-start-fight
// @namespace   seintz.torn.spam-start-fight
// @version     1.43
// @description spam button to start fight asap
// @author      seintz [2460991], Tuxington [2571279]
// @license     GNU GPLv3
// @run-at      document-start
// @match       https://www.torn.com/loader.php?sid=attack*
// @grant       none
// ==/UserScript==

var objForStorage = {};
function waitForKeyElements(element, callbackFunc) {
  objForStorage[element] = setInterval(function () {
    let node = document.querySelector(element);
    if (node) {
      clearInterval(objForStorage[element]);
      callbackFunc(node);
    }
  }, 200);
}
 
function addSpam(node) {
  node.insertAdjacentElement(
    "beforeBegin",
    Object.assign(document.createElement("button"), {
      id: `spamButt`,
      classList: "torn-btn",
      innerText: "spam",
    })
  );
 
  document.getElementById("spamButt").addEventListener("click", async () => {
    document.getElementById("spamButt").disabled = true;
    const url = window.location.href;
    const x = url.indexOf("ID=");
    const ID = url.substring(x + 3, url.length);
    const step = `step=startFight&user2ID=${ID}`;
    const turn = await fetch("/loader.php?sid=attackData&mode=json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
      },
      body: step,
    }).then(async function (response) {
      let body = await response.json();
      document.getElementById("spamButt").disabled = false;
    });
  });
}
 
waitForKeyElements('div[class^="bottomSection"]', addSpam);

// ==UserScript==
// @name        intercept-link
// @namespace   seintz.torn.intercept-link
// @version     1.43
// @description add link on attack page for intercept
// @author      finally [2060206], seintz [2460991]
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/loader.php?sid=attack*
// @grant       GM_addStyle
// ==/UserScript==

const participantsNode = "ul[class^='participants']";
const actionLogNode = "ul[class^='list']";

GM_addStyle(`
    .finally-ap-link {
        color: var(--default-color);
    }`);

function watchParticipants(observeNode) {
    if (!observeNode) return;

    const participantNode = "div[class^= 'playerWrap'] > span[class^= 'playername'";
    observeNode.querySelectorAll(participantNode).forEach((e) => addNameLink(e));

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (const node of mutation.addedNodes) {
                addNameLink(node.querySelector && node.querySelector(participantNode));
            }
        });
    }).observe(observeNode, { childList: true, subtree: true });
}

function addNameLink(node) {
    if (!node) return;
    if (node.querySelector("a")) return;

    var name = node.innerHTML;
    node.innerHTML = `<a class="finally-ap-link" target="_blank" href="profiles.php?NID=${name}">${name}</a>`;
}

function watchActionLog(observeNode) {
    if (!observeNode) return;

    const logNode = "span[class^='message'] > span";
    observeNode.querySelectorAll(logNode).forEach((e) => addLogLink(e));

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (const node of mutation.addedNodes) {
                addLogLink(node.querySelector && node.querySelector(logNode));
            }
        });
    }).observe(observeNode, { childList: true, subtree: true });
}

function addLogLink(node) {
    if (!node) return;
    if (node.querySelector("a")) return;

    node.innerHTML = node.innerHTML
        .replace(/^([^\s]+)/i, '<a class="finally-ap-link" target="_blank" href="profiles.php?NID=$1">$1</a>')
        .replace(/(\s(?:from|hit(?:ting)?|defeated|stalemated\swith|near|against|puncturing|at|damaged|miss(?:ed|ing)|left|mugged|hospitalized|lost\sto)\s)([^\s\,]+)/i,
            '$1<a class="finally-ap-link" href="profiles.php?NID=$2">$2</a>')
        .replace(/(\s(?:in)\s)([^\s\,]+)(\'s\sface)/i,
            '$1<a class="finally-ap-link" href="profiles.php?NID=$2">$2</a>$3');
}

watchActionLog(document.querySelector(actionLogNode));
watchParticipants(document.querySelector(participantsNode));

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (const node of mutation.addedNodes) {
            watchActionLog(node.querySelector && node.querySelector(actionLogNode));
        }
    });
}).observe(document.body, { childList: true, subtree: true });

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (const node of mutation.addedNodes) {
            watchParticipants(node.querySelector && node.querySelector(participantsNode));
        }
    });
}).observe(document.body, { childList: true, subtree: true });

// ==UserScript==
// @name         Auction Filter
// @namespace    Heasleys.AuctionFilter
// @version      0.3.1
// @description  Filter Items from the Torn Auction
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/amarket.php*
// @updateURL    https://github.com/Heasleys/AuctionFilter/raw/master/AuctionFilter.user.js
// ==/UserScript==

//copy pagination-wrap (the page selector element) and paste it to the top of it's own parent element
$('.pagination-wrap').each(function(i, obj) {
    $(this).clone().prependTo($(this).parent());
});


//array list of items to hide
//I plan on making this better in the future, but it works for what I need it for.
var arrList = ['Guandao','Salt Shaker','Cricket Bat', 'Psycho Clown Mask', 'Twin Tiger Hooks', 'Old Lady Mask', 'Scarred Man Mask', 'Nun Mask', 'Young Lady Mask', 'Ginger Kid Mask', 'Moustache Man Mask', 'Kama', 'Exotic Gentleman Mask', 'Wushu Double Axes', 'Mini Cooper S'];
//MutationObserver used to monitor specific activity
const observer = new MutationObserver(() => {
    //observing item list div for li's that contain 'Cricket Bat' (now list of items)
    var i=0;
for (; i<arrList.length; i++) {
    const cricket = $("div.items-list-wrap > ul.items-list.t-blue-cont.h > li:contains('"+arrList[i]+"')");
    cricket.hide();
}
});
//set observer to monitor changes in .content-wrapper div on page
const wrapper = document.querySelector('.content-wrapper');
observer.observe(wrapper, { subtree: true, childList: true });

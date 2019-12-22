// ==UserScript==
// @name         Auction Filter
// @namespace    Heasleys.AuctionFilter
// @version      1.1
// @description  Filter Items from the Torn Auction
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/amarket.php*
// @grant        GM_addStyle
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/auctionfilter.user.js
// ==/UserScript==

GM_addStyle(`
.wb_container {
  display: flex;
  flex-direction: column;
}
.wb_title {
  border: 1px solid rgba(0, 0, 0, .5);
  border-bottom: none;
  border-radius: 5px 5px 0px 0px;
  color: #ffffff;
  font-size: 13px;
  letter-spacing: 1px;
  text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
  font-weight: 400;
  padding-left: 10px;
  margin-top: 10px;
  background-color: rgb(202, 185, 0);
  background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
  background-size: 4px;
  height: 30px;
  line-height: 30px;
}
.wb_content {
  background-color: #F2F2F2;
  border: 1px solid rgba(0, 0, 0, .5);
  border-top: none;
}

.wb_row {
  display: flex;
  margin: 0.75em;
}

.wb_col {
  margin-left: 20px;
}

.wb_col > p {
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #363636;
  margin-bottom: 3px;
}

.wb_col input {
  vertical-align: middle;
}

.checkboxes span {
  vertical-align: middle;
}

.wb_col ul>li {
  display: block;
  padding-right: 10px;
  padding-left: 22px;
  text-indent: -22px;
  padding-bottom: 3px;
}
`);

$(window).load(function () {
document.querySelector('#auction-house-tabs').insertAdjacentHTML('beforebegin', `
    <div class="wb_container">
      <div class="wb_title">Search Market</div>
       <div class="wb_content">
        <div class="wb_row">
          <div class="wb_col">
            <p>Search: <span><input type="text" name="afind" id="afind"></span></p>

          </div>

        </div>
      </div>
    </div>
    <hr class="delimiter-999 m-top10">
    `);

//copy pagination-wrap (the page selector element) and paste it to the top of it's own parent element
$('.pagination-wrap').each(function(i, obj) {
    $(this).clone().prependTo($(this).parent());
});

function filter() {
//array list of items to hide
//I plan on making this better in the future, but it works for what I need it for.
var arrList = ['Guandao','Salt Shaker','Cricket Bat', 'Psycho Clown Mask', 'Twin Tiger Hooks', 'Old Lady Mask', 'Scarred Man Mask', 'Nun Mask', 'Young Lady Mask', 'Ginger Kid Mask', 'Moustache Man Mask', 'Kama', 'Exotic Gentleman Mask', 'Wushu Double Axes', 'Mini Cooper S'];
//MutationObserver used to monitor specific activity

    //observing item list div for li's that contain 'Cricket Bat' (now list of items)
    var i=0;
    for (; i<arrList.length; i++) {
        const cricket = $("div.items-list-wrap > ul.items-list.t-blue-cont.h > li:contains('"+arrList[i]+"')");
        cricket.hide();
    }

}//end of filter

$( "#afind" ).change(search());

    function search() {
        if ($('#afind').val()) {
            var itemname = $("span.title > span.item-name");

            itemname.each(function( index ) {
                $(this).parent().parent().parent().hide();

                var s1 = $( this ).text().toLowerCase();
                var s2 = $('#afind').val().toLowerCase();

                if(s1.indexOf(s2) !== -1) {
                    $(this).parent().parent().parent().show();
                }
            });
        }
    }

//set observer to monitor changes in .content-wrapper div on page
const target = document.querySelector('.content-wrapper');
  create(target);


function create(t) {
  // create an observer instance
  var observer = new MutationObserver(function(mutations) {

      filter();
      search();

  });
observer.observe(t, { subtree: true, childList: true });
}

});

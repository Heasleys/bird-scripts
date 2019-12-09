// ==UserScript==
// @name         PlayerFilter
// @namespace    Heasleys4hemp.PlayerFilter
// @version      1.2
// @description  Filter players from advanced user search (version: find players not in a faction and also have donator/subscriber status)
// @author       Heasleys4hemp [1468764]
// @include     *.torn.com/userlist.php*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.pf_container {
  display: flex;
  flex-direction: column;
}
.pf_title {
  background-color: #CCCC00;
  border-radius: 5px 5px 0px 0px;
  color: #FFFFFF;
  font-size: 1.5em;
}
.pf_content {
  background-color: #F2F2F2;
}

.pf_row {
  display: flex;
  margin: 0.5em;
}

.pf_row p {
  margin: 0.5em;
}
`)


const insert_xgr_html = new Promise((resolve, reject) => {
  unsafeWindow.addEventListener('load', () => {
    document.querySelector('.content-wrapper').insertAdjacentHTML('afterbegin', `
    <div class="pf_container">
      <div class="pf_title m-top10 title-brown top-round">Filter Toggles</div>
       <div class="pf_content">
        <div class="pf_row">
          <div class="multiSelect">
            <ul>
                <li>
                    <input type="checkbox" value="#icon9" />In a Faction</li>
                <li>
                    <input type="checkbox" value="#icon74" />Faction Leader</li>
                <li>
                    <input type="checkbox" value="#icon70" />Federal Jail</li>
                <li>
                    <input type="checkbox" value="#icon72" />New Leaf</li>
                <li>
                    <input type="checkbox" value="#icon27" />In a Company</li>
                <li>
                    <input type="checkbox" value="#icon8" />Married</li>
            </ul>
        </div>
        </div>
      </div>
    </div>
    <hr class="delimiter-999 m-top10">
    `)
    resolve(true)
  })
})

//icon3 = donator, icon4 = subscriber
//icon6 = male, icon7 = female, icon8 = married, icon9 = faction, icon27 = company
//icon15 = hospital, icon16 = jail, icon70 = federal, icon71 = traveling, icon72 = new leaf, icon74 = leader of faction

var arrList = ['#icon9', '#icon70', '#icon74']; //filter out faction, faction leader, and fed

//var arrList = ['#icon6', '#icon7', '#icon15', '#icon16', '#icon71']; //filter out everything except fed

const observer = new MutationObserver(() => {
    var i=0;
    for (; i<arrList.length; i++) {

    //const remover = $("div.userlist-wrapper > ul.user-info-list-wrap.bottom-round > li >div.level-icons-wrap > span.user-icons > span.icons-wrap.icons > ul#iconTray > li"+arrList[i]+"");
    // ^^^ Above is a longer version of vvv the one below.

    const remover = $("ul#iconTray > li"+arrList[i]+""); //select all li child elements of ul#iconTray if they contain Id

    //removes/deletes the parent>parent>parent>parent>parent element, which is the whole user info element
    remover.parent().parent().parent().parent().parent().remove();

    //select all icons under icons-wrap > ul#iconTray, after the filtered out icons were deleted.
    const all = $("span.icons-wrap > ul#iconTray > li");     //.css({"color": "blue", "border": "2px solid blue"}); //the .css part was for checking what icons were being selected, putting a blue border around them

    //hide (not delete) all user lists
    all.parent().parent().parent().parent().parent().hide();

    //$("ul#iconTray").find("li#icon3,li#icon4").css({"color": "red", "border": "2px solid red"}); //this is for putting a red border around donator / subscriber icons

    //find and then select all li#icon3 or li#icon4 under ul#iconTray, and unhide/show the user list (since they were hidden)
    $("ul#iconTray").find("li#icon3,li#icon4").parent().parent().parent().parent().parent().show();

    } //end of for loop

}); //end of mutationObserver

//set observer to monitor changes in .content-wrapper div on page
const wrapper = document.querySelector('.content-wrapper'); //select the element called .content-wrapper
observer.observe(wrapper, { subtree: true, childList: true }); //observe changes in .content-wrapper

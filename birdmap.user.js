// ==UserScript==
// @name         Birdmap
// @namespace    Heasleys.birdmap
// @version      0.4.3
// @description  Easy find factions in list, adds easy copy link of map territories
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/city.php*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/birdmap.user.js
// ==/UserScript==

GM_addStyle(`
#wb_links {
  position: fixed;
  right: 20px;
}
`)

const key = "APIKEY";


const wb_list = `<div class="leaflet-rrose-content-wrapper leaflet-rrose-content-wrapper-ne"> \
<div class="leaflet-rrose-content" style="width: 191px;"> \
<div id="wb_list_wrap" class="territory-dialogue-wrap"> \
</div></div></div>`;

$(window).load(function(){
    $("#map-cont").before(`<div id="wb_links"></div>`);
    $("#wb_links").append(wb_list);

$( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {
  if (ajaxObj.url && ajaxObj.url.includes('step=mapData')) {
      const mapdata = JSON.parse(jqXHR.responseText);



      getAPI(key);

      const wrapper = document.querySelector('.leaflet-popup-pane');

      const observer = new MutationObserver(() => {

          var terr = $( "ul.territory-info-wrap" ).find("li > span:contains('Name:')");
          var terrName = terr.parent().text().split("Name:").join("");
          terrName = $.trim(terrName);
          terr.parent().html("<span class='bold'>Name: </span><a href='https://www.torn.com/city.php#terrName=" + terrName + "'>" + terrName + "</a>");

      });


      observer.observe(wrapper, { subtree: false, childList: true });

  }
})


});


function getAPI(key) {
    const RMAIN = "8336";
    const UR = "8981";
    const LILMONSTER = "14633";
    const RBOMB = "20881";
    const UR2 = "11428";
    const URM = "10850";
    const STON = "14441";
    const VOODOO = "37093";
    const HELVETE = "18736";



    var Rarray = {"Relentless": RMAIN,"Unrelenting": UR,"Little Monsters": LILMONSTER,"Relentless BOMB FACTORY": RBOMB,"Unrelenting 2":UR2,"Unrelenting Medical":URM,"StonURs Reeking Havoc":STON,"Voodoo":VOODOO, "Helvete":HELVETE};



    var request_url = 'https://api.torn.com/torn/?selections=territory&key='+key;

    $.ajax({
        url: request_url,
        type: "GET",
        processData: false,
        dataType: 'json',
        success: function(data) {

            $.each(data.territory, function(index, element) {

                //console.log(index);


                $.each(Rarray, function(n,e) {
                    if (element.faction == e) {
                        console.log(element.faction + ": " + index);
                        $("#wb_list_wrap").append('<div class="title"><a class="user faction" href="/factions.php?step=profile&ID='+element.faction+'"><img src="https://s3.amazonaws.com/factiontags.torn.com/8981-90878.png"></a><a class="text-blue c-pointer" href="https://www.torn.com/city.php#terrName='+index+'">'+n+'</a></div>');
                        delete Rarray[n];
                        return false;
                    }

                });

            });

        }
    });



}//end function

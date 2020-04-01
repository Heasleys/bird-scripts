// ==UserScript==
// @name         Faction Territories
// @namespace    Heasleys.factionterritories
// @version      0.9.3
// @description  faction territory list search
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/city.php*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// ==/UserScript==

var APIKEY = localStorage.getItem('wb_apikey') || '';


    document.querySelector('#tab-menu').insertAdjacentHTML('beforebegin', `
    <div class="wb_container">
      <div class="wb_title">Faction Territories<span class="wb_error" hidden></span><span class="wb_success" hidden> - Factions loaded</span></div>
       <div class="wb_content">
        <div class="wb_row">
          <div class="wb_col">
            <p class="wb_col_title">Search List</p>
            <input class="wb_input" list="flist" id="flistinput">
              <datalist id="flist">

              </datalist>
          </div>

          <div class="wb_col">
          <p class="wb_col_title">Favorites</p>

          </div>
          <div class="wb_col">
          <p class="wb_hide wb_col_title">API Key ▼</p>
           <div id="api_input" hidden>
             <input class="wb_input wb_input_group" type="text" id="wb_apikey_input" required minlength="16" maxlength="16">
             <button class="wb_input_button wb_input_group" type="button" id="wb_save_apikey">Save</button>
           </div>
          </div>


        </div>
      </div>
    </div>
    <hr class="delimiter-999 m-top10">
    `);


    $('#wb_apikey_input').val(APIKEY);

    $(".wb_hide").click(function() {
        $("#api_input").slideToggle("slow");
    });

$( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {
  if (ajaxObj.url && ajaxObj.url.includes('step=mapData')) {
      const mapdata = JSON.parse(jqXHR.responseText);

      var factionlist = mapdata.factionOwnTerritories.factionData;

      getAPI(APIKEY,factionlist);

  }


    $('#flistinput').change(function(){
      var id = $(this).val();

        if (id != "") {
             var name = $('#flist [value="' + id + '"]').data('name');
             var terr = $('#flist [value="' + id + '"]').data('terr');

             window.location = "#terrName=" + terr;
        }

    });

    $('#wb_save_apikey').click(function() {
      APIKEY = $('#wb_apikey_input').val();
      localStorage.setItem('wb_apikey', APIKEY);
        getAPI(APIKEY,factionlist);
    });



});


function getAPI(APIKEY,flist) {
    if (APIKEY != "") {

    var request_url = 'https://api.torn.com/torn/?selections=territory&key='+APIKEY;

    $.ajax({
        url: request_url,
        type: "GET",
        processData: false,
        dataType: 'json',
        success: function(data) {
            if (data.error) {
                $(".wb_error").text(" - API error code " + data.error.code + " - " + data.error.error);
                $(".wb_error").prop('hidden', false);
            } else {
                $(".wb_error").prop('hidden', true);

            $.each(data.territory, function(index, element) {
                if (flist != null) {
                $.each(flist, function(n,e) {
                    if (element.faction == e.factionID) {
                        $("#flist").append('<option value="'+e.factionID+'" data-name="'+e.name+'" data-terr="'+index+'" data-image="'+e.image+'" data-members="'+e.memberAmount+'">'+e.name+'</option>');
                        delete flist[n];
                        return false;
                    }

                });
                }

            });
                $(".wb_success").prop('hidden', false).delay(3000).fadeOut(1000);

            }//else

        }
    });


    }//if empty
}//end function

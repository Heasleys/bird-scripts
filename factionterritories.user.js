// ==UserScript==
// @name         Faction Territories
// @namespace    Heasleys.factionterritories
// @version      0.9.2
// @description  faction territory list search
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/city.php*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// ==/UserScript==

var APIKEY = localStorage.getItem('wb_apikey') || '';

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

span.wb_error {
  color: #bf532e;
  text-shadow: none;
  font-weight: 800;
}

span.wb_success {
  color: #478807;
  text-shadow: none;
  font-weight: 800;
}

.wb_content {
  background-color: #F2F2F2;
  border: 1px solid rgba(0, 0, 0, .5);
  border-top: none;
}

.wb_row {
  display: flex;
  margin: 0.75em;
  justify-content: space-between;
}

.wb_col {
  margin-left: 20px;
  margin-right: 20px;
}

.wb_col > p {
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #363636;
  margin-bottom: 3px;
  padding-bottom: 2px;
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

.wb_hide {
  cursor: pointer;
}

.wb_input {
  width: 118px;
  height: 23px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .5);
  padding: 0 4px 0 10px;
}

.wb_input.wb_input_group {
  border-radius: 5px 0px 0px 5px !important;
}

.wb_input_button {
  height: 25px;
  border-radius: 5px;
  background-color: #f2f2f2;
  border: 1px solid rgba(0, 0, 0, .5);
}

.wb_input_button:hover {
  background-color: #fafafa;
}

.wb_input_button:active {
  background-color: #d9d9d9;
}

.wb_input_button.wb_input_group {
  border-radius: 0px 5px 5px 0px;
  vertical-align: middle;
  margin-left: -5px;
}
`);



$(window).load(function(){

    document.querySelector('#tab-menu').insertAdjacentHTML('beforebegin', `
    <div class="wb_container">
      <div class="wb_title">Faction Territories<span class="wb_error" hidden></span><span class="wb_success" hidden> - Factions loaded</span></div>
       <div class="wb_content">
        <div class="wb_row">
          <div class="wb_col">
            <p>Search List</p>
            <input class="wb_input" list="flist" id="flistinput">
              <datalist id="flist">

              </datalist>
          </div>

          <div class="wb_col">
          <p>Favorites</p>

          </div>
          <div class="wb_col">
          <p class="wb_hide">API Key ▼</p>
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

});//window.load


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

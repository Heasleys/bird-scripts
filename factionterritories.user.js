// ==UserScript==
// @name         Faction Territories
// @namespace    Heasleys.factionterritories
// @version      0.9.3
// @description  faction territory list search
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/city.php*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/factionterritories.user.js
// ==/UserScript==

var APIKEY = localStorage.getItem('wb_apikey') || '';
var factionlist;

GM_addStyle(`
.wb_container {
  display: flex;
  flex-direction: column;
}

div.wb_head {
  border-bottom: none;
  border-radius: 5px 5px 5px 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px;
  padding: 6px 10px;
  background-color: rgb(202, 185, 0);
  background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
  background-size: 4px;
  cursor: pointer;
}

div.wb_head.expanded {
  border-bottom: none;
  border-radius: 5px 5px 0px 0px;
}

span.wb_title {
  color: #ffffff;
  font-size: 13px;
  letter-spacing: 1px;
  text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
  font-weight: 700;
  line-height: 16px;
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
  border-radius: 0px 0px 5px 5px;
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

span.wb_icon {
  align-items: center;
  justify-content: center;
  width: 16px;
  float: right;
}

span.wb_icon svg {
  display: block;
  height: 16px;
  fill: white;
  cursor: pointer;
  margin-left: auto;
  margin-right: auto;
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

$( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {

  if (ajaxObj.url && ajaxObj.url.includes('step=mapData')) {
      createWBHeader();
      const mapdata = JSON.parse(jqXHR.responseText);

      factionlist = mapdata.factionOwnTerritories.factionData;

      $('#wb_apikey_input').val(APIKEY);
      getAPI(APIKEY);
  }

});

});//window.load


function getAPI(APIKEY) {
    let flist = factionlist;
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
              var list = "";

            $.each(data.territory, function(index, element) {
                if (flist != null) {
                $.each(flist, function(n,e) {
                    if (element.faction == e.factionID) {
                        list += '<option value="'+e.factionID+'" data-name="'+e.name+'" data-terr="'+index+'" data-image="'+e.image+'" data-members="'+e.memberAmount+'">'+e.name+'</option>';
                        delete flist[n];
                        return false;
                    }

                });
                }

            });
                $("#flist").append(list);
                $(".wb_success").prop('hidden', false).delay(3000).fadeOut(1000);

            }//else

        }
    });


    }//if empty
}//end function

function createWBHeader() {

  document.querySelector('#tab-menu').insertAdjacentHTML('beforebegin', `
    <div class="wb_container">
      <div class="wb_head"><span class="wb_title">Faction Territories</span><span class="wb_error" hidden></span><span class="wb_success" hidden> - Factions loaded</span><span class="wb_toggle wb_icon" id="wb_svg_right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon" id="wb_svg_down" hidden><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
       <div class="wb_content" hidden>
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
          <p class="wb_hide" data-target="#api_input">API Key ▼</p>
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

    $(".wb_hide").click(function() {
        let target = $(this).data('target');
        $(target).slideToggle("slow");
    });

    $(".wb_head").click(function() {
      $(this).toggleClass("expanded");
      $(".wb_content").slideToggle("slow");

      if (!$("#wb_svg_right").is(':visible')) {
          $("#wb_svg_right").attr("hidden",false);
          $("#wb_svg_down").attr("hidden",true);
      } else {
          $("#wb_svg_right").attr("hidden",true);
          $("#wb_svg_down").attr("hidden",false);
      }
    });

     $('#wb_save_apikey').click(function(event) {
        APIKEY = $('#wb_apikey_input').val();
        localStorage.setItem('wb_apikey', APIKEY);
        getAPI(APIKEY);
     });

     $('#flistinput').change(function(){
      var id = $(this).val();
        if (id != "") {
          var name = $('#flist [value="' + id + '"]').data('name');
          var terr = $('#flist [value="' + id + '"]').data('terr');
          window.location = "#terrName=" + terr;
        }
     });
}

// ==UserScript==
// @name         CTMAP - Extended View
// @namespace    Heasleys.ctextended
// @version      1.5.2
// @description  My weird project to extend and redesign the christmas town map viewer
// @author       Heasleys4hemp [1468764]
// @match        https://*.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @updateURL    https://github.com/Heasleys/bird-scripts/raw/master/ctextended.user.js
// ==/UserScript==
var ct_ex_on = localStorage.getItem('wb_ct_ex_on') || 'false';
var ct_ex_fog = localStorage.getItem('wb_ct_ex_fog') || 'false';

if (typeof GM == 'undefined') {
    window.GM = {};
}

if (typeof GM.addStyle == "undefined") { //Add GM.addStyle for browsers that do not support it (e.g. TornPDA, Firefox+Greasemonkey)
    GM.addStyle = function (aCss) {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}



(function() {
    'use strict';

    var ctobserver = new MutationObserver(function(mutations) {
        if ($("#ct-wrap").length == 1 && $('#wb-ct-extended').length == 0) {
            initCTExtended();
            ctobserver.disconnect();
        }
    });

    window.addEventListener('load', (event) => {
        ctobserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    });


    function initCTExtended() {
        $('.core-layout__viewport').before(`
        <div class="wb-ct-title" id="wb-ct-extended">
            <span>CT Extended
                <button class="wb-ct-button" id="toggleExtend">Toggle Extended View</button>
                <button class="wb-ct-button" id="toggleFog">Toggle Fog</button>
            </span>
        </div>
        `);

        $('#map').prepend(`<div class="wb_fog left"></div><div class="wb_fog right"></div><div class="wb_fog top"></div><div class="wb_fog bottom"></div><div class="wb_fog rightborderfix"></div><div class="wb_fog leftborderfix"></div>`);

        //$('.user-map-container').before(`<p id="ct-message" style="display: none;">Welcome to Christmas Town!</p>`);

        $('#toggleExtend').on('click', function(){
            $('.content-wrapper').toggleClass('wb-extended');
            //$('.user-map-container').removeClass('wb-hidden');
            //$('.status-area-container').addClass('wb-hidden');
            //$('#ct-message').toggle();
            if (ct_ex_on == 'true') {
                ct_ex_on = 'false';
            } else {
                ct_ex_on = 'true';
            }

            localStorage.setItem('wb_ct_ex_on', ct_ex_on);
        });

        $('#toggleFog').on('click', function(){
            $('.content-wrapper').toggleClass('wb-extended-fog');

            if (ct_ex_fog == 'true') {
                ct_ex_fog = 'false';
            } else {
                ct_ex_fog = 'true';
            }

            localStorage.setItem('wb_ct_ex_fog', ct_ex_fog);
        });

        $('#ct-wrap').on("click", ".status-area-container.wb-eventmode button:icontains('LEAVE'), .status-area-container.wb-eventmode button:icontains('NO')" , function() {
            $('.status-area-container').removeClass('wb-eventmode');
        });

        if (ct_ex_on == 'true') {
            $('.content-wrapper').toggleClass('wb-extended');
        }

        if (ct_ex_fog == 'true') {
            $('.content-wrapper').toggleClass('wb-extended-fog');
        }


        let original_fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async (url, init) => {
            let response = await original_fetch(url, init)
            let respo = response.clone();
            respo.json().then((data) => {
                if (url.includes("christmas_town.php")) {
                    console.log("[CTMAP - Extended View] Christmas Town Data: ", data);
                    if ($('.content-wrapper.wb-extended').length > 0) {
                        //var ct_message = $('#ct-message');
                        if (data && data.mapData) {
                            if (data.mapData.trigger) {
                                if (data.mapData.trigger.message) {
                                    let tc_message = data.mapData.trigger.message;
                                    //ct_message.html(`<span>` + tc_message.replaceAll("\n", "<br>") + `</span>`);
                                }

                                if (data.mapData.messageAreaImageUrl) {
                                    let bg_url = data.mapData.messageAreaImageUrl;
                                    //ct_message.css('background-image', `url("${bg_url}")`);
                                }

                                if (data.mapData.trigger.miniGameType && data.mapData.trigger.miniGameType != "Teleport") {
                                    console.log("[CTMAP - Extended View] Mini Game found: ", data.mapData.trigger.miniGameType);

                                    $('.status-area-container').addClass('wb-eventmode');

                                } else {
                                    $('.status-area-container').removeClass('wb-eventmode');
                                }
                            }


                            if (data.mapData.cellEvent && data.mapData.cellEvent.type != "teleport") {
                                console.log("[CTMAP - Extended View] Cell Event found: ", data.mapData.cellEvent);
                                $('.status-area-container').addClass('wb-eventmode');
                            } else {
                                $('.status-area-container').removeClass('wb-eventmode');
                            }

                        }
                    }
                }
            })
            return response;
        }

    }







    GM_addStyle(`
.wb-ct-title {
    border: 1px solid var(--ct-hud-title-border-color);
    padding: 5px;
    margin-bottom: 10px;
    display: block;
    color: var(--ct-title-font-color);
    text-shadow: 0 1px 0 hsla(0, 0%, 100%, .45);
    font-size: 15px;
    letter-spacing: 1px;
    font-weight: 400;
    line-height: 1.6;
    background: var(--ct-title-bg);
    border-radius: 5px 5px 0 0;
}

.wb-ct-title>span {
    padding-left: 5px;
    padding-right: 10px;
}

.wb-ct-button {
    border-radius: 5px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    color: rgb(51, 51, 51);
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: 1px solid #a7bec9;
    text-decoration: none;
    overflow: hidden;
    padding: 0 5px;
    margin: 0 5px;
}

.wb-ct-button:disabled {
    background-color: rgb(219, 219, 219);
}

.wb-ct-button:hover:enabled {
    background-color: rgb(250, 250, 250);
}

.wb-extended .wb-hidden {
    display: none;
}

.wb-extended #ct-wrap {
    display: flex;
    flex-direction: column;
}


.d .wb-extended #ct-wrap .user-map-container .user-map::before {
    background: unset;
}


@media screen and (min-width: 785px) {
    .d .wb-extended #ct-wrap .user-map-container {
        grid-column: 1;
        width: 784px;
    }

    .d .wb-extended #ct-wrap .map-overview {
        width: 784px !important;
        height: 600px !important;
    }

    .d .wb-extended #ct-wrap .map-overview #world {
        /*left: 31%;*/
        /*top: 25%;*/
        top: 135px;
        left: 225px;
    }
}


@media screen and (max-width: 784px) {
    .d .wb-extended #ct-wrap .user-map-container {
        grid-column: 1;
        width: 100%;
    }

    .d .wb-extended #ct-wrap .map-overview {
        width: 384px !important;
        height: 385px !important;
        top: -27px;
    }

    .d .wb-extended #ct-wrap .map-overview #world {
        /*left: 31%;*/
        /*top: 25%;*/
        top: 122px;
        left: 122px;
        zoom: 67%;
    }
}


.wb-extended #ct-wrap .map-directions {
    display: none;
}

.wb-user-map {}

.d .wb-extended .items-container .swiper-slide {
    width: 282px !important;
}

@media screen and (min-width: 785px) {
    .d .wb-extended .status-area-container>.text-container {
        background-position: 50%;
        height: auto;
        min-height: 168px;
    }

    .d .wb-extended .status-area-container.wb-eventmode>[class*="game_"] {
        min-height: 468px;
    }

    .d .wb-extended .status-area-container.wb-eventmode>.text-container,
    .d .wb-extended .status-area-container>.text-container[class*="grinch_"] {
        min-height: 468px;
    }

    .d .wb-extended .status-area-container.wb-eventmode>div,
    .d .wb-extended .status-area-container>.text-container[class*="grinch_"] {
        background-repeat: no-repeat !important;
        background-position: center !important;
        padding-bottom: 30px;
    }

    .d .wb-extended .status-area-container [class^="game-start-screen"] {
        background-repeat: repeat;
    }
}


.wb-extended.wb-extended-fog .wb_fog {
    z-index: 99;
    position: absolute;
    background: url(/images/v2/christmas_town/snow.jpg) 0 0 repeat;
    box-sizing: border-box;
}

body.dark-mode .wb-extended.wb-extended-fog .wb_fog:after {
    background: rgba(0, 0, 0, .2);
    bottom: 0;
    content: "";
    display: none;
    display: var(--ct-overlay-display);
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
}

@media screen and (min-width: 785px) {
    .wb-extended.wb-extended-fog .wb_fog.left {
        width: 165px;
        height: 600px;
        border-right: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.right {
        left: 619px;
        width: 165px;
        height: 600px;
        border-left: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.top {
        width: 784px;
        height: 75px;
        border-bottom: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.bottom {
        top: 525px;
        width: 784px;
        height: 75px;
        border-top: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.leftborderfix {
        width: 164px;
        height: 600px;
        left: 620px;
    }

    .wb-extended.wb-extended-fog .wb_fog.rightborderfix {
        width: 164px;
        height: 600px;
    }
}

@media screen and (max-width: 784px) {
    .wb-extended.wb-extended-fog .wb_fog.left {
        width: 21px;
        top: -27px;
        left: -1px;
        height: 384px;
        border-right: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.right {
        width: 21px;
        top: -6.5px;
        left: 364px;
        height: 344px;
        border-left: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.top {
        width: 385px;
        height: 21px;
        top: -27px;
        border-bottom: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.bottom {
        top: 337px;
        width: 385px;
        height: 21px;
        border-top: 1px solid var(--ct-hud-primary-title-divider-color);
    }

    .wb-extended.wb-extended-fog .wb_fog.leftborderfix {
        width: 20.5px;
        height: 362px;
        top: -16px;
        left: 364.5px;
    }

    .wb-extended.wb-extended-fog .wb_fog.rightborderfix {
        width: 19.5px;
        height: 388px;
        top: -18px;
    }
}
  `);

})();

jQuery.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

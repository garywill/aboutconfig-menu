/* Firefox userChrome script
 * Shortcut menu to modify about:config entries
 * Tested on Firefox 153
 * Author: garywill (https://garywill.github.io)
 * 
 */


console.log("aboutconfig_menu.uc.js");

(() => {
  

    const prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    const { CustomizableUI } = ChromeUtils.importESModule("moz-src:///browser/components/customizableui/CustomizableUI.sys.mjs");
    const Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services; 
    const sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
    // ---------------------------------------------------------------------------------------
    
    const widgetBtnId = "aboutconfig-button";
    const button_label = "about:config shortcut menu";
    const cssuri_icon = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
            toolbarbutton#${widgetBtnId} .toolbarbutton-icon {
                list-style-image: url("chrome://global/skin/icons/heart.svg");
                fill: #0000ff;
            }
            toolbarbutton#${widgetBtnId} .toolbarbutton-badge {
                background-color: #009f00;
                visibility: hidden; 
            }           
            `), null, null);
    const cssuri_warnbadge = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
            toolbarbutton#${widgetBtnId} .toolbarbutton-badge {
                background-color: red ;
                visibility: unset;
            } 
            `), null, null);
   
    sss.loadAndRegisterSheet(cssuri_icon, sss.USER_SHEET);
  
    
    var prefItems = [   
        {
            name: "📋 DOM clipboard events",
            type: prefs.PREF_BOOL,
            pref: "dom.event.clipboardevents.enabled",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },

        "seperator",    // ---------------------------
        {
            name: "🌐 Disable IPv6",
            type: prefs.PREF_BOOL,
            pref: "network.dns.disableIPv6",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        {
            name: "🔐 DNS mode",
            type: prefs.PREF_INT,
            pref: "network.trr.mode",
            possibleVals: [
                { name: "0 - Default" , val: 0 },
                { name: "2 - DoH, fallback Plain DNS" , val: 2 },
                { name: "3 - DoH only" , val: 3 }, 
                { name: "5 - Plain DNS" , val: 5 }
            ]
        },
        {
            name: "🔐 DoH server",
            type: prefs.PREF_STRING,
            pref: "network.trr.uri",
            possibleVals: [
                { name: "Cloudflare" , val: "https://mozilla.cloudflare-dns.com/dns-query" },
                { name: "NextDNS" , val: "https://firefox.dns.nextdns.io/" }
            ] // See buildin DoH at 'network.trr.resolvers'
        },
        {
            name: "🔏 Enable deprecated TLS version",
            type: prefs.PREF_BOOL,
            pref: "security.tls.version.enable-deprecated",
            possibleVals: [
                { val: false  },
                { name: "true ⚠️",  val: true , sign: '‼️' , warnbadge: true},
            ]
        },

        "seperator",    // ---------------------------
        {
            name: "▶️ Media Autoplay Default",
            type: prefs.PREF_INT,
            pref: "media.autoplay.default",
            possibleVals: [
                { val: 0, name: "0 - allow" },
                { val: 1, name: "1 - blockAudible 👍" },
                { val: 5, name: "5 - blockAll" },
            ]
        },
        {
            name: "▶️ Media Autoplay ext bg",
            type: prefs.PREF_BOOL,
            pref: "media.autoplay.allow-extension-background-pages",
            possibleVals: [
                {  val: false  },
                {  val: true },
            ]
        },
        {
            name: "▶️ Media Autoplay blocking policy",
            type: prefs.PREF_INT,
            pref: "media.autoplay.blocking_policy",
            possibleVals: [
                { val: 0, name: "0 - no block" },
                { val: 1, name: "1 - block 👍" },
                { val: 2, name: "2 - block more" },
                //* 0=sticky (default), 1=transient, 2=user
            ]
        },
        {
            name: "▶️ WebAudio",
            type: prefs.PREF_BOOL,
            pref: "dom.webaudio.enabled",
            possibleVals: [
                {  val: false },
                {  val: true  ,  sign: '‼️'},
            ]
        },

        "seperator",    // ---------------------------
        {
            name: "🔤 Allow web custom fonts",
            type: prefs.PREF_INT,
            pref: "browser.display.use_document_fonts",
            possibleVals: [
                { name: "1 - Allow", val: 1 },
                { name: "0 - Disallow", val: 0 },
            ]
        },
        {
            name: "🔤 CSS font visibility",
            type: prefs.PREF_INT,
            pref: "layout.css.font-visibility.level",
            possibleVals: [
                {  val: 1, name:"1 - only base system fonts" },
                {  val: 2, name:"2 - also fonts from optional language packs" },
                {  val: 3, name:"3 - also user-installed fonts" },
            ]
        },
        {
            name: "🔤 font.system.whitelist",
            type: prefs.PREF_STRING,
            pref: "font.system.whitelist",
            possibleVals: [
                {  val: "" },
                {  val: "sans, serif, monospace",  },
            ]
        },
 
        "seperator",    // ---------------------------
        {
            name: "🛡️ Resist Fingerprinting",
            type: prefs.PREF_BOOL,
            pref: "privacy.resistFingerprinting",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        {
            name: "🛡️ Resist Fingerprinting Auto Decline NoUserInput Canvas",
            type: prefs.PREF_BOOL,
            pref: "privacy.resistFingerprinting.autoDeclineNoUserInputCanvasPrompts",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        {
            name: "🛡️ Resist Fingerprinting LetterBoxing",
            type: prefs.PREF_BOOL,
            pref: "privacy.resistFingerprinting.letterboxing",
            possibleVals: [
                {  val: false },
                {  val: true },
            ], 
        },

        "seperator",    // ---------------------------
        {
            name: "🔤 Accept Languages",
            type: prefs.PREF_STRING,
            pref: "intl.accept_languages",
            possibleVals: [
                { name: "en-US, en",  val: "en-US, en" },
            ] 
        },    
        {
            name: "🔤 Font Language Group",
            type: prefs.PREF_STRING,
            pref: "font.language.group",
            possibleVals: [
                { name: "x-western",  val: "x-western" },
                // { name: "en-US",  val: "en-US" }, // any machine actually uses this ???
            ] 
        },   
        {
            name: "🔤 JS use English locale",
            type: prefs.PREF_BOOL,
            pref: "javascript.use_us_english_locale",
            possibleVals: [
                {  val: false },
                {  val: true },
            ] 
        }, 


        "seperator",    // ---------------------------
        // https://wiki.mozilla.org/Security/Referrer
        {
            name: "🛡️ Default Referrer Policy",
            type: prefs.PREF_INT,
            pref: "network.http.referer.defaultPolicy",
            possibleVals: [
                { name: "0 - no-referrer", val: 0 },
                { name: "1 - same-origin", val: 1 },
                { name: "2 - strict-origin-when-cross-origin", val: 2 },
                { name: "3 - no-referrer-when-downgrade", val: 3 },
 
            ]
        },
        {
            name: "🛡️ Referrer Across Origins",
            type: prefs.PREF_INT,
            pref: "network.http.referer.XOriginPolicy",
            possibleVals: [
                { name: "0 - send the referrer in all cases", val: 0 },
                { name: "1 - send a referrer only when the base domains are the same", val: 1 },
                { name: "2 - send a referrer only on same-origin", val: 2 },
            ]
        },
        {
            name: "🛡️ How much referrer to send regardless of origin",
            type: prefs.PREF_INT,
            pref: "network.http.referer.trimmingPolicy",
            possibleVals: [
                { name: "0 - send the full URL", val: 0 },
                { name: "1 - send the URL without its query string", val: 1 },
                { name: "2 - only send the origin", val: 2 },
            ]
        },
        {
            name: "🛡️ How much referrer to send across origins",
            type: prefs.PREF_INT,
            pref: "network.http.referer.XOriginTrimmingPolicy",
            possibleVals: [
                { name: "0 - send the full URL", val: 0 },
                { name: "1 - send the URL without its query string", val: 1 },
                { name: "2 - only send the origin", val: 2 },
            ]
        },
        "seperator",    // ---------------------------
        {
            name: "💻 DevTool comfirm on connection",
            type: prefs.PREF_BOOL,
            pref: "devtools.debugger.prompt-connection",
            possibleVals: [
                {  val: true  },
                { name: "false ⚠️",   val: false , sign: '‼️' , warnbadge: true},
            ]
        },
    ];
    
    CustomizableUI.createWidget({
        id: widgetBtnId, // button id
        type: "custom",
        defaultArea: CustomizableUI.AREA_NAVBAR,
        removable: true,
        onBuild: function (doc) {
            let btn = doc.createXULElement('toolbarbutton');
            btn.id = widgetBtnId;
            btn.label = button_label;
            btn.tooltipText = button_label;
            btn.type = 'menu';
            btn.className = 'toolbarbutton-1 chromeclass-toolbar-additional';
            btn.setAttribute("badged", "true"); 
            btn.setAttribute("badge", "!"); 
            
            let mp = doc.createXULElement("menupopup");
            mp.id = 'aboutconfig-popup';
            mp.onclick = function(event) {  event.preventDefault()  ;} ;
            

            
            prefItems.forEach( function (item, items_i) { // loop every user defined pref
                
                if (item === "seperator") 
                {
                    mp.appendChild(doc.createXULElement('menuseparator'));
                    return;
                }
                
                //var current_val = getItemCurrentVal(item) ;
                var menu = doc.createXULElement("menu");
                menu.label = item.name ? item.name : item.pref ;
                menu.id = "aboutconfig_menu_" + items_i ;
                menu.className = 'menuitem-iconic' ;
                
            
                var menupopup = doc.createXULElement("menupopup");
                menupopup.id = "aboutconfig_menupopup_" + items_i ;
                menupopup.className = 'menuitem-iconic' ;
                

                
                item.possibleVals.forEach( function (pv, i) { // loop every possible value
                    
                    var display_val = prefPossibleValToDisplay(item, pv.val) ;
                    
                    // Submenu item. One is one possible value
                    var menuitem = doc.createXULElement("menuitem");
                    menuitem.label = pv.name ? pv.name : display_val ;
                    menuitem.id = "aboutconfig_menu_" + items_i + "__" + i  ;
                    menuitem.setAttribute('type', 'radio') ;
                    menuitem.className = 'menuitem-iconic' ;
                    menuitem.tooltipText = display_val ;

                    if (pv ['sign'])
                        menuitem.label += '　　' + pv['sign']; 
                    
                    
                    menuitem.addEventListener('click', function(event) { 
                        //console.log(this.id); 
                        setItemPrefVal(item , pv.val);
                    } ) ;
                    menupopup.appendChild(menuitem);
                    
                });
                
                
                
                var default_val = getItemDefaultVal(item);
                var default_val_display = null;
                var reset_label = "Reset: ";
                if (item.signWhenDefaultVal)
                    reset_label += item.signWhenDefaultVal + '　' ;
                if (default_val !== undefined && default_val !== null)
                {
                    default_val_display = prefPossibleValToDisplay(item, default_val);
                    reset_label += default_val_display ;
                }
                else
                    reset_label += ' (delete in about:config)'
                
                menupopup.appendChild(
                    doc.createXULElement('menuseparator')
                );
                
                // Submenu entry to reset a pref to default
                var default_item = doc.createXULElement("menuitem");
                default_item.id = "aboutconfig_menu_" + items_i + "__default" ;
                default_item.className = 'menuitem-iconic';
                default_item.label = reset_label;
                default_item.tooltipText = default_val_display;

                default_item.addEventListener('click', function(event) { 
                    //console.log(this.id); 
                    //setItemPrefVal(item , getItemDefaultVal(item) );
                    prefs.clearUserPref(item.pref);
                } ) ;
                
                menupopup.appendChild(default_item);
                
                //------------
                menu.appendChild(menupopup);
                mp.appendChild(menu);
                
                
            });
            
            btn.appendChild(mp);

            mp.addEventListener('popupshowing', function() { 
                //console.log(this);
                evalPopulateMenu(this); 
                
                update_badge();
                
            });

            btn.onclick = function(event) {
                if (event.button == 1) {
                    const win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                        .getService(Components.interfaces.nsIWindowMediator)
                        .getMostRecentWindow("navigator:browser");
                    win.gBrowser.selectedTab = win.gBrowser.addTrustedTab('about:config');
                }
                
                update_badge();
            };
            
            return btn;
        }
    });
    
    function getItemDefaultVal (item) {
        var default_val = undefined;
        try{
            if ( item.type == prefs.PREF_BOOL )
                default_val = prefs.getDefaultBranch(item.pref).getBoolPref('');
            else if ( item.type == prefs.PREF_INT )
                default_val = prefs.getDefaultBranch(item.pref).getIntPref('');
            else if ( item.type == prefs.PREF_STRING )
                default_val = prefs.getDefaultBranch(item.pref).getStringPref('');
        }catch(err) { default_val = null }
        
        return default_val;
    }
    function getItemCurrentVal (item) {
        var current_val = null;
        try{
            if ( item.type == prefs.PREF_BOOL )
                current_val = prefs.getBoolPref(item.pref);
            else if ( item.type == prefs.PREF_INT )
                current_val = prefs.getIntPref(item.pref);
            else if ( item.type == prefs.PREF_STRING )
                current_val = prefs.getStringPref(item.pref);
        }catch(err){ }
        return current_val ;
    }
    
    function if_pref_current_val_is (item, pv_index) {
        var current_val = getItemCurrentVal(item) ;
        if (current_val === null)
            return false;
        
        if ( current_val === item.possibleVals[pv_index].val )
            return true;
        else 
            return false;
    }
    
    function setItemPrefVal(item, newVal)
    {
        if ( item.type == prefs.PREF_BOOL )
            prefs.setBoolPref(item.pref, newVal);
        else if ( item.type == prefs.PREF_INT )
            prefs.setIntPref(item.pref, newVal);
        else if ( item.type == prefs.PREF_STRING )
            prefs.setStringPref(item.pref, newVal);
        
        update_badge();
    }
    function prefPossibleValToDisplay(item, possible_val ) {
        if (possible_val === null) 
            return "null";
        
        var display_val = possible_val.toString();
        if (item.type == prefs.PREF_STRING)
            display_val = `'${display_val}'`;
        
        return display_val;
    }
    
    function evalPopulateMenu(popupmenu)
    {
        prefItems.forEach( function (item, items_i) {
            if (item === "seperator") 
                return;
            
            const menu = popupmenu.querySelector("#aboutconfig_menu_" + items_i);
            menu.label = item.name ? item.name : item.pref ;
            menu.style.fontWeight = "";
            
            const default_val = getItemDefaultVal(item);
                    
            var current_val = getItemCurrentVal(item) ;
            var current_val_display = prefPossibleValToDisplay(item, current_val);
            menu.tooltipText = `Pref: ${item.pref}\nValue: ${current_val_display}`;
            
            if (current_val !== null)
            {
                if (item.type == prefs.PREF_BOOL) 
                    menu.label += '　　[' + ( current_val?'T':'F' ) + ']';
                else if (item.type == prefs.PREF_INT) 
                    menu.label += '　　[' + current_val + ']';
                else if (item.type == prefs.PREF_STRING) {
                    var current_val_display_short;
                    
                    if (current_val.length > 8)
                        current_val_display_short = current_val.substring(0, 6) + '..'; 
                    else 
                        current_val_display_short = current_val;
                    
                    menu.label += '　　[' + current_val_display_short + ']';
                }
            } 
            
            if (current_val !== default_val)
                menu.style.fontWeight = "bold";
            
            if (current_val === default_val && item.signWhenDefaultVal)
                menu.label += '　　' + item.signWhenDefaultVal;

            
            item.possibleVals.forEach( function (pv, i) {
                var menuitem = popupmenu.querySelector("#aboutconfig_menu_" + items_i + "__" + i);
                if ( if_pref_current_val_is(item, i) )
                { 
                    menuitem.setAttribute("checked",true);
                 
                    if (pv ['sign'])
                        menu.label += '　　' + pv['sign'];
                }
                else 
                    menuitem.removeAttribute("checked");
            });
        });
    }
    
    function add_warnbadge()
    {
        if ( ! sss.sheetRegistered(cssuri_warnbadge, sss.USER_SHEET) )
             sss.loadAndRegisterSheet(cssuri_warnbadge, sss.USER_SHEET);
    }
    function rm_warnbadge()
    {
        if ( sss.sheetRegistered(cssuri_warnbadge, sss.USER_SHEET) )
             sss.unregisterSheet(cssuri_warnbadge, sss.USER_SHEET);
    }
    
    update_badge();
    async function update_badge()
    {
        var show_warnbadge = false;
        
        for (let item of prefItems)
        {
            if (typeof(item) === "string")
                continue;
            
            const current_val = getItemCurrentVal(item) ;
            if (
                item.possibleVals.some ( function(ele) {
                    return ( ele ['val'] === current_val && ele ['warnbadge'] && ele ['warnbadge'] === true );
                } )
            )
            {
                show_warnbadge = true;
                break;
            }
        }
             
        
        if (show_warnbadge)
            add_warnbadge();
        else 
            rm_warnbadge();
    }

    for (let item of prefItems)
    {
        if (typeof(item) === "string")
            continue;

        for (let pv of item.possibleVals)
        {
            if (pv['warnbadge'] === true)
            {
                console.log(`Add observer of ${item.pref}`);
                prefs.addObserver(item.pref, update_badge, false);
                break;
            }
        }
    }

    
})();
    

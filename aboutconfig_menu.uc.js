/* Firefox userChrome script
 * Shortcut menu to modify about:config entries
 * Tested on Firefox 91
 * Author: garywill (https://garywill.github.io)
 * 
 */
console.log("aboutconfig_menu.uc.js");

(() => {
  

    const prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    Components.utils.import("resource:///modules/CustomizableUI.jsm");
    const {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
    const sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
    // ---------------------------------------------------------------------------------------
    
    const button_label = "about:config shortcut menu";
    const cssuri_icon = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
            #aboutconfig-button .toolbarbutton-icon {\
                list-style-image: url("resource:///chrome/browser/skin/classic/browser/ion.svg"); \
            }'), null, null);

    sss.loadAndRegisterSheet(cssuri_icon, sss.USER_SHEET);
  

    var prefItems = [ 
        {
            name: "Disable IPv6",
            type: prefs.PREF_BOOL,
            pref: "network.dns.disableIPv6",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        {
            name: "DNS mode",
            type: prefs.PREF_INT,
            pref: "network.trr.mode",
            possibleVals: [
                { name: "Plain DNS" , val: 0 },
                { name: "DoH, fallback Plain DNS" , val: 2 },
                { name: "DoH only" , val: 3 }
            ]
        },
        {
            name: "DoH server",
            type: prefs.PREF_STRING,
            pref: "network.trr.custom_uri",
            possibleVals: [
                { name: "Cloudflare" , val: "https://mozilla.cloudflare-dns.com/dns-query" },
                { name: "NextDNS" , val: "https://firefox.dns.nextdns.io/" }
            ] // See buildin DoH at 'network.trr.resolvers'
        },
        "seperator",
        {
            name: "Allow web custom fonts",
            type: prefs.PREF_INT,
            pref: "browser.display.use_document_fonts",
            possibleVals: [
                { name: "Allow", val: 1 },
                { name: "Disallow", val: 0 },
            ]
        },
        {
            name: "Resist Fingerprinting",
            type: prefs.PREF_BOOL,
            pref: "privacy.resistFingerprinting",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        {
            name: "Resist Fingerprinting Auto Decline NoUserInput Canvas",
            type: prefs.PREF_BOOL,
            pref: "privacy.resistFingerprinting.autoDeclineNoUserInputCanvasPrompts",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        {
            name: "Resist Fingerprinting LetterBoxing",
            type: prefs.PREF_BOOL,
            pref: "privacy.resistFingerprinting.letterboxing",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        "seperator",
        // https://wiki.mozilla.org/Security/Referrer
        {
            name: "Default Referrer Policy",
            type: prefs.PREF_INT,
            pref: "network.http.referer.defaultPolicy",
            possibleVals: [
                { name: "no-referrer", val: 0 },
                { name: "same-origin", val: 1 },
                { name: "strict-origin-when-cross-origin", val: 2 },
                { name: "no-referrer-when-downgrade", val: 3 },
 
            ]
        },
        {
            name: "Referrer Across Origins",
            type: prefs.PREF_INT,
            pref: "network.http.referer.XOriginPolicy",
            possibleVals: [
                { name: "send the referrer in all cases", val: 0 },
                { name: "send a referrer only when the base domains are the same", val: 1 },
                { name: "send a referrer only on same-origin", val: 2 },
            ]
        },
        {
            name: "How much referrer to send regardless of origin",
            type: prefs.PREF_INT,
            pref: "network.http.referer.trimmingPolicy",
            possibleVals: [
                { name: "send the full URL", val: 0 },
                { name: "send the URL without its query string", val: 1 },
                { name: "only send the origin", val: 2 },
            ]
        },
        {
            name: "How much referrer to send across origins",
            type: prefs.PREF_INT,
            pref: "network.http.referer.XOriginTrimmingPolicy",
            possibleVals: [
                { name: "send the full URL", val: 0 },
                { name: "send the URL without its query string", val: 1 },
                { name: "only send the origin", val: 2 },
            ]
        },
        "seperator",
        {
            name: "DevTool comfirm on connection",
            type: prefs.PREF_BOOL,
            pref: "devtools.debugger.prompt-connection",
            possibleVals: [
                {  val: true },
                {  val: false },
            ]
        },
    ];
    
    if (! CustomizableUI.getWidget('aboutconfig-button')){
        CustomizableUI.createWidget({
            id: 'aboutconfig-button', // button id
            type: "custom",
            defaultArea: CustomizableUI.AREA_NAVBAR,
            removable: true,
            onBuild: function (doc) {
                let btn = doc.createXULElement('toolbarbutton');
                btn.id = 'aboutconfig-button';
                btn.label = button_label;
                btn.tooltipText = button_label;
                btn.type = 'menu';
                btn.className = 'toolbarbutton-1 chromeclass-toolbar-additional';
                
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
                        
                        
                        menuitem.addEventListener('click', function(event) { 
                            //console.log(this.id); 
                            setItemPrefVal(item , pv.val);
                        } ) ;
                        menupopup.appendChild(menuitem);
                        
                    });
                    
                    
                    
                    var default_val = getItemDefaultVal(item);
                    var default_val_display = null;
                    var reset_label = "Reset";
                    if (default_val !== undefined && default_val !== null)
                    {
                        default_val_display = prefPossibleValToDisplay(item, default_val);
                        reset_label = "Reset to default: " + default_val_display ;
                    }
                    
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
                    
                });

                btn.onclick = function(event) {
                    if (event.button == 1) {
                        const win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                            .getService(Components.interfaces.nsIWindowMediator)
                            .getMostRecentWindow("navigator:browser");
                        win.gBrowser.selectedTab = win.gBrowser.addTrustedTab('about:config');
                    }
                };
                
                return btn;
            }
        });
    }
    
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
                    
            var current_val = getItemCurrentVal(item) ;
            var current_val_display = prefPossibleValToDisplay(item, current_val);

            popupmenu.querySelector("#aboutconfig_menu_" + items_i).tooltipText = `Pref: ${item.pref}\nValue: ${current_val_display}`;
            item.possibleVals.forEach( function (pv, i) {

                menuitem = popupmenu.querySelector("#aboutconfig_menu_" + items_i + "__" + i);

                if ( if_pref_current_val_is(item, i) )
                    menuitem.setAttribute("checked",true);
                else 
                    menuitem.setAttribute("checked",false);
            });
        });
    }
    
    
    
})();


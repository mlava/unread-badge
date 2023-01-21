var uiTag, uiTagName, uiOffset, uiTextColour, uiBGColour, uiFreq, uiMenuIcon, key, unreadCount;
var uiTag1, uiTagName1, uiOffset1, uiTextColour1, uiBGColour1, uiMenuIcon1, unreadCount1;
var uiMenu = false;
var uiMenu1 = false;
var uiSecondTag = false;
var inboxInterval = 0;

export default {
    onload: ({ extensionAPI }) => {
        const config = {
            tabTitle: "Unread Badge",
            settings: [
                {
                    id: "ui-tag",
                    name: "Tag to monitor",
                    description: "Roam Research tag for which you want an unread badge",
                    action: {
                        type: "input", placeholder: "",
                        onChange: (evt) => { setUiTag(evt) }
                    },
                },
                {
                    id: "ui-tagName",
                    name: "Override Tag name",
                    description: "Leave blank to use tag, or complete to use this string as the title in the menu/shortcut",
                    action: {
                        type: "input", placeholder: "",
                        onChange: (evt) => { setUiTagName(evt) }
                    }
                },
                {
                    id: "ui-menu",
                    name: "Add tag to menu",
                    description: "Add a button for tag and badge to the left side bar menu. If switched off, this extension will look in Shortcuts for a link to the tag.",
                    action: {
                        type: "switch",
                        onChange: (evt) => { setUiMenu(evt) }
                    },
                },
                {
                    id: "ui-menuicon",
                    name: "Icon for menu tag",
                    description: "Which icon do you want to use if added to left sidebar menu? Lower case icon name from https://blueprintjs.com/docs/#icons.",
                    action: {
                        type: "input", placeholder: "inbox",
                        onChange: (evt) => { setUiMenuIcon(evt) }
                    },
                },
                {
                    id: "ui-offset",
                    name: "Count correction offset",
                    description: "If your count is too high, use this number to correct",
                    action: {
                        type: "input", placeholder: "0",
                        onChange: (evt) => { setUiOffset(evt) }
                    },
                },
                {
                    id: "ui-textcolour",
                    name: "Badge text colour",
                    description: "Colour of badge text (named css colour or hex code)",
                    action: {
                        type: "input", placeholder: "e.g. white or #FFFFFF",
                        onChange: (evt) => { setTextColour(evt) }
                    },
                },
                {
                    id: "ui-bgcolour",
                    name: "Badge background colour",
                    description: "Colour of badge background (named css colour or hex code)",
                    action: {
                        type: "input", placeholder: "e.g. red or #FF0000",
                        onChange: (evt) => { setBGColour(evt) }
                    },
                },
                {
                    id: "ui-secondTag",
                    name: "Monitor a second tag",
                    description: "Turn On to monitor a second tag",
                    action: {
                        type: "switch",
                        onChange: (evt) => { setSecondTag(evt) }
                    },
                },
                {
                    id: "ui-tag1",
                    name: "Second Tag to monitor",
                    description: "A second Roam Research tag for which you want an unread badge (optional)",
                    action: {
                        type: "input", placeholder: "",
                        onChange: (evt) => { setUiTag1(evt) }
                    },
                },
                {
                    id: "ui-tagName1",
                    name: "Override Second Tag name",
                    description: "Leave blank to use tag, or complete to use this string as the title in the menu/shortcut",
                    action: {
                        type: "input", placeholder: "",
                        onChange: (evt) => { setUiTagName1(evt) }
                    }
                },
                {
                    id: "ui-offset1",
                    name: "Second tag count correction offset",
                    description: "If your count is too high, use this number to correct",
                    action: {
                        type: "input", placeholder: "0",
                        onChange: (evt) => { setUiOffset1(evt) }
                    },
                },
                {
                    id: "ui-menu1",
                    name: "Add second tag to menu",
                    description: "Add a button for tag and badge to the left side bar menu. If switched off, this extension will look in Shortcuts for a link to the tag.",
                    action: {
                        type: "switch",
                        onChange: (evt) => { setUiMenu1(evt) }
                    },
                },
                {
                    id: "ui-menuicon1",
                    name: "Icon for second menu tag",
                    description: "Which icon do you want to use if added to left sidebar menu? Lower case icon name from https://blueprintjs.com/docs/#icons.",
                    action: {
                        type: "input", placeholder: "inbox",
                        onChange: (evt) => { setUiMenuIcon1(evt) }
                    },
                },
                {
                    id: "ui-textcolour1",
                    name: "Second badge text colour",
                    description: "Colour of badge text (named css colour or hex code)",
                    action: {
                        type: "input", placeholder: "e.g. white or #FFFFFF",
                        onChange: (evt) => { setTextColour1(evt) }
                    },
                },
                {
                    id: "ui-bgcolour1",
                    name: "Second badge background colour",
                    description: "Colour of badge background (named css colour or hex code)",
                    action: {
                        type: "input", placeholder: "e.g. red or #FF0000",
                        onChange: (evt) => { setBGColour1(evt) }
                    },
                },
            ]
        };
        extensionAPI.settings.panel.create(config);

        // onload
        uiTag = extensionAPI.settings.get("ui-tag");
        uiTag1 = extensionAPI.settings.get("ui-tag1");
        uiMenu = extensionAPI.settings.get("ui-menu");
        uiMenu1 = extensionAPI.settings.get("ui-menu1");
        uiSecondTag = extensionAPI.settings.get("ui-secondTag");

        if (extensionAPI.settings.get("ui-tagName")) {
            uiTagName = extensionAPI.settings.get("ui-tagName");
        } else {
            uiTagName = uiTag;
        }
        if (extensionAPI.settings.get("ui-tagName1")) {
            uiTagName1 = extensionAPI.settings.get("ui-tagName1");
        } else {
            uiTagName1 = uiTag1;
        }
        if (extensionAPI.settings.get("ui-menuicon")) {
            uiMenuIcon = extensionAPI.settings.get("ui-menuicon");
        } else {
            uiMenuIcon = "inbox";
        }
        if (extensionAPI.settings.get("ui-menuicon1")) {
            uiMenuIcon1 = extensionAPI.settings.get("ui-menuicon1");
        } else {
            uiMenuIcon1 = "inbox";
        }
        createDIVs();

        // on update config
        function setUiTag(evt) {
            uiTag = evt.target.value;
            createDIVs();
        }
        function setUiTag1(evt) {
            uiTag1 = evt.target.value;
            createDIVs();
        }
        function setUiTagName(evt) {
            if (evt.target.value.length > 0) {
                uiTagName = evt.target.value;
            } else {
                uiTagName = extensionAPI.settings.get("ui-tag");
            }
            createDIVs();
        }
        function setUiTagName1(evt) {
            if (evt.target.value.length > 0) {
                uiTagName1 = evt.target.value;
            } else {
                uiTagName1 = extensionAPI.settings.get("ui-tag1");
            }
            createDIVs();
        }
        function setUiMenu(evt) {
            uiMenu = evt.target.checked;
            createDIVs();
        }
        function setUiOffset(evt) {
            uiOffset = evt.target.value;
            createDIVs();
        }
        function setUiMenuIcon(evt) {
            uiMenuIcon = evt.target.value;
        }
        function setUiMenu1(evt) {
            uiMenu1 = evt.target.checked;
            createDIVs();
        }
        function setUiMenuIcon1(evt) {
            uiMenuIcon1 = evt.target.value;
        }
        function setUiOffset1(evt) {
            uiOffset1 = evt.target.value;
            createDIVs();
        }
        function setSecondTag(evt) {
            uiSecondTag = evt.target.checked;
            createDIVs();
        }
        function setTextColour(evt) {
            uiTextColour = evt.target.value;
            createDIVs();
        }
        function setBGColour(evt) {
            uiBGColour = evt.target.value;
            createDIVs();
        }
        function setTextColour1(evt) {
            uiTextColour1 = evt.target.value;
            createDIVs();
        }
        function setBGColour1(evt) {
            uiBGColour1 = evt.target.value;
            createDIVs();
        }

        breakme: {
            if (extensionAPI.settings.get("ui-offset")) {
                const regex = /^[0-9]{1,3}$/;
                if (extensionAPI.settings.get("ui-offset") && regex.test(extensionAPI.settings.get("ui-offset"))) {
                    uiOffset = extensionAPI.settings.get("ui-offset");
                } else {
                    key = "offset";
                    sendConfigAlert(key);
                    break breakme;
                }
            } else {
                uiOffset = "0";
            }
            if (extensionAPI.settings.get("ui-offset1")) {
                const regex = /^[0-9]{1,3}$/;
                if (extensionAPI.settings.get("ui-offset1") && regex.test(extensionAPI.settings.get("ui-offset1"))) {
                    uiOffset1 = extensionAPI.settings.get("ui-offset1");
                } else {
                    key = "offset";
                    sendConfigAlert(key);
                    break breakme;
                }
            } else {
                uiOffset1 = "0";
            }
            if (extensionAPI.settings.get("ui-textcolour")) {
                uiTextColour = extensionAPI.settings.get("ui-textcolour");
            } else {
                uiTextColour = "white";
            }
            if (extensionAPI.settings.get("ui-bgcolour")) {
                uiBGColour = extensionAPI.settings.get("ui-bgcolour");
            } else {
                uiBGColour = "red";
            }
            if (extensionAPI.settings.get("ui-textcolour1")) {
                uiTextColour1 = extensionAPI.settings.get("ui-textcolour1");
            } else {
                uiTextColour1 = "white";
            }
            if (extensionAPI.settings.get("ui-bgcolour1")) {
                uiBGColour1 = extensionAPI.settings.get("ui-bgcolour1");
            } else {
                uiBGColour1 = "red";
            }

            checkInbox();

            window.roamAlphaAPI.data.addPullWatch(
                "[:block/_refs :block/uid :node/title]",
                `[:node/title "${uiTag}"]`,
                function a(before, after) { checkInbox(after, null); });

            if (uiSecondTag == true) {
                window.roamAlphaAPI.data.addPullWatch(
                    "[:block/_refs :block/uid :node/title]",
                    `[:node/title "${uiTag1}"]`,
                    function a(before, after) { checkInbox(null, after); });
            }
        }
    },
    onunload: () => {
        if (document.getElementById('unreadDiv')) {
            document.getElementById('unreadDiv').remove();
        }
        if (document.getElementById('unreadBadge')) {
            document.getElementById('unreadBadge').remove();
        }
        if (document.getElementById('unreadDiv1')) {
            document.getElementById('unreadDiv1').remove();
        }
        if (document.getElementById('unreadBadge1')) {
            document.getElementById('unreadBadge1').remove();
        }
        window.roamAlphaAPI.data.removePullWatch(
            "[:block/_refs :block/uid :node/title]",
            `[:node/title "${uiTag}"]`,
            function a(before, after) { checkInbox(after, null); });
        window.roamAlphaAPI.data.removePullWatch(
            "[:block/_refs :block/uid :node/title]",
            `[:node/title "${uiTag1}"]`,
            function a(before, after) { checkInbox(null, after); });
    }
}

function createDIVs() {
    if (uiMenu == true) { // make a menu div & destroy any shortcut badges
        if (document.getElementById('unreadBadge')) {
            document.getElementById('unreadBadge').remove();
        }
        if (document.getElementById('unreadDiv')) {
            document.getElementById('unreadDiv').remove();
        }
        if (!document.getElementById('unreadDiv')) {
            var div = document.createElement('Div');
            div.classList.add('log-button');
            div.innerHTML = uiTagName;
            div.id = 'unreadDiv';
            div.onclick = goToPage;
            var span = document.createElement('span');
            span.classList.add('bp3-icon', 'bp3-icon-' + uiMenuIcon, 'icon');
            div.prepend(span);
            var sidebarcontent = document.querySelector("#app > div.roam-body > div.roam-app > div.roam-sidebar-container.noselect > div"),
                sidebartoprow = sidebarcontent.childNodes[1];
            if (sidebarcontent && sidebartoprow) {
                sidebartoprow.parentNode.insertBefore(div, sidebartoprow.nextSibling);
            }
        }
    } else { // check for and destroy any menu divs
        if (document.getElementById('unreadDiv')) {
            document.getElementById('unreadDiv').remove();
        }
    }
    if (uiMenu1 == true && uiSecondTag == true) { // make a second menu div & destroy any shortcut badges
        if (document.getElementById('unreadBadge1')) {
            document.getElementById('unreadBadge1').remove();
        }
        if (document.getElementById('unreadDiv1')) {
            document.getElementById('unreadDiv1').remove();
        }
        if (!document.getElementById('unreadDiv1')) {
            var div = document.createElement('Div');
            div.classList.add('log-button');
            div.innerHTML = uiTagName1;
            div.id = 'unreadDiv1';
            div.onclick = goToPage1;
            var span = document.createElement('span');
            span.classList.add('bp3-icon', 'bp3-icon-' + uiMenuIcon1, 'icon');
            div.prepend(span);
            var sidebarcontent = document.querySelector("#app > div.roam-body > div.roam-app > div.roam-sidebar-container.noselect > div"),
                sidebartoprow = sidebarcontent.childNodes[2];
            if (sidebarcontent && sidebartoprow) {
                sidebartoprow.parentNode.insertBefore(div, sidebartoprow.nextSibling);
            }
        }
    } else { // check for and destroy any menu divs
        if (document.getElementById('unreadDiv1')) {
            document.getElementById('unreadDiv1').remove();
        }
    }
    checkInbox();
}

async function checkInbox(after, after1) {
    var shortcutDIV = undefined;
    var shortcutDIV1 = undefined;
    if (after != undefined && after != null && after.hasOwnProperty("[\":block/_refs\"]")) {
        unreadCount = after[":block/_refs"].length - uiOffset;
    } else {
        // thanks to David Vargas at https://github.com/dvargas92495/roam-client/blob/main/src/queries.ts#L263
        let search = await window.roamAlphaAPI.q(`[:find ?u ?s :where [?r :block/uid ?u] [?r :block/string ?s] [?r :block/refs ?p] [?p :node/title "${uiTag}"]]`);
        let finalSearch = [];
        if (search.length > 0) {
            for (var i = 0; i < search.length; i++) {
                if (!search[i][1].startsWith("{{[[query]]")) {
                    finalSearch.push(i);
                }
            }
        }
        unreadCount = finalSearch.length - uiOffset;
    }

    if (after1 != undefined && after1 != null && after1.hasOwnProperty("[\":block/_refs\"]") && uiSecondTag == true) {
        unreadCount1 = after1[":block/_refs"].length - uiOffset1;
    } else {
        let search = await window.roamAlphaAPI.q(`[:find ?u ?s :where [?r :block/uid ?u] [?r :block/string ?s] [?r :block/refs ?p] [?p :node/title "${uiTag1}"]]`);
        let finalSearch = [];
        if (search.length > 0) {
            for (var i = 0; i < search.length; i++) {
                if (!search[i][1].startsWith("{{[[query]]")) {
                    finalSearch.push(i);
                }
            }
        }
        unreadCount1 = finalSearch.length - uiOffset1;
    }

    if (unreadCount > 0) {
        if (uiMenu == false) {
            var shortcutLinks = document.querySelector(".starred-pages").getElementsByTagName('a');
            for (var i = 0; i < shortcutLinks.length; i++) {
                if (shortcutLinks[i].outerText == uiTag) {
                    shortcutDIV = shortcutLinks[i].lastChild;
                }
            }
            if (shortcutDIV == "undefined") {
                alert("Please make sure that you have made a shortcut to the tag you want to monitor!");
            }
            var shortcutLinks = document.querySelector(".starred-pages").getElementsByTagName('a');
        }
        var span = document.createElement('span');
        span.id = "unreadBadge";
        span.innerHTML = "" + unreadCount;
        if (!document.getElementById('unreadBadge')) {
            if (uiMenu == true) {
                span.style = 'color: ' + uiTextColour + '; background-color: ' + uiBGColour + '; display: inline-flex; ';
                document.getElementById("unreadDiv").appendChild(span);
            } else {
                span.style = 'color: ' + uiTextColour + '; background-color: ' + uiBGColour + '; display: inline-flex; ';
                if (shortcutDIV != undefined) {
                    shortcutDIV.appendChild(span);
                }
            }
        } else {
            document.getElementById('unreadBadge').style = 'color: ' + uiTextColour + '; background-color: ' + uiBGColour + '; display: inline-flex; ';
            document.getElementById("unreadBadge").innerHTML = unreadCount;
        }
    } else {
        if (document.getElementById('unreadBadge')) {
            document.getElementById('unreadBadge').style = 'color: ' + uiTextColour + '; background-color: ' + uiBGColour + '; display: none; ';
        }
    }
    if (unreadCount1 > 0 && uiSecondTag == true) {
        if (uiMenu1 == false) {
            var shortcutLinks = document.querySelector(".starred-pages").getElementsByTagName('a');
            for (var i = 0; i < shortcutLinks.length; i++) {
                if (shortcutLinks[i].outerText == uiTag1) {
                    shortcutDIV1 = shortcutLinks[i].lastChild;
                }
            }
            if (shortcutDIV1 == "undefined") {
                alert("Please make sure that you have made a shortcut to the tag you want to monitor!");
            }
        }
        var span1 = document.createElement('span');
        span1.id = "unreadBadge1";
        span1.innerHTML = "" + unreadCount1;
        if (!document.getElementById('unreadBadge1')) {
            if (uiMenu1 == true) {
                span1.style = 'color: ' + uiTextColour1 + '; background-color: ' + uiBGColour1 + '; display: inline-flex; ';
                document.getElementById("unreadDiv1").appendChild(span1);
            } else {
                span1.style = 'color: ' + uiTextColour1 + '; background-color: ' + uiBGColour1 + '; display: inline-flex; ';
                if (shortcutDIV1 != undefined) {
                    shortcutDIV1.appendChild(span1);
                }
            }
        } else {
            document.getElementById('unreadBadge1').style = 'color: ' + uiTextColour1 + '; background-color: ' + uiBGColour1 + '; display: inline-flex;';
            document.getElementById("unreadBadge1").innerHTML = unreadCount1;
        }
    } else {
        if (document.getElementById('unreadBadge1')) {
            document.getElementById('unreadBadge1').style = 'color: ' + uiTextColour1 + '; background-color: ' + uiBGColour1 + '; display: none;';
        }
    }
}

async function goToPage(e) {
    var shiftButton = false;
    var ctrlButton = false;
    if (e.shiftKey) {
        shiftButton = true;
    }
    if (e.ctrlKey) {
        ctrlButton = true;
    } else if (e.metaKey) {
        ctrlButton = true;
    }
    let uid = await window.roamAlphaAPI.q(`[:find ?uid :where [?e :node/title "${uiTag}"][?e :block/uid ?uid ] ]`)[0].toString();
    if (ctrlButton && shiftButton) {
        window.roamAlphaAPI.ui.rightSidebar.addWindow({ window: { type: 'mentions', 'block-uid': uid } });
    } else if (shiftButton) {
        window.roamAlphaAPI.ui.rightSidebar.addWindow({ window: { type: 'outline', 'block-uid': uid } });
    } else {
        window.roamAlphaAPI.ui.mainWindow.openBlock({ block: { uid: uid } });
    }
}

async function goToPage1(e) {
    var shiftButton = false;
    if (e.shiftKey) {
        shiftButton = true;
    }
    let uid = await window.roamAlphaAPI.q(`[:find ?uid :where [?e :node/title "${uiTag1}"][?e :block/uid ?uid ] ]`)[0].toString();
    if (shiftButton) {
        window.roamAlphaAPI.ui.rightSidebar.addWindow({ window: { type: 'outline', 'block-uid': uid } });
    } else {
        window.roamAlphaAPI.ui.mainWindow.openBlock({ block: { uid: uid } });
    }
}

function sendConfigAlert(key) {
    if (key == "tag") {
        alert("Please set the tag to monitor in the configuration settings via the Roam Depot tab.");
    } else if (key == "offset") {
        alert("Please set offset as an integer in the configuration settings via the Roam Depot tab.");
    }
}
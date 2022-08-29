const config = {
    tabTitle: "Unread Badge",
    settings: [
        {
            id: "ui-tag",
            name: "Tag to monitor",
            description: "Roam Research tag for which you want an unread badge",
            action: { type: "input", placeholder: "" },
        },
        {
            id: "ui-menu",
            name: "Add tag to menu",
            description: "Add a button for tag and badge to the left side bar menu. If switched off, this extension will look in Shortcuts for a link to the tag.",
            action: { type: "switch" },
        },
        {
            id: "ui-offset",
            name: "Count correction offset",
            description: "If your count is too high, use this number to correct",
            action: { type: "input", placeholder: "0" },
        },
        {
            id: "ui-textcolour",
            name: "Badge text colour",
            description: "Colour of badge text",
            action: { type: "input", placeholder: "white" },
        },
        {
            id: "ui-bgcolour",
            name: "Badge background colour",
            description: "Colour of badge background",
            action: { type: "input", placeholder: "red" },
        },
        {
            id: "ui-freq",
            name: "Frequency to update unread count",
            description: "How often to update in minutes",
            action: { type: "input", placeholder: "5" },
        }
    ]
};

export default {
    onload: ({ extensionAPI }) => {
        extensionAPI.settings.panel.create(config);

        var uiTag, uiOffset, uiTextColour, uiBGColour, uiFreq, key;
        var uiMenu = false;
        breakme: {
            if (extensionAPI.settings.get("ui-tag")) {
                uiTag = extensionAPI.settings.get("ui-tag");
            } else {
                key = "tag";
                sendConfigAlert(key);
                break breakme;
            }
            if (extensionAPI.settings.get("ui-offset")) {
                const regex = /^\d{1,2}$/;
                if (regex.test(extensionAPI.settings.get("ui-offset"))) {
                    uiOffset = extensionAPI.settings.get("ui-offset");
                } else {
                    key = "offset";
                    sendConfigAlert(key);
                    break breakme;
                }
            } else {
                uiOffset = "0";
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
            if (extensionAPI.settings.get("ui-freq")) {
                const regex = /^\d{1,2}$/;
                if (extensionAPI.settings.get("ui-freq").match(regex)) {
                    uiFreq = extensionAPI.settings.get("ui-freq");
                } else {
                    key = "freq";
                    sendConfigAlert(key);
                    break breakme;
                }
            } else {
                uiFreq = "3";
            }

            if (extensionAPI.settings.get("ui-menu") == true) { // make a menu div
                uiMenu = true;
                if (!document.getElementById(uiTag + 'Div')) {
                    var div = document.createElement('div');
                    div.classList.add('log-button');
                    div.innerHTML = uiTag;
                    div.id = 'unreadDiv';
                    div.onclick = goToPage;
                    var span = document.createElement('span');
                    span.classList.add('bp3-icon', 'bp3-icon-home', 'icon');
                    div.prepend(span);
                    var sidebarcontent = document.querySelector("#app > div.roam-body > div.roam-app > div.roam-sidebar-container.noselect > div"),
                        sidebartoprow = sidebarcontent.childNodes[2];
                    if (sidebarcontent && sidebartoprow) {
                        sidebartoprow.parentNode.insertBefore(div, sidebartoprow.nextSibling);
                    }
                }
            }

            async function goToPage(e) {
                var shiftButton = false;
                if (e.shiftKey) {
                    shiftButton = true;
                }
                let uid = await window.roamAlphaAPI.q(`[:find ?uid :where [?e :node/title "${uiTag}"][?e :block/uid ?uid ] ]`)[0].toString();
                if (shiftButton) {
                    window.roamAlphaAPI.ui.rightSidebar.addWindow({ window: { type: 'outline', 'block-uid': uid } });
                } else {
                    window.roamAlphaAPI.ui.mainWindow.openBlock({ block: { uid: uid } });
                }
            }

            async function checkInbox() {
                let unreadCount = window.roamAlphaAPI
                    .q(
                        `[:find ?u :where [?r :block/uid ?u] [?r :block/refs ?p] [?p :node/title "${uiTag}"]]`
                    )
                    .map((s) => s[0]).length - uiOffset;
                console.info(unreadCount);
                if (unreadCount > 0) {
                    if (uiMenu == false) {
                        var shortcutLinks = document.querySelector(".starred-pages").getElementsByTagName('a');
                        for (var i = 0; i < shortcutLinks.length; i++) {
                            if (shortcutLinks[i].outerText == uiTag) {
                                var shortcutDIV = shortcutLinks[i].lastChild;
                            }
                        }
                        var shortcutLinks = document.querySelector(".starred-pages").getElementsByTagName('a');
                        console.info(shortcutLinks)
                    }
                    var span = document.createElement('span');
                    span.id = "unreadBadge";
                    span.innerHTML = " " + unreadCount;
                    if (!document.getElementById('unreadBadge')) {
                        if (uiMenu == true) {
                            span.style = 'display: inline; margin-left: 5px; color: ' + uiTextColour + '; background-color: ' + uiBGColour + '; border-radius: 50%; padding-left: 2px; padding-right: 3px;';
                            document.getElementById("unreadDiv").appendChild(span);
                        } else {
                            span.style = 'display: inline; margin-left: 5px; color: ' + uiTextColour + '; background-color: ' + uiBGColour + '; border-radius: 50%; padding-right: 3px;';
                            shortcutDIV.appendChild(span);
                        }
                    } else {
                        document.getElementById("unreadBadge").innerHTML = unreadCount;
                    }
                } else {
                    if (document.getElementById('unreadBadge')) {
                        document.getElementById('unreadBadge').style = "display: none;";
                    }
                }
            }

            checkInbox();
            try { if (window.inboxInterval > 0) clearInterval(window.inboxInterval) } catch (e) { }
            window.inboxInterval = setInterval(async () => {
                await checkInbox()
            }, uiFreq * 60000);
        }
    },
    onunload: () => {
        if (document.getElementById('unreadDiv')) {
            document.getElementById('unreadDiv').remove();
        }
        if (document.getElementById('unreadBadge')) {
            document.getElementById('unreadBadge').remove();
        }
    }
}

function sendConfigAlert(key) {
    if (key == "tag") {
        alert("Please set the tag to monitor in the configuration settings via the Roam Depot tab.");
    } else if (key == "offset") {
        alert("Please set offset as an integer in the configuration settings via the Roam Depot tab.");
    } else if (key == "freq") {
        alert("Please set frequency in minutes in the configuration settings via the Roam Depot tab.");
    }
}
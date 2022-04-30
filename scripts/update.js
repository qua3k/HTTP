// @ts-nocheck
"use strict";

const textarea = document.querySelector("textarea");
const rules = "dynamicRules";

// listen for changes in other documents
window.onstorage = (e) => {
    if (e.key === rules) {
        textarea.value = e.newValue ?? "";
    }
};

async function removeRules() {
    const sessionRules = new Array();
    await chrome.declarativeNetRequest.getSessionRules().then((set) => {
        set.forEach((r) => { sessionRules.push(r.id); });
    });
    return sessionRules
}

function createRule(index, url) {
    return {
        "id": index,
        "priority": 100,
        "action": { "type": "allow" },
        "condition": {
            "isUrlFilterCaseSensitive": false,
            "urlFilter": url,
            "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"]
        }
    };
}

textarea.addEventListener("change", async () => {
    const removedRules = await removeRules();
    const domains = textarea.value.split(/\s+/);
    const sessionRules = new Array();
    domains.forEach((domain, index) => {
        let url;
        try {
            if (!domain.startsWith("http://") || !domain.startsWith("https://")) {
                domain = "http://" + domain;
            }
            url = new URL(domain);
        }
        catch {
            return;
        }
        sessionRules.push(createRule(index+1, url.hostname));
    });
    chrome.declarativeNetRequest.updateSessionRules({
        addRules: sessionRules,
        removeRuleIds: removedRules
    });
    localStorage.setItem(rules, textarea.value);
});

textarea.value = localStorage.getItem(rules) ?? "";

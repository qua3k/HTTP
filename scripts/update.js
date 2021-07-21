"use strict";

const textarea = document.querySelector("textarea");

(textarea).value = localStorage.getItem("dynamicRules");

textarea.addEventListener("change", () => {
    localStorage.setItem("dynamicRules", (textarea).value);
    const domainArray = textarea.value.split("\n");
    domainArray.forEach((d, i) => {
        const domainIndex = i + 2;
        chrome.declarativeNetRequest.updateSessionRules({
            addRules: [{
                "id": domainIndex,
                "priority": 100,
                "action": { "type" : "allow"},
                "condition": {
                    "urlFilter" : d,
                    "resourceTypes" : ["main_frame"]
                }
            }],
            removeRuleIds: [domainIndex]
        });
    });
});
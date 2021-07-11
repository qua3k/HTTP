"use strict";

chrome.runtime.onInstalled.addListener(function() {
    chrome.action.setBadgeText({text: "S"});
    chrome.action.setBadgeBackgroundColor({color: "#086de0"});
});
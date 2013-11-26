"use strict";

// Register this add-on to TrackingObserver with the main extension
var to_id = "obheeflpdipmaefcoefhimnaihmhpkao";

console.log("REGISTERING");
    
chrome.runtime.sendMessage(to_id, 
    {type : 'registerAddon', 
    name : 'TabInfo'},
    function(response) {
        console.log(response);
    }
);

var countPerTabId = {};
var domainSeenOnTab = {};

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if (request.type == "trackingNotification") {
            //console.log("tracking notification for tabid " + request.tabId);
            if (!countPerTabId[request.tabId]) {
                countPerTabId[request.tabId] = 0;
		domainSeenOnTab[request.tabId] = {};
            }
            if (!domainSeenOnTab[request.tabId][request.domain]) {
                domainSeenOnTab[request.tabId][request.domain] = true;
            } else {
                return;
            }
            countPerTabId[request.tabId] = countPerTabId[request.tabId] + 1;
            chrome.browserAction.setBadgeText(
                {text: (countPerTabId[request.tabId]).toString(), tabId: request.tabId});
        }
    }
);

// Fires whenever a tab is updated
chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab) {
		// Reset whwnever tab loading starts to catch
		// reloads and switches to new domain
		if (changeInfo.status == "loading")
		{
			countPerTabId[tabId] = 0;
			domainSeenOnTab[tabId] = {};
		}
	}
);

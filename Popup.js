// JavaScript associated with popup page

var to_id = "obheeflpdipmaefcoefhimnaihmhpkao";

// Get trackers on current tab as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
	chrome.runtime.sendMessage(to_id, {type : 'getTrackersOnCurrentTab'},
		function(trackerMap) {
            createHtmlForTrackerList(trackerMap);
	});
});

function createHtmlForTrackerList(trackerMap) {
	if (!trackerMap) {
		setHtmlForTrackerList("<b>No trackers here! :)</b>");
        return;
    }

    var html = "<b>Trackers on Current Page:</b>";
    recursivelyBuildHtmlForTrackerList(html, 0, trackerMap);
}
    
    
function recursivelyBuildHtmlForTrackerList(html, index, trackerMap) {
    var trackerList = Object.keys(trackerMap);
    
    if (trackerList.length == index) {
        setHtmlForTrackerList(html, trackerMap);
        return;
    }
    
    var domain = trackerList[index];
    var catList = trackerMap[domain];
    var categories = "";
	for (var i in catList) {
		categories += catList[i]; 
	}
    var category = (categories != "") ? (" -- Category " + categories) : "";
    
    chrome.runtime.sendMessage(to_id, {type: 'trackerDomainBlocked', domain: domain},
        function(response) {
            
            if (response.blocked) {
                html += "<br>" + getUnblockLink(domain) + "<del>" + domain + "</del>";
            } else {
                html += "<br>" + getBlockLink(domain) 
                    + domain + category;
            }
        recursivelyBuildHtmlForTrackerList(html, index+1, trackerMap);
        });
}

function getBlockLink(domain) {
    return "[<a class='block' id='" + domain + "' href='#'>block</a>] ";
}

function getUnblockLink(domain) {
    return "[<a class='unblock' id='" + domain + "' href='#'>unblock</a>] ";
}

function setHtmlForTrackerList(html, trackerMap) {
    var bodyDiv = document.getElementById("bodyDiv");
    bodyDiv.innerHTML = html;
    
    // Set up listeners for block/unblock links
    for (var tracker in trackerMap) {
        var link = document.getElementById(tracker);
        if (link.getAttribute("class") == "unblock") {
        
            (function (_tracker) {
                link.addEventListener('click', function() {
                    chrome.runtime.sendMessage(to_id, {type: 'unblockTrackerDomain', domain: _tracker});
                    location.reload(true);
                });
            })(tracker);
        
        } else if (link.getAttribute("class") == "block") {
        
            (function (_tracker) {
                link.addEventListener('click', function() {
                    chrome.runtime.sendMessage(to_id, {type: 'blockTrackerDomain', domain: _tracker});
                    location.reload(true);
                });
            })(tracker);
        
        }
    
    }
}

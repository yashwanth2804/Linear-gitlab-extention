// background.js

// Listen for URL changes in the tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the status is 'complete' to ensure the page has fully loaded
    if (changeInfo.status === 'complete') {
        chrome.tabs.get(tabId, function (tab) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            } else {
                chrome.tabs.sendMessage(tabId, { action: 'updateContent', url: tab.url }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.log('Error sending message:', chrome.runtime.lastError.message);
                    } else if (response) {
                        console.log('Message sent successfully');
                    }
                });
            }
        });
    }
});
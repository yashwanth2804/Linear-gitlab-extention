// background.js

// Listen for URL changes in the tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("@@ changeInfo URL updates", changeInfo)
    // Check if the status is 'complete' to ensure the page has fully loaded
    if (changeInfo.status === 'complete') {

        // Send a message to the content script to update the page
        chrome.tabs.sendMessage(tabId, { action: 'updateContent', url: tab.url });
    }
});

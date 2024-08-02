// popup.js
document.getElementById('urlForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var gitlabUrl = document.getElementById('gitlabUrl').value;

    // Save the URL to Chrome storage
    chrome.storage.sync.set({ gitlabUrl: gitlabUrl }, function () {
        document.getElementById('status').textContent = 'URL saved!';
    });
});

// Load the saved URL when the popup is opened
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['gitlabUrl'], function (result) {
        if (result.gitlabUrl) {
            document.getElementById('gitlabUrl').value = result.gitlabUrl;
        }
    });
});

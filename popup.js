// popup.js
document.getElementById('urlForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var gitlabUrl = document.getElementById('gitlabUrl').value;
    var gitlabUrlSelect = document.getElementById('gitlabUrlSelect').value;


    // Save the URL to Chrome storage
    chrome.storage.sync.set({ gitlabUrl: gitlabUrl, gitlabUrlSelect: gitlabUrlSelect }, function () {
        document.getElementById('status').textContent = 'Data saved!';

    });
});

// Load the saved URL when the popup is opened
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['gitlabUrl', 'gitlabUrlSelect'], function (result) {
        if (result.gitlabUrl) {
            document.getElementById('gitlabUrl').value = result.gitlabUrl;
        }

        if (result.gitlabUrlSelect) {
            document.getElementById('gitlabUrlSelect').value = result.gitlabUrlSelect;
        }
    });
});

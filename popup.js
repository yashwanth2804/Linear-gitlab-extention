// popup.js
document.getElementById('urlForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var gitlabUrl = document.getElementById('gitlabUrl').value;
    var branchFormat = document.getElementById('branchFormat').value;
    var username = document.getElementById('username').value;

    // Save the URL to Chrome storage
    chrome.storage.sync.set({ gitlabUrl: gitlabUrl, branchFormat: branchFormat, username: username }, function () {
        document.getElementById('status').textContent = 'Data saved!';
    });
});

// Load the saved URL when the popup is opened
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['gitlabUrl', 'branchFormat', 'username'], function (result) {
        if (result.gitlabUrl) {
            document.getElementById('gitlabUrl').value = result.gitlabUrl;
        }

        if (result.branchFormat) {
            document.getElementById('branchFormat').value = result.branchFormat;
        }

        if (result.username) {
            document.getElementById('username').value = result.username;
        }
    });
});

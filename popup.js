// popup.js
document.getElementById('urlForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;
    const selectedService = document.querySelector('input[name="gitService"]:checked').value;
    const gitUrl = document.getElementById('gitUrl').value;

    var branchFormat = document.getElementById('branchFormat').value;
    var username = document.getElementById('username').value;

    // Save the URL to Chrome storage
    chrome.storage.sync.set({ selectedService: selectedService, gitUrl: gitUrl, branchFormat: branchFormat, username: username }, function () {
        document.getElementById('status').textContent = 'Data saved!';
        // Show the hint to reload
        document.getElementById('hint').style.display = 'block';

    });
});

function validateForm() {
    const gitUrl = document.getElementById('gitUrl').value;
    const username = document.getElementById('username').value;
    const branchFormat = document.getElementById('branchFormat').value;

    if (!gitUrl || !username || !branchFormat) {
        alert('Please fill in all fields');
        return false;
    }

    // Basic URL validation
    if (!/^https?:\/\/.+/.test(gitUrl)) {
        alert('Please enter a valid URL');
        return false;
    }

    return true;
}
// Load the saved URL when the popup is opened
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['selectedService', 'gitUrl', 'branchFormat', 'username'], function (result) {
        if (result.selectedService) {
            document.getElementById(result.selectedService).checked = true;
        }

        if (result.gitUrl) {
            document.getElementById('gitUrl').value = result.gitUrl;
        }

        if (result.branchFormat) {
            document.getElementById('branchFormat').value = result.branchFormat;
        }

        if (result.username) {
            document.getElementById('username').value = result.username;
        }
    });
});

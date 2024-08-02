// let gitlab_base_url = "https://gitlab.com/vizencode/vizencode-gpt4o-extention/"
function addGitLabLink(plink) {
    console.log("@@ got URL link ", plink);
    const currentPageUrl = plink;
    const parts = currentPageUrl.split('/');
    const lastPart = parts[parts.length - 1];
    const sto69 = parts[parts.length - 2].toLowerCase();
    const lastSection = formatString(lastPart);
    const lastSlashContent = `${sto69}-${lastSection}`;


    // Get the base GitLab URL from storage
    chrome.storage.sync.get(['gitlabUrl'], function (result) {

        gitlab_base_url = trimTrailingSlash(result.gitlabUrl);
        console.log("@@ got storage ", gitlab_base_url);
        const appendGitLabLink = () => {


            // Find the "Copy issue URL" button
            var copyIssueButton = document.querySelector('button[aria-label="Issue options"]');
            console.log("@@ got copy issue button ", copyIssueButton);

            if (copyIssueButton) {
                // Get the parent node of the issueOptionsButton
                var _parentNode = copyIssueButton.parentNode;

                // Check if the GitLab link already exists
                var existingLink = _parentNode.parentNode.querySelector('a.gitlab-link');
                console.log("@@ existingLink ", existingLink);
                if (!existingLink) {
                    // Create a new link element
                    var gitLabLink = document.createElement('a');
                    gitLabLink.className = 'gitlab-link';
                    gitLabLink.href = `${gitlab_base_url}/-/tree/feature/${lastSlashContent}`;
                    gitLabLink.target = '_blank';
                    // gitLabLink.innerHTML = 'GitLab'; // Add the label "GitLab"
                    gitLabLink.style.marginLeft = '10px'; // Optional: Add some margin for better spacing

                    const container = document.createElement('span');
                    const svg = `<svg fill="#000000" width="24px" height="24px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M227.37415,163.20266l-94.82044,65.645a8.00047,8.00047,0,0,1-9.10736,0l-94.82043-65.645a8.00029,8.00029,0,0,1-3.17621-8.63916L52.77905,52.07863a4,4,0,0,1,7.61023-.374L83,112h90l22.61072-60.29541a4.00007,4.00007,0,0,1,7.61029.374L230.55035,154.5635A8.0003,8.0003,0,0,1,227.37415,163.20266Z" opacity="0.2"></path><path d="M238.28027,152.50246,210.95068,50.01662a12.00021,12.00021,0,0,0-22.83056-1.12109L167.45605,104H88.544L67.87988,48.89651a12.00012,12.00012,0,0,0-22.831,1.12109L17.71973,152.50246a16.03981,16.03981,0,0,0,6.35254,17.27783l94.82031,65.64454a16.07612,16.07612,0,0,0,18.21484,0l94.82031-65.64454A16.03981,16.03981,0,0,0,238.28027,152.50246ZM128,222.26955,33.17969,156.625,57.2876,66.21877,75.50928,114.8091A7.99963,7.99963,0,0,0,83,120h90a7.99963,7.99963,0,0,0,7.49072-5.19092L198.7124,66.21877,222.82031,156.625Z"></path></svg>`;
                    const svgContainer = document.createElement('div');
                    svgContainer.innerHTML = svg;
                    svgContainer.style.display = 'inline-block';
                    svgContainer.style.verticalAlign = 'middle';

                    const text = document.createTextNode(' GitLab');
                    container.appendChild(svgContainer);
                    container.appendChild(text);

                    gitLabLink.appendChild(container);

                    // Insert the new link before the "Copy issue URL" button
                    _parentNode.parentNode.insertBefore(gitLabLink, _parentNode.nextSibling);
                } else {
                    console.log("@@ found existing link ", existingLink);
                    existingLink.href = `https://gitlab.com/vizencode/vizencode-gpt4o-extention/-/tree/feature/${lastSlashContent}`
                }
                // Disconnect the observer once the button is found
                observer.disconnect();
            } else {
                console.log('Copy issue URL button not found.');
            }

        };
        // Define a function to append the GitLab link

        // Observe changes in the DOM
        const observer = new MutationObserver(() => {
            appendGitLabLink();
        });

        // Start observing
        observer.observe(document.body, { childList: true, subtree: true });

        // Also call it once to check immediately after the script runs
        appendGitLabLink();
    })


}

function formatString(input, maxLength = 56) {
    let formatted = input.replace(/\s+/g, '-');
    if (formatted.length > maxLength) {
        const lastHyphenIndex = formatted.lastIndexOf('-', maxLength);
        const cutOffIndex = lastHyphenIndex !== -1 ? lastHyphenIndex : maxLength;
        formatted = formatted.slice(0, cutOffIndex);
    }
    return formatted;
}


// Trim trailing slash from the URL if it exists
function trimTrailingSlash(url) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('@@ message --->', message);
    if (message.action === 'updateContent') {
        addGitLabLink(message.url);
        sendResponse({ status: 'Content updated' });
    }
});

const DEFAULT_MAX_LENGTH = 60;

// Configuration
const config = {
    gitlabUrl: '',
    branchFormat: '',
    username: ''
};

// DOM Selectors
const selectors = {
    copyIssueButton: 'button[aria-label="Issue options"]',
    existingLink: 'a.gitlab-link'
};

// Main function
function addGitLabLink(pageUrl) {
    chrome.storage.sync.get(['gitlabUrl', 'branchFormat', 'username'], (result) => {
        Object.assign(config, result);
        const branchIdentifier = createBranchIdentifier(pageUrl);
        const gitlabUrl = createGitlabUrl(branchIdentifier);
        appendOrUpdateGitLabLink(gitlabUrl);
    });
}

// Branch identifier creation
function createBranchIdentifier(pageUrl) {
    const parts = pageUrl.split('/');
    const lastPart = parts[parts.length - 1];
    const identifier = parts[parts.length - 2].toLowerCase();
    const title = formatString(lastPart);
    return getBranchFormat(identifier, title);
}

// Branch format selection
function getBranchFormat(identifier, title) {
    const formats = {
        'username/identifier-title': () => `${config.username}/${identifier}-${title}`,
        'username/identifier': () => `${config.username}/${identifier}`,
        'username-identifier-title': () => `${config.username}-${identifier}-${title}`,
        'username-identifier': () => `${config.username}-${identifier}`,
        'identifier-title': () => `${identifier}-${title}`,
        'title-identifier': () => `${title}-${identifier}`,
        'identifier': () => identifier,
        'feature/identifier-title': () => `feature/${identifier}-${title}`,
        'feature/identifier': () => `feature/${identifier}`
    };
    return (formats[config.branchFormat] || (() => ''))();
}

// GitLab URL creation
function createGitlabUrl(branchIdentifier) {
    const baseUrl = trimTrailingSlash(config.gitlabUrl);
    return `${baseUrl}/-/tree/${branchIdentifier}`;
}

// DOM manipulation
function appendOrUpdateGitLabLink(gitlabUrl) {
    const appendGitLabLink = () => {
        const copyIssueButton = document.querySelector(selectors.copyIssueButton);
        if (!copyIssueButton) return;

        const parentNode = copyIssueButton.parentNode.parentNode;
        let gitLabLink = parentNode.querySelector(selectors.existingLink);

        if (!gitLabLink) {
            gitLabLink = createGitLabLinkElement(gitlabUrl);
            parentNode.insertBefore(gitLabLink, copyIssueButton.parentNode.nextSibling);
        } else {
            gitLabLink.href = gitlabUrl;
        }

        observer.disconnect();
    };

    const observer = new MutationObserver(appendGitLabLink);
    observer.observe(document.body, { childList: true, subtree: true });
    appendGitLabLink();
}

// GitLab link element creation
function createGitLabLinkElement(url) {
    const link = document.createElement('a');
    link.className = 'gitlab-link';
    link.href = url;
    link.target = '_blank';
    link.style.marginLeft = '10px';

    const container = document.createElement('span');
    const svgContainer = document.createElement('div');
    svgContainer.innerHTML = getGitLabSvg();
    svgContainer.style.display = 'inline-block';
    svgContainer.style.verticalAlign = 'middle';

    container.appendChild(svgContainer);
    container.appendChild(document.createTextNode(' GitLab'));
    link.appendChild(container);

    return link;
}

// Utility functions
function formatString(input, maxLength = DEFAULT_MAX_LENGTH) {
    let formatted = input.replace(/\s+/g, '-');
    if (formatted.length > maxLength) {
        const lastHyphenIndex = formatted.lastIndexOf('-', maxLength);
        const cutOffIndex = lastHyphenIndex !== -1 ? lastHyphenIndex : maxLength;
        formatted = formatted.slice(0, cutOffIndex);
    }
    return formatted;
}

function trimTrailingSlash(url) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

function getGitLabSvg() {
    return `<svg fill="#000000" width="24px" height="24px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M227.37415,163.20266l-94.82044,65.645a8.00047,8.00047,0,0,1-9.10736,0l-94.82043-65.645a8.00029,8.00029,0,0,1-3.17621-8.63916L52.77905,52.07863a4,4,0,0,1,7.61023-.374L83,112h90l22.61072-60.29541a4.00007,4.00007,0,0,1,7.61029.374L230.55035,154.5635A8.0003,8.0003,0,0,1,227.37415,163.20266Z" opacity="0.2"></path>
        <path d="M238.28027,152.50246,210.95068,50.01662a12.00021,12.00021,0,0,0-22.83056-1.12109L167.45605,104H88.544L67.87988,48.89651a12.00012,12.00012,0,0,0-22.831,1.12109L17.71973,152.50246a16.03981,16.03981,0,0,0,6.35254,17.27783l94.82031,65.64454a16.07612,16.07612,0,0,0,18.21484,0l94.82031-65.64454A16.03981,16.03981,0,0,0,238.28027,152.50246ZM128,222.26955,33.17969,156.625,57.2876,66.21877,75.50928,114.8091A7.99963,7.99963,0,0,0,83,120h90a7.99963,7.99963,0,0,0,7.49072-5.19092L198.7124,66.21877,222.82031,156.625Z"></path>
    </svg>`;
}

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateContent') {
        addGitLabLink(message.url);
        sendResponse({ status: 'Content updated' });
    }
});
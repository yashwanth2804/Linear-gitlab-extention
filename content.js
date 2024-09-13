const DEFAULT_MAX_LENGTH = 60;

// Configuration
const config = {
    selectedService: '',
    gitUrl: '',
    branchFormat: '',
    username: ''
};

// DOM Selectors
const selectors = {
    copyIssueButton: 'button[aria-label="Issue options"]',
    existingLink: 'a.git-link'
};

// Main function
function addGitLabLink(pageUrl) {
    chrome.storage.sync.get(['selectedService', 'gitUrl', 'branchFormat', 'username'], (result) => {
        Object.assign(config, result);
        const branchIdentifier = createBranchIdentifier(pageUrl);
        let gitUrl = "";
        // check git service if github or gitlab
        if (config.selectedService === 'github') {
            gitUrl = createGitHubUrl(branchIdentifier);
            appendOrUpdateGitLabLink(gitUrl, 'github');

        }

        if (config.selectedService === 'gitlab') {
            gitUrl = createGitlabUrl(branchIdentifier);
            appendOrUpdateGitLabLink(gitUrl, 'gitlab');

        }
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
    const baseUrl = trimTrailingSlash(config.gitUrl);
    return `${baseUrl}/-/tree/${branchIdentifier}`;
}

function createGitHubUrl(branchIdentifier) {
    const baseUrl = trimTrailingSlash(config.gitUrl);
    return `${baseUrl}/tree/${branchIdentifier}`;
}

// DOM manipulation
function appendOrUpdateGitLabLink(_gitUrl, _service) {
    const appendGitLabLink = () => {
        const copyIssueButton = document.querySelector(selectors.copyIssueButton);
        if (!copyIssueButton) return;

        const parentNode = copyIssueButton.parentNode.parentNode;
        let gitLinkNode = parentNode.querySelector(selectors.existingLink);

        if (!gitLinkNode) {
            gitLinkNode = _service === 'github' ? createGitHubLinkElement(_gitUrl) : createGitLabLinkElement(_gitUrl);
            parentNode.insertBefore(gitLinkNode, copyIssueButton.parentNode.nextSibling);
        } else {
            gitLinkNode.href = _gitUrl;
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
    link.className = 'git-link';
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

function createGitHubLinkElement(url) {
    const link = document.createElement('a');
    link.className = 'git-link';
    link.href = url;
    link.target = '_blank';
    link.style.marginLeft = '10px';

    const container = document.createElement('span');
    const svgContainer = document.createElement('div');
    svgContainer.innerHTML = getGitHubSvg();
    svgContainer.style.display = 'inline-block';
    svgContainer.style.verticalAlign = 'middle';

    container.appendChild(svgContainer);
    container.appendChild(document.createTextNode(' GitHub'));
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
    formatted = formatted.replace(/\[|\]/g, '');
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

function getGitHubSvg() {
    return `<svg fill="#000000" width="24px" height="24px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
  <path d="M200,112v8a47.99987,47.99987,0,0,1-48,48H104a47.99987,47.99987,0,0,1-48-48v-8a49.25725,49.25725,0,0,1,8.51172-27.29639A51.90015,51.90015,0,0,1,68,40a51.96059,51.96059,0,0,1,43.8252,23.99927l32.3496.00049A51.95917,51.95917,0,0,1,188,40a51.90015,51.90015,0,0,1,3.48828,44.70361A49.25725,49.25725,0,0,1,200,112Z" opacity="0.2"/>
  <path d="M216,216a16.01833,16.01833,0,0,1-16-16v-8a31.9949,31.9949,0,0,0-14.78076-26.95068A55.951,55.951,0,0,0,208,120v-8a58.04124,58.04124,0,0,0-7.69531-28.32031A59.73339,59.73339,0,0,0,194.92822,36,7.99908,7.99908,0,0,0,188,32a59.74792,59.74792,0,0,0-48.00781,24l-23.98487-.001A59.74952,59.74952,0,0,0,68,32a7.99908,7.99908,0,0,0-6.92822,4,59.73551,59.73551,0,0,0-5.377,47.67969A58.0419,58.0419,0,0,0,48,112v8a55.951,55.951,0,0,0,22.78076,45.04932A31.9949,31.9949,0,0,0,56,192v8a16.01833,16.01833,0,0,1-16,16,8,8,0,0,0,0,16,32.03667,32.03667,0,0,0,32-32v-8a16.01833,16.01833,0,0,1,16-16h12v40a16.01833,16.01833,0,0,1-16,16,8,8,0,0,0,0,16,32.03667,32.03667,0,0,0,32-32V176h24v40a32.03667,32.03667,0,0,0,32,32,8,8,0,0,0,0-16,16.01833,16.01833,0,0,1-16-16V176h12a16.01833,16.01833,0,0,1,16,16v8a32.03667,32.03667,0,0,0,32,32,8,8,0,0,0,0-16ZM64,120v-8A41.77977,41.77977,0,0,1,70.90088,89.5176a7.99937,7.99937,0,0,0,1.07666-7.6875,43.82564,43.82564,0,0,1,.78906-33.5752,43.84232,43.84232,0,0,1,32.32129,20.05762,7.99912,7.99912,0,0,0,6.73682,3.68652L144.17432,72h.00048a8.00058,8.00058,0,0,0,6.73731-3.68652A43.84259,43.84259,0,0,1,183.2334,48.2549a43.8234,43.8234,0,0,1,.78857,33.5752,8.08338,8.08338,0,0,0,1.04932,7.65039A41.7664,41.7664,0,0,1,192,112v8a40.04551,40.04551,0,0,1-40,40H104A40.04551,40.04551,0,0,1,64,120Z"/>
</svg>`;
}


// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateContent') {
        addGitLabLink(message.url);
        sendResponse({ status: 'Content updated' });
    }
});
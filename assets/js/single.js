var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function(repo) {
// grab repo name from url query string
var queryString = document.location.search;
var repoName = queryString.split("=")[1];

if (repoName) {
    // display repo name on the page
    repoNameEl.textContent = repoName;

    getRepoIssues(repoName);
} else {
    // if no repo was given, redirect to the homepage
    document.location.replace("./index.html");
}
};

var getRepoIssues = function (repo) {
console.log(repo);
var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

fetch(apiUrl).then(function (response) {
//request successful
if (response.ok) {
    response.json().then(function (data) {
    displayIssues(data);

    // check if api has paginated issues
    if (response.headers.get("Link")) {
        displayWarning(repo);
      }
    });
} else {
    //if not successful rerouted to homepage
    document.location.replace("./index.html");
    }
  });
};

var displayIssues = function (issues) {
if (issues.length === 0) {
issueContainerEl.textContent = "This repo has no issues!";
return;
}

for (var i = 0; i < issues.length; i++) {
//create a link element to take users to the issue on github
var issueEl = document.createElement("a");
issueEl.classList =
    "list-item flex-row justify-space-inbetween align-center";
issueEl.setAttribute("href", issues[i].html_url);
issueEl.setAttribute("target", "_blank");

//create span to hold the issue title
var titleEl = document.createElement("span");
titleEl.textContent = issues[i].title;

//append to container
issueEl.appendChild(titleEl);

//create a type element
var typeEl = document.createElement("span");

//check if issue is an actual issue or pull request
if (issues[i].pull_request) {
    typeEl.textContent = "(Pull request)";
} else {
    typeEl.textContent = "(Issue)";
}
//append to container
issues.appendChild(typeEl);

//append to  DOM
issueContainerEl.appendChild(issueEl);
  }
};

var displayWarning = function (repo) {
// add text to warning container
limitWarningEl.textContent = "To see more than 30 issues, visit ";

//create link element
var linkEl = document.createElement("a");
linkEl.textContent = "GitHub.com";
linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
linkEl.setAttribute("target", "_blank");

// append to warning container
limitWarningEl.appendChild(linkEl);
};

getRepoName();
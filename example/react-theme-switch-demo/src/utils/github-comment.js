let isLoaded = false;

// add comments plugin
function addGithubComment(ele) {
    let script = document.createElement("script");

    script.setAttribute("src", "https://utteranc.es/client.js");
    script.setAttribute("repo", "huangshuwei/comments");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-dark");
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("async", "");

    document.querySelector(ele).appendChild(script);

    script.onload = (res) => {

        console.log("comments plugin 11111::",res);
        isLoaded = true;
    };

    script.onerror = () => {
        console.log("comments plugin error");
    };
}

// set comment theme
function setGithubCommentTheme(ele, themeName) {
    let githubComments = document.querySelector(ele);
    if (githubComments && isLoaded) {
        const message = {
            type: "set-theme",
            theme: themeName === "theme-black" ? "github-dark" : "github-light"
        };

        try {
            githubComments.contentWindow.postMessage(
                message,
                "https://utteranc.es"
            );
        } catch (error) {}
    }
}

export { addGithubComment, setGithubCommentTheme };

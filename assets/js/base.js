//½âÎöurl
function parseURL(urls) {
    return urls ? urls.split(",").filter(function (url) {
        url = url.replace(/^http(s)?:\/\/|\/\//g, "").split(".");
        if (url.length > 1) {
            var fix = url[url.length - 1];
            var host = url.slice(0, url.length - 1);
            return /^[a-zA-Z]{2,10}$/.test(fix) && host.every(function (item) {
                    return /^[0-9a-zA-Z]+(-?[0-9a-zA-Z])*$/.test(item)
                })
        }
        return false;
    }).map(function (url) {
        return url.replace(/^http(s)?:\/\/|\/\//g, "");
    }) : []
}
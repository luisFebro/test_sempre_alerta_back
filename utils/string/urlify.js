// https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
// file not being recognized for now.
export default function urlify(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url, b, c) {
        var url2 = c == "www." ? "http://" + url : url;
        return '<a href="' + url2 + '" target="_blank">' + url + "</a>";
    });
}

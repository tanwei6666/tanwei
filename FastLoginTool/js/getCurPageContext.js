
// 获取当前页面的host和pathname，为Ajax获取webSerivce提供地址
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == "getCurPageContext") {
            sendResponse({
                originHost: document.location.origin,
                pathName: document.location.pathname,
                token: GetQueryString('token')
            });
        }
    }
);

// 从URL中获取指定name的参数值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]); return null;
}
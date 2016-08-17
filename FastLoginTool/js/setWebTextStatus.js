
var webTextCookieName = "webTextEnable";

// 由于localStorage是基于域名的，所以content_scripts不能直接读取localStorage，而是需要通过与background通信获取而来。
chrome.extension.sendRequest({ type: 'getLocalStorage_webTextStatus' }, function (response) {

    if (response.pluginEnabled && response.webTextConfigs) {
        webTextConfigs = response.webTextConfigs;
        var isEnable = webTextConfigs && webTextConfigs.webTextEnable && webTextConfigs.webTextEnable == 'true'
        writeWebTextCookies(isEnable);
    } else {
        writeWebTextCookies(false);
    }
});

// 设置报文调试工具的启用/禁用状态
function writeWebTextCookies(enable) {
    if (enable) {
        setCookie(webTextCookieName, enable);
    } else {
        clearCookie(webTextCookieName);
    }
}
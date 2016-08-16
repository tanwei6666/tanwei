
function setPluginStatus(enable) {
    chrome.extension.sendRequest({ type: 'setPluginStatus' }, function (response) {
        
    });
}

document.onkeypress = function (e) {//数字键盘-的点击事件：设置插件启用/禁用状态
    var e = (e || event);
    if (e.keyCode == 45 || e.which == 45) {
        setPluginStatus();
    }
}
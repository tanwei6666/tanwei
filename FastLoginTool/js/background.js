var pluginSettings = {  //插件配置
    enable : true
};
var curPageContext = null;

// 监听content_script发来的请求
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {

        if (request.type == 'getLocalStorage') {    // 读取localStorage，并把数据推送回content_scripts

            var fatConfigs = {
                eid: localStorage.getItem('fat_eid'),
                ekey: localStorage.getItem('fat_ekey'),
                modeCode: localStorage.getItem('fat_modeCode'),
                uid: localStorage.getItem('fat_uid'),
                subModeCode: localStorage.getItem('fat_subModeCode'),
                fatEnvir: localStorage.getItem('fat_envir'),
            };
            var uatConfigs = {
                eid: localStorage.getItem('uat_eid'),
                ekey: localStorage.getItem('uat_ekey'),
                modeCode: localStorage.getItem('uat_modeCode'),
                uid: localStorage.getItem('uat_uid'),
                subModeCode: localStorage.getItem('uat_subModeCode')
            };

            var prodConfigs = {
                eid: localStorage.getItem('prod_eid'),
                ekey: localStorage.getItem('prod_ekey'),
                modeCode: localStorage.getItem('prod_modeCode'),
                uid: localStorage.getItem('prod_uid'),
                subModeCode: localStorage.getItem('prod_subModeCode')
            };

            var customConfigs = {
                closeCasoLogin: localStorage.getItem('closeCasoLogin'),
                closeMessageBox: localStorage.getItem('closeMessageBox'),
                closeDialogDepartment: localStorage.getItem('closeDialogDepartment')
            }

            var cookieConfigs = {
                customCookies: localStorage.getItem('customCookies'),
                cookiesWriteType: localStorage.getItem('cookiesWriteType'),
                cookiesWriteUrls: localStorage.getItem('cookiesWriteUrls')
            }

            var webTextConfigs = {
                webTextEnable: localStorage.getItem('webTextEnable')
            }

            sendResponse({
                pluginEnabled: pluginSettings.enable,
                fatConfigs: fatConfigs,
                uatConfigs: uatConfigs,
                prodConfigs: prodConfigs,
                customConfigs: customConfigs,
                cookieConfigs: cookieConfigs,
                webTextConfigs: webTextConfigs
            });

        }

        if (request.type == 'getWebServiceTextAjax') {  //向服务端（目前仅支持新版offline）发起请求，获取web服务报文
            
            var webTextEnable = localStorage.getItem('webTextEnable');
            if (webTextEnable == null || webTextEnable == "false") {
                alert('选项配置中未启用获取报文功能，请启用后再试');
                return;
            }

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "getCurPageContext" }, function (response) {
                    if (response == null) {
                        alert('未能获取当前页面的上下文信息，请等页面加载完毕或刷新页面后重试');
                        return;
                    };
                    var originHost = response.originHost;
                    var pathName = response.pathName;
                    var token = response.token;
                    var isWebServiceAjaxPage = pathName.indexOf('ReserveHotel') != -1 ||
                                                pathName.indexOf('ReserveHotelModifyOrCopy') != -1 ||
                                                pathName.indexOf('Search') != -1 ||
                                                pathName.indexOf('HotelRatePlan') != -1 ||
                                                pathName.indexOf('Success') != -1;

                    if (isWebServiceAjaxPage) {

                        if (token == null || token == '') {
                            alert('未能获取当前页面的token，请检查页面参数是否包含token参数');
                            return;
                        }

                        var ajaxPathName = '/CorpOfflineHotelNew/DebugTool/GetWebServiceText';
                        var ajaxUrl = originHost + ajaxPathName;
                        $.ajax({
                            url: ajaxUrl,
                            type: 'POST',
                            data: { dataType: request.dataType, token: token },
                            dataType: 'json',
                        }).then(function (data) {
                            sendResponse({ 'status': 200, 'data': data });
                        }, function () {
                            sendResponse({ 'status': 500 });
                        });

                    } else {
                        alert('当前页面不是webService页面，无法获取相关报文');
                    }
                });
            });
        }

        if (request.type == 'setPluginStatus') {
            if (pluginSettings.enable) {
                chrome.browserAction.setIcon({ path: 'ctripCorpDisabled.png' });
                chrome.browserAction.setTitle({ title: '当前为禁用状态..〒▽〒' });
                pluginSettings.enable = false;
                chrome.browserAction.disable();
            }
            else {
                chrome.browserAction.setIcon({ path: 'ctripCorp.png' });
                chrome.browserAction.setTitle({ title: '当前为启用状态~♪(^∇^*)' });
                pluginSettings.enable = true;
                chrome.browserAction.enable();
            }
        }

    }
);

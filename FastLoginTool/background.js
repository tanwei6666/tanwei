/**
 * 读取localStorage，并把数据推送回content_scripts
 */
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'getLocalStorage') {

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

            sendResponse({
                fatConfigs: fatConfigs,
                uatConfigs: uatConfigs,
                prodConfigs: prodConfigs,
                customConfigs: customConfigs
            });

        }
    }
);
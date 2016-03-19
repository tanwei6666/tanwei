/**
 * 本脚本为options.html提供读取并保存配置信息的方法
 */
var EnumLoginVersion = {
    Unknown: 'Unknown',
    Old: 'Old',
    New: 'New'
}

var EnumModeCode = {
    m7669: '7669',
    m1308: '371121',
    m1404: '1404',
    m1477: '1477',
    m1199: '1199',
    m5780: '5780',
    m9217: '9217'
}

var EnumfatEnvir = {
    fat2: 'fat2',
    fat4: 'fat4',
    fat11: 'fat11',
    fat24: 'fat24',
    fat25: 'fat25',
    fat26: 'fat26',
    fat47: 'fat47'
}

window.onload = function () {
    var defaultEid_fat_uat = 'ypcao';
    var defaultEkey_fat_uat = '';
    var defaultModeCode_fat_uat = '7669';
    var defaultUid_fat_uat = 'hoteltest';
    var defaultSubModeCode_fat_uat = 0;
    var defaultFatEnvir = 'fat4';

    document.getElementById("fat_eid").value = localStorage.getItem('fat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('fat_eid');
    document.getElementById("fat_ekey").value = localStorage.getItem('fat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('fat_ekey');
    document.getElementById("fat_uid").value = localStorage.getItem('fat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('fat_uid');
    setSelectValue('fat_mode_selector', localStorage.getItem('fat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('fat_modeCode'), true);
    setSelectValue('fat_submode_selector', localStorage.getItem('fat_subModeCode') == null ? defaultSubModeCode_fat_uat : localStorage.getItem('fat_subModeCode'));
    setSelectValue('fat_envir_selector', localStorage.getItem('fat_envir') == null ? defaultFatEnvir : localStorage.getItem('fat_envir'));

    document.getElementById("uat_eid").value = localStorage.getItem('uat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('uat_eid');
    document.getElementById("uat_ekey").value = localStorage.getItem('uat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('uat_ekey');
    document.getElementById("uat_uid").value = localStorage.getItem('uat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('uat_uid');
    setSelectValue('uat_mode_selector', localStorage.getItem('uat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('uat_modeCode'), true);
    setSelectValue('uat_submode_selector', localStorage.getItem('uat_subModeCode') == null ? defaultSubModeCode_fat_uat : localStorage.getItem('uat_subModeCode'));

    //生产环境还是不要设置默认值了..（但是开发还是可以设置的，哇嘎嘎~\(≧▽≦)/~）
    var defaultEid_prod = ''; 
    var defaultEkey_prod = '';
    var defaultModeCode_prod = '';
    var defaultUid_prod = '';
    var defaultSubModeCode_prod = '';

    document.getElementById("prod_eid").value = localStorage.getItem('prod_eid') == null ? defaultEid_prod : localStorage.getItem('prod_eid');
    document.getElementById("prod_ekey").value = localStorage.getItem('prod_ekey') == null ? defaultEkey_prod : localStorage.getItem('prod_ekey');
    document.getElementById("prod_uid").value = localStorage.getItem('prod_uid') == null ? defaultUid_prod : localStorage.getItem('prod_uid');
    setSelectValue('prod_mode_selector', localStorage.getItem('prod_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('prod_modeCode'), true);
    setSelectValue('prod_submode_selector', localStorage.getItem('prod_subModeCode') == null ? defaultSubModeCode_prod : localStorage.getItem('prod_subModeCode'));

    document.getElementById("chbox_closeCasoLogin").checked = localStorage.getItem('closeCasoLogin') == 'true';
    document.getElementById("chbox_closeMessageBox").checked = localStorage.getItem('closeMessageBox') == 'true';
    document.getElementById("chbox_closeDialogDepartment").checked = localStorage.getItem('closeDialogDepartment') == 'true';

    setNewFatLoginDisabled();
    setOldFatLoginDisabled();

    document.getElementById('addCookie_txt').value = localStorage.getItem('customCookies') == null ? '' : localStorage.getItem('customCookies');
}

// #region 模块号改变后，子模块的联动效果
document.getElementById("fat_mode_selector").addEventListener("change", function () {
    selectorCouplingEvent("fat_mode_selector", "fat_submode_selector", "fat_submode_label");
});

document.getElementById("uat_mode_selector").addEventListener("change", function () {
    selectorCouplingEvent("uat_mode_selector", "uat_submode_selector", "uat_submode_label");
});

document.getElementById("prod_mode_selector").addEventListener("change", function () {
    selectorCouplingEvent("prod_mode_selector", "prod_submode_selector", "prod_submode_label");
});
// #endgrion

// #region 模块号和子模块改变后，判断当前模块是否支持新版登录
document.getElementById("fat_mode_selector").addEventListener("change", setNewFatLoginDisabled);
document.getElementById("fat_mode_selector").addEventListener("change", setOldFatLoginDisabled);

document.getElementById("fat_envir_selector").addEventListener("change", setNewFatLoginDisabled);
document.getElementById("fat_envir_selector").addEventListener("change", setOldFatLoginDisabled);

// 当前模块为1199，1477，9217，5780，1308时，设置新版快速登录的按钮为disabled（因为1199，1477，9217，1308在新版登录时都默认跳fat4，5780默认跳fat2）。
function setNewFatLoginDisabled() {
    var fat_fastloginnew_btn = document.getElementById('fat_fastloginnew_btn');
    if (!fat_fastloginnew_btn)
        return;

    var mode = getSelectedValue('fat_mode_selector');
    var fatEnvir = getSelectedValue('fat_envir_selector');
    if (
        (mode == EnumModeCode.m1199 && fatEnvir != EnumfatEnvir.fat4) ||
        (mode == EnumModeCode.m1477 && fatEnvir != EnumfatEnvir.fat4) ||
        (mode == EnumModeCode.m9217 && fatEnvir != EnumfatEnvir.fat4) ||
        (mode == EnumModeCode.m1308 && fatEnvir != EnumfatEnvir.fat4)
       ) {
        fat_fastloginnew_btn.disabled = true;
    } else if (mode == EnumModeCode.m5780 && fatEnvir != EnumfatEnvir.fat2) {
        fat_fastloginnew_btn.disabled = true;
    } else if (mode == EnumModeCode.m1404 && fatEnvir != EnumfatEnvir.fat47) {  // 机票1404新版登录只支持fat47
        fat_fastloginnew_btn.disabled = true;
    } else {
        fat_fastloginnew_btn.disabled = false;
    }
}

// 当前模块为1308时，设置旧版快速登录的按钮为disabled
function setOldFatLoginDisabled() {
    var fat_fastloginold_btn = document.getElementById('fat_fastloginold_btn');
    if (!fat_fastloginold_btn)
        return;
    var mode = getSelectedValue('fat_mode_selector');
    var fatEnvir = getSelectedValue('fat_envir_selector');
    if (mode == EnumModeCode.m1308 && fatEnvir != EnumfatEnvir.fat4) {
        fat_fastloginold_btn.disabled = true;
    } else {
        fat_fastloginold_btn.disabled = false;
    }
}
// #endgrion

// #region 保存通用配置信息到localStorage中
function saveCommonEnvirConfigs(envir) {
    localStorage.setItem(envir + '_eid', document.getElementById(envir + '_eid').value);
    localStorage.setItem(envir + '_ekey', document.getElementById(envir + '_ekey').value);
    localStorage.setItem(envir + '_modeCode', getSelectedValue(envir + '_mode_selector'));
    localStorage.setItem(envir + '_uid', document.getElementById(envir + '_uid').value);
    localStorage.setItem(envir + '_subModeCode', getSelectedValue(envir + '_submode_selector'));
}

// 保存fat环境配置信息
function saveFatEnvirConfigs() {
    localStorage.setItem('fat_envir', getSelectedValue('fat_envir_selector'));
}
// #endgrion

// 保存登录选项
function saveCustomOptions() {
    localStorage.setItem('closeCasoLogin', document.getElementById('chbox_closeCasoLogin').checked);
    localStorage.setItem('closeMessageBox', document.getElementById('chbox_closeMessageBox').checked);
    localStorage.setItem('closeDialogDepartment', document.getElementById('chbox_closeDialogDepartment').checked);
}

//保存自动跳转时需要额外添加的cookie
function saveCustomCookies() {
    var cookieTxt = document.getElementById('addCookie_txt');
    if (cookieTxt != null && cookieTxt.value != '') {
        localStorage.setItem('customCookies', cookieTxt.value);
    }
}

// #region 为快速登录按钮声明单击事件，让其创建一个新窗口并迅速跳到指定模块
document.getElementById("fat_fastloginold_btn").addEventListener("click", function () {
    saveCommonEnvirConfigs('fat');
    saveFatEnvirConfigs();
    saveCustomOptions();
    saveCustomCookies();
    jumpToFatLoginPage(EnumLoginVersion.Old);
});

document.getElementById("fat_fastloginnew_btn").addEventListener("click", function () {
    saveCommonEnvirConfigs('fat');
    saveFatEnvirConfigs();
    saveCustomOptions();
    saveCustomCookies();
    jumpToFatLoginPage(EnumLoginVersion.New);
});

document.getElementById("uat_fastloginold_btn").addEventListener("click", function () {
    saveCommonEnvirConfigs('uat');
    saveCustomOptions();
    window.open("http://service.uat.qa.nt.ctripcorp.com/cii/cii.asp");
});

document.getElementById("uat_fastloginnew_btn").addEventListener("click", function () {
    saveCommonEnvirConfigs('uat');
    saveCustomOptions();
    saveCustomCookies();
    window.open("http://membersint.members.uat.qa.nt.ctripcorp.com/offlineauthlogin/Login.aspx");
});

document.getElementById("prod_fastloginold_btn").addEventListener("click", function () {
    saveCommonEnvirConfigs('prod');
    saveCustomOptions();
    saveCustomCookies();
    window.open("http://server.sh.ctriptravel.com/sh_service/default.htm");
});

document.getElementById("prod_fastloginnew_btn").addEventListener("click", function () {
    saveCommonEnvirConfigs('prod');
    saveCustomOptions();
    saveCustomCookies();
    window.open("http://membersint.members.ctripcorp.com/offlineauthlogin/Login.aspx");
});
// #endgrion

//跳转到fat各个环境下的登录入口
function jumpToFatLoginPage(curLoginVersion) {
    var curSelectedFatEnvir = getSelectedValue('fat_envir_selector');
    if (curSelectedFatEnvir != null) {

        switch (curLoginVersion) {
            case EnumLoginVersion.Old:
                window.open("http://service." + curSelectedFatEnvir + ".qa.nt.ctripcorp.com/cii/cii.asp");
                break;
            case EnumLoginVersion.New:
                window.open("http://membersint.members.fat47.qa.nt.ctripcorp.com/offlineauthlogin/Login.aspx");
                break;
            default:
                break;
        }

    } else {
        alert('请选择一个fat环境！');
    }
}

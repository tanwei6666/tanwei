/**
 * 本脚本为options.html提供读取并保存配置信息的方法
 */
window.onload = function () {
    var defaultEid_fat_uat = 'ypcao';
    var defaultEkey_fat_uat = '';
    var defaultModeCode_fat_uat = '7669';
    var defaultUid_fat_uat = 'hoteltest';
    var defaultSubModeCode_fat_uat = 0;

    document.getElementById("fat_eid").value = localStorage.getItem('fat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('fat_eid');
    document.getElementById("fat_ekey").value = localStorage.getItem('fat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('fat_ekey');
    document.getElementById("fat_uid").value = localStorage.getItem('fat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('fat_uid');
    setSelectValue('fat_mode_selector', localStorage.getItem('fat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('fat_modeCode'), true);
    setSelectValue('fat_submode_selector', localStorage.getItem('fat_subModeCode') == null ? defaultSubModeCode_fat_uat : localStorage.getItem('fat_subModeCode'));

    document.getElementById("uat_eid").value = localStorage.getItem('uat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('uat_eid');
    document.getElementById("uat_ekey").value = localStorage.getItem('uat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('uat_ekey');
    document.getElementById("uat_uid").value = localStorage.getItem('uat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('uat_uid');
    setSelectValue('uat_mode_selector', localStorage.getItem('uat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('uat_modeCode'), true);
    setSelectValue('uat_submode_selector', localStorage.getItem('uat_subModeCode') == null ? defaultSubModeCode_fat_uat : localStorage.getItem('uat_subModeCode'));

    //var defaultEid_prod = 'y_qin';          //默认是秦媛的~\(≧▽≦)/~
    //var defaultEkey_prod = 'LM20081206)';
    //var defaultModeCode_prod = '7669';
    //var defaultUid_prod = '2106338901';     //默认是张曼的~\(≧▽≦)/~

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

// #region 保存配置信息到localStorage中
function saveFatConfigs(envir) {
    localStorage.setItem(envir + '_eid', document.getElementById(envir + '_eid').value);
    localStorage.setItem(envir + '_ekey', document.getElementById(envir + '_ekey').value);
    localStorage.setItem(envir + '_modeCode', getSelectedValue(envir + '_mode_selector'));
    localStorage.setItem(envir + '_uid', document.getElementById(envir + '_uid').value);
    localStorage.setItem(envir + '_subModeCode', getSelectedValue(envir + '_submode_selector'));
}
// #endgrion

//保存登录选项
function saveCustomOptions() {
    localStorage.setItem('closeCasoLogin', document.getElementById('chbox_closeCasoLogin').checked);
    localStorage.setItem('closeMessageBox', document.getElementById('chbox_closeMessageBox').checked);
}

// #region 为快速登录按钮声明单击事件，让其创建一个新窗口并迅速跳到指定模块
document.getElementById("fat_fastloginold_btn").addEventListener("click", function () {
    saveFatConfigs('fat');
    saveCustomOptions();
    window.open("http://service.fat4.qa.nt.ctripcorp.com/cii/cii.asp");
});

document.getElementById("fat_fastloginnew_btn").addEventListener("click", function () {
    saveFatConfigs('fat');
    saveCustomOptions();
    window.open("http://membersint.members.fat47.qa.nt.ctripcorp.com/offlineauthlogin/Login.aspx");
});

document.getElementById("uat_fastloginold_btn").addEventListener("click", function () {
    saveFatConfigs('uat');
    saveCustomOptions();
    window.open("http://service.uat.qa.nt.ctripcorp.com/cii/cii.asp");
});

document.getElementById("uat_fastloginnew_btn").addEventListener("click", function () {
    saveFatConfigs('uat');
    saveCustomOptions();
    window.open("http://membersint.members.uat.qa.nt.ctripcorp.com/offlineauthlogin/Login.aspx");
});

document.getElementById("prod_fastloginold_btn").addEventListener("click", function () {
    saveFatConfigs('prod');
    saveCustomOptions();
    window.open("http://server.sh.ctriptravel.com/sh_service/default.htm");
});

document.getElementById("prod_fastloginnew_btn").addEventListener("click", function () {
    saveFatConfigs('prod');
    saveCustomOptions();
    window.open("http://membersint.members.ctripcorp.com/offlineauthlogin/Login.aspx");
});
// #endgrion

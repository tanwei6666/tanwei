/**
 * 本脚本为options.html提供读取并保存配置信息的方法
 */
window.onload = function () {
    var defaultEid_fat_uat = 'ypcao';
    var defaultEkey_fat_uat = '';
    var defaultModeCode_fat_uat = '7669';
    var defaultUid_fat_uat = 'hoteltest';

    document.getElementById("fat_eid").value = localStorage.getItem('fat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('fat_eid');
    document.getElementById("fat_ekey").value = localStorage.getItem('fat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('fat_ekey');
    document.getElementById("fat_uid").value = localStorage.getItem('fat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('fat_uid');
    setSelectValue('fat_mode_selector', localStorage.getItem('fat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('fat_modeCode'));

    document.getElementById("uat_eid").value = localStorage.getItem('uat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('uat_eid');
    document.getElementById("uat_ekey").value = localStorage.getItem('uat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('uat_ekey');
    document.getElementById("uat_uid").value = localStorage.getItem('uat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('uat_uid');
    setSelectValue('uat_mode_selector', localStorage.getItem('uat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('uat_modeCode'));

    //var defaultEid_prod = 'y_qin';          //默认是秦媛的~\(≧▽≦)/~
    //var defaultEkey_prod = 'LM20081206)';
    //var defaultModeCode_prod = '7669';
    //var defaultUid_prod = '2106338901';     //默认是张曼的~\(≧▽≦)/~

    //生产环境还是不要设置默认值了..（但是开发还是可以设置的，哇嘎嘎~\(≧▽≦)/~）
    var defaultEid_prod = ''; 
    var defaultEkey_prod = '';
    var defaultModeCode_prod = '';
    var defaultUid_prod = '';

    document.getElementById("prod_eid").value = localStorage.getItem('prod_eid') == null ? defaultEid_prod : localStorage.getItem('prod_eid');
    document.getElementById("prod_ekey").value = localStorage.getItem('prod_ekey') == null ? defaultEkey_prod : localStorage.getItem('prod_ekey');
    document.getElementById("prod_uid").value = localStorage.getItem('prod_uid') == null ? defaultUid_prod : localStorage.getItem('prod_uid');
    setSelectValue('prod_mode_selector', localStorage.getItem('prod_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('prod_modeCode'));
}

// 保存按钮选中后，把所有配置信息保存到localStorage中
document.getElementById("btn_save").addEventListener("click", function () {
    localStorage.setItem('fat_eid', document.getElementById("fat_eid").value);
    localStorage.setItem('fat_ekey', document.getElementById("fat_ekey").value);
    localStorage.setItem('fat_modeCode', getSelectedValue('fat_mode_selector'));
    localStorage.setItem('fat_uid', document.getElementById("fat_uid").value);

    localStorage.setItem('uat_eid', document.getElementById("uat_eid").value);
    localStorage.setItem('uat_ekey', document.getElementById("uat_ekey").value);
    localStorage.setItem('uat_modeCode', getSelectedValue('uat_mode_selector'));
    localStorage.setItem('uat_uid', document.getElementById("uat_uid").value);

    localStorage.setItem('prod_eid', document.getElementById("prod_eid").value);
    localStorage.setItem('prod_ekey', document.getElementById("prod_ekey").value);
    localStorage.setItem('prod_modeCode', getSelectedValue('prod_mode_selector'));
    localStorage.setItem('prod_uid', document.getElementById("prod_uid").value);

    document.getElementById('span_msg').style.visibility = 'visible';
    setTimeout(function () {
        document.getElementById('span_msg').style.visibility = 'hidden';
    }, 1500);
});

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
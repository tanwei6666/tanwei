/**
 * 本脚本为options.html提供读取并保存配置信息的方法
 */
document.getElementById("btn_save").addEventListener("click", function () {
    localStorage.setItem('fat_eid', document.getElementById("fat_eid").value);
    localStorage.setItem('fat_ekey', document.getElementById("fat_ekey").value);
    localStorage.setItem('fat_modeCode', document.getElementById("fat_modeCode").value);
    localStorage.setItem('fat_uid', document.getElementById("fat_uid").value);

    localStorage.setItem('uat_eid', document.getElementById("uat_eid").value);
    localStorage.setItem('uat_ekey', document.getElementById("uat_ekey").value);
    localStorage.setItem('uat_modeCode', document.getElementById("uat_modeCode").value);
    localStorage.setItem('uat_uid', document.getElementById("uat_uid").value);

    localStorage.setItem('prod_eid', document.getElementById("prod_eid").value);
    localStorage.setItem('prod_ekey', document.getElementById("prod_ekey").value);
    localStorage.setItem('prod_modeCode', document.getElementById("prod_modeCode").value);
    localStorage.setItem('prod_uid', document.getElementById("prod_uid").value);

    document.getElementById('span_msg').style.visibility = 'visible';
    setTimeout(function () {
        document.getElementById('span_msg').style.visibility = 'hidden';
    }, 1500);
});

window.onload = function () {
    var defaultEid_fat_uat = 'ypcao';
    var defaultEkey_fat_uat = '';
    var defaultModeCode_fat_uat = '7669';
    var defaultUid_fat_uat = 'hoteltest';

    document.getElementById("fat_eid").value = localStorage.getItem('fat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('fat_eid');
    document.getElementById("fat_ekey").value = localStorage.getItem('fat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('fat_ekey');
    document.getElementById("fat_modeCode").value = localStorage.getItem('fat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('fat_modeCode');
    document.getElementById("fat_uid").value = localStorage.getItem('fat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('fat_uid');

    document.getElementById("uat_eid").value = localStorage.getItem('uat_eid') == null ? defaultEid_fat_uat : localStorage.getItem('uat_eid');
    document.getElementById("uat_ekey").value = localStorage.getItem('uat_ekey') == null ? defaultEkey_fat_uat : localStorage.getItem('uat_ekey');
    document.getElementById("uat_modeCode").value = localStorage.getItem('uat_modeCode') == null ? defaultModeCode_fat_uat : localStorage.getItem('uat_modeCode');
    document.getElementById("uat_uid").value = localStorage.getItem('uat_uid') == null ? defaultUid_fat_uat : localStorage.getItem('uat_uid');

    var defaultEid_prod = 'y_qin';          //默认是秦媛的~\(≧▽≦)/~
    var defaultEkey_prod = 'LM20081206)';
    var defaultModeCode_prod = '7669';
    var defaultUid_prod = '2106338901';     //默认是张曼的~\(≧▽≦)/~

    document.getElementById("prod_eid").value = localStorage.getItem('prod_eid') == null ? defaultEid_prod : localStorage.getItem('prod_eid');
    document.getElementById("prod_ekey").value = localStorage.getItem('prod_ekey') == null ? defaultEkey_prod : localStorage.getItem('prod_ekey');
    document.getElementById("prod_modeCode").value = localStorage.getItem('prod_modeCode') == null ? defaultModeCode_prod : localStorage.getItem('prod_modeCode');
    document.getElementById("prod_uid").value = localStorage.getItem('prod_uid') == null ? defaultUid_prod : localStorage.getItem('prod_uid');
}
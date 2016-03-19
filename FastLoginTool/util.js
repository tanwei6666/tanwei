/**
 * 工具包
 */

// 字符串比较
function strCompare(str1, str2) {
    var s1 = str1 + '';
    var s2 = str2 + '';
    return s1.toLowerCase() == s2.toLowerCase();
}

// 获取cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            } 
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

// 设置cookie
function setCookie(c_name, value) {
    document.cookie = c_name + "=" + escape(value);
}

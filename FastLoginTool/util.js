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

// 通过配置的cookies字符串，返回具有key-value键值对形式的cookie数组。
function getCookieValuePairs(cookiesString) {
    var array = new Array();
    if (cookiesString && cookiesString.length > 0) {
        var pairs = cookiesString.split(';');
        for (var i = 0; i < pairs.length; i++) {
            try {
                var ckPair = pairs[i];
                var key = ckPair.substring(0, ckPair.indexOf('='));
                var value = ckPair.substring(ckPair.indexOf('=') + 1);
                array.push({
                    key: key,
                    value: value
                });
            } catch (e) {
                continue;
            }
        }
    }
    return array;
}

// 功过配置的需要添加cookie的页面，解析出当前页面是否需要添加cookie
function checkCurPageForWriteCookie(curPage, configUrls) {
    if (configUrls == null || configUrls == '') //URL没配置意味着每个页面都需要添加cookie
        return true;

    if (curPage && configUrls) {
        var urls = configUrls.split(';');
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i].replace('http://', '').replace('https://', '');   //去掉协议头
            url.substring(0, url.indexOf('?'));                                 //去掉参数尾
            if (curPage.indexOf(url) != -1)
                return true;
        }
    }
    return false;
}

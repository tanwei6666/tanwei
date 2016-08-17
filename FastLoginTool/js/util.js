/**
 * 工具包
 */

// 字符串比较
function strCompare(str1, str2) {
    var s1 = str1 + '';
    var s2 = str2 + '';
    return s1.toLowerCase() == s2.toLowerCase();
}

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

//清除cookie  
function clearCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
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

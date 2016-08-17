/**
 * 本脚本根据options_page里的配置，将自动跳转到各个环境下的预订站点页面（基于老版登陆系统）。
 * 作者：任子彦，谭伟
 * 创建日期：2016-03-08
 */
$(function () {

    /* -------------------------------------------------- 环境配置start ------------------------------------------*/

    var EnumPageType = {
        ServiceHomePage: 'ServiceHomePage',
        EidHomePage: 'EidHomePage',
        SignInView: 'SignInView',
        CloseWindowOnly: 'CloseWindowOnly',
        DomesticHotelSearch: 'DomesticHotelSearch',  //国内站点页面，为跳海外站点做准备
        Unknown: 'unknown'                           //不识别的页面
    }

    var EnumEnvir = {
        Fat: 'Fat',
        Uat: 'Uat',
        Prod: 'Prod'
    }

    var EnumLoginSystem = {         //登录系统
        CII: 'CII',                 //老版
        MembersInt: 'membersint',   //新版
        Unknown: 'unknown'          //有的页面不分新版和老版，这种情况都归到此类
    }

    var EnumSubModeCode = {
        offlineDomesticHotel: '0',
        offlineOverSeaHotel: '1',
        bookingProcess: '2',    //1308
        offlineDomesticFlight: '3',
        offlineOverSeaFlight: '4'
    }

    var EnumCookieWriteType = {
        AddIfNotExist: '0',
        AddAndReplace: '1'
    }

    var curEnvir = ''; 			//保存当前环境的变量
    var curFatSys = '';         //保存当前fat登录系统是老版还是新版（fat47）
    var isLoginAgain4Prod = false; //是否是生产环境下的二次登录

    var fatConfigs, uatConfigs, prodConfigs, customConfigs, cookieConfigs, webTextConfigs;

    /* -------------------------------------------------- 环境配置end --------------------------------------------*/



    /* ------------------------------------------------ 脚本执行入口start ----------------------------------------*/

    // 由于localStorage是基于域名的，所以content_scripts不能直接读取localStorage，而是需要通过与background通信获取而来。
    chrome.extension.sendRequest({ type: 'getLocalStorage' }, function (response) {
        if (!response.pluginEnabled)
            return;

        if (response.fatConfigs) {
            fatConfigs = response.fatConfigs;
        }
        if (response.uatConfigs) {
            uatConfigs = response.uatConfigs;
        }
        if (response.prodConfigs) {
            prodConfigs = response.prodConfigs;
        }
        if (response.customConfigs) {
            customConfigs = response.customConfigs;
        }

        if (response.cookieConfigs) {
            cookieConfigs = response.cookieConfigs;
        }

        if (response.webTextConfigs) {
            webTextConfigs = response.webTextConfigs;
        }

        checkEnvir();
        checkLoginSystem();
        writeCustomCookies();
        pageAutoRun();
    });

    /* -------------------------------------------------- 脚本执行入口end ----------------------------------------*/



    /* -------------------------------------------------- 函数定义start ------------------------------------------*/

    // 检查当前页面的环境
    function checkEnvir() {
        if (document.location.href.indexOf('fat') != -1) {
            curEnvir = EnumEnvir.Fat;
        } else if (document.location.href.indexOf('uat') != -1) {
            curEnvir = EnumEnvir.Uat;
        } else if (document.location.href.indexOf('sh') != -1
                   || document.location.href.indexOf('membersint.members.ctripcorp.com') != -1 //生产上新版登录页面不带sh俩字了
                  ) {
            curEnvir = EnumEnvir.Prod;
        } else {
            //见鬼，这怎么可能~！
        }
    }

    // 检查当前的fat登录系统是老版还是新版（fat47）
    function checkLoginSystem() {
        var hrefUpStr = document.location.href.toUpperCase();
        if (hrefUpStr.indexOf('CII') != -1
            || document.location.pathname == '/sh_service/default.htm'  //生产环境上老版本登录系统不带cii，是这个格式的
            ) {
            curFatSys = EnumLoginSystem.CII;
        } else if (hrefUpStr.indexOf('MEMBERSINT') != -1) {
            curFatSys = EnumLoginSystem.MembersInt;
        } else {
            curFatSys = EnumLoginSystem.Unknown;
        }
    }

    // 为设置的页面添加指定的cookies
    function writeCustomCookies() {
        if (cookieConfigs) {
            var ckValuePairs = getCookieValuePairs(cookieConfigs.customCookies);
            var cksWriteType = cookieConfigs.cookiesWriteType;
            var cksWriteUrls = cookieConfigs.cookiesWriteUrls;

            var needWriteCookies = checkCurPageForWriteCookie(document.location.href, cksWriteUrls);
            if (needWriteCookies) {
                for (var i = 0; i < ckValuePairs.length; i++) {
                    var cookiePair = ckValuePairs[i];
                    switch (cksWriteType) {
                        case EnumCookieWriteType.AddIfNotExist:
                            if (getCookie(cookiePair.key) == '') {
                                setCookie(cookiePair.key, cookiePair.value);
                            }
                            break;
                        case EnumCookieWriteType.AddAndReplace:
                            setCookie(cookiePair.key, cookiePair.value);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    // 根据不同页面的内容执行不同脚本，目的就是为了一气呵成登录到offline站点页
    function pageAutoRun() {
        var curPageType = checkPageType();
        switch (curPageType) {
            case EnumPageType.ServiceHomePage:
                login();
                break;
            case EnumPageType.EidHomePage:
                jumpToMode();
                break;
            case EnumPageType.SignInView:
                jumpToSubMode();
                break;
            case EnumPageType.DomesticHotelSearch:
                jumpToInnerMode();
                break;
            case EnumPageType.CloseWindowOnly:
                closeMessage();
                break;
            default:
                break;
        }
    }

    // 根据当前页面信息，返回当前是哪种页面
    function checkPageType() {
        ///Cii/Flight/Process/flt_orderlist.asp这个path对应两个页面：一个需要登录的页面，一个是真正的机票订单列表页面。所以这里才需要这样区分。
        var is_fltOrderlist_loginPage = strCompare(document.location.pathname, '/Cii/Flight/Process/flt_orderlist.asp') 
                                        && document.getElementsByName('logineid').length > 0;

        if (strCompare(document.location.pathname, '/cii/cii.asp') || 					    //fat,uat
			strCompare(document.location.pathname, '/sh_service/default.htm') || 		    //prod第一次登录
			strCompare(document.location.pathname, '/CII/order/offline_order_log.asp') ||   //fat47和prod第二次登录
            strCompare(document.location.pathname, '/offlineauthlogin/Login.aspx') ||       //fat47第一次登录	
            is_fltOrderlist_loginPage)
            return EnumPageType.ServiceHomePage;

        if (strCompare(document.location.pathname, '/CII/share/home.asp') || 			  //fat,uat
			strCompare(document.location.pathname, '/cii/share/home.asp') ||              //prod
            strCompare(document.location.pathname, '/offlinehomepage/Index.aspx'))        //fat47
            return EnumPageType.EidHomePage;

        if (strCompare(document.location.pathname, '/offlinelogin/view/signinview.aspx'))
            return EnumPageType.SignInView;
            
        if (strCompare(document.location.pathname, '/CorpOfflineHotel/Search/HotelSearch.aspx')) {    //offline国内站点页面
            return EnumPageType.DomesticHotelSearch;
        }

        return returnAutoClosePage();
    }

    // 以后任何环境下如果有类似弹窗那种需要关闭的页面均纳入此类
    function returnAutoClosePage() {
        if (strCompare(document.location.pathname, '/cii/promptmessage/Readmessage.asp')) {     //fat,uat,prod的当前uid的提示信息页面
            return EnumPageType.CloseWindowOnly;
        }
        if (customConfigs.closeCasoLogin == 'true') {                                           //讨厌的统一登录平台
            if (strCompare(document.location.pathname, '/caso/login')) {
                return EnumPageType.CloseWindowOnly;
            }
        }
        if (customConfigs.closeMessageBox == 'true') {
            if (strCompare(document.location.pathname, '/CII/share/messagebox.asp')) {          //登录出错的提示页面，烦躁，我关，我关，我关关关！
                return EnumPageType.CloseWindowOnly;
            }
        }
        if (customConfigs.closeDialogDepartment == 'true') {                                    //不知道哪里的IIS错误，关掉关掉~！
            if (document.location.pathname.indexOf('DialogDepartment') != -1) {
                return EnumPageType.CloseWindowOnly;
            }
        }
        return EnumPageType.Unknown;
    }

    // 如果当前页面是service首页，就自动输入eid并点击“登录”按钮。
    function login() {
        switch (curEnvir) {
            case EnumEnvir.Fat:
                loginToHomePage(fatConfigs.eid, fatConfigs.ekey);
                break;
            case EnumEnvir.Uat:
                loginToHomePage(uatConfigs.eid, uatConfigs.ekey);
                break;
            case EnumEnvir.Prod:
                loginToHomePage(prodConfigs.eid, prodConfigs.ekey);
                break;
            default:
                break;
        }
    }

    // 跳转到指定首页。之所以要单独写这个方法，是因为登录页面分老版和新版，老版还有好几种页面。不同的页面，登录的页面元素id不同。
    function loginToHomePage(id, key) {
        if (curFatSys == EnumLoginSystem.CII) {
            if (curEnvir == EnumEnvir.Fat || curEnvir == EnumEnvir.Uat) {   //因为prod与(fat,uat)的页面元素不太相同，这里还是分一下吧。T_T
                var loginCase1 = document.getElementsByName('eid')[0] != null;
                var loginCase2 = document.getElementsByName('logineid')[0] != null;
                var loginCase3 = !loginCase1 && !loginCase2;                //这个判断方法十分危险，可能导致死循环，待后期改进

                if (loginCase1) {
                    document.getElementsByName('eid')[0].value = id;
                    document.getElementsByName('pwd')[0].value = key;
                    document.getElementById('Submit1').click();
                } else if (loginCase2) {
                    document.getElementsByName('logineid')[0].value = id;
                    document.getElementsByName('loginpwd')[0].value = key;
                    document.getElementsByName('btnLogin')[0].click();
                } else if (loginCase3) {    //此情况为特殊情况，fat47登录offline时，成功登录后页面会“呆”住不跳转，此时让它再跳一次。
                    if (curEnvir == EnumEnvir.Fat) {
                        window.location.href = 'http://inbound.' + fatConfigs.fatEnvir + '.qa.nt.ctripcorp.com/offlinelogin/view/signinview.aspx?Type=CORP_OFFRESERVE&module=7669';
                    }
                }
            } else if (curEnvir == EnumEnvir.Prod) {
                var loginCase1 = document.getElementsByName('eid')[1] != null;
                var loginCase2 = document.getElementsByName('logineid')[0] != null;
                if (loginCase1) {
                    document.getElementsByName('eid')[1].value = id;
                    document.getElementsByName('pwd')[1].value = key;
                    document.getElementsByName('go2')[1].click();
                } else if (loginCase2) {
                    document.getElementsByName('logineid')[0].value = id;
                    document.getElementsByName('loginpwd')[0].value = key;
                    document.getElementsByName('btnLogin')[0].click();
                } else {
                    //以后若还有第三次登录，那真是要骂娘了~！
                }
            }
        } else if (curFatSys == EnumLoginSystem.MembersInt) {   //新版不用分环境，好高兴~♪(^∇^*)
            document.getElementsByName('eid')[0].value = id;
            document.getElementsByName('pwd')[0].value = key;
            document.getElementById('btnSubmit').click();       //但是click后默认都跳fat4！(╯‵□′)╯︵┻━┻
        }
    }

    // 登录到指定模块
    function jumpToMode() {
        switch (curEnvir) {
            case EnumEnvir.Fat:
                if (curFatSys == EnumLoginSystem.CII) {
                    window.location = "/cii/share/shortcut.asp?modulecode=" + fatConfigs.modeCode;
                } else if (curFatSys == EnumLoginSystem.MembersInt) {
                    window.location = "/modulejump/tNetv.aspx?module=" + fatConfigs.modeCode;
                }
                break;
            case EnumEnvir.Uat:
                if (curFatSys == EnumLoginSystem.CII) {
                    window.location = "/cii/share/shortcut.asp?modulecode=" + uatConfigs.modeCode;
                } else if (curFatSys == EnumLoginSystem.MembersInt) {
                    window.location = "/modulejump/tNetv.aspx?module=" + uatConfigs.modeCode;
                }
                break;
            case EnumEnvir.Prod:
                if (curFatSys == EnumLoginSystem.CII) {
                    window.location = "/cii/share/shortcut.asp?modulecode=" + prodConfigs.modeCode;
                } else if (curFatSys == EnumLoginSystem.MembersInt) {
                    window.location = "/modulejump/tNetv.aspx?module=" + prodConfigs.modeCode;
                }
                break;
            default:
                window.location = "/cii/share/shortcut.asp?modulecode=" + fatConfigs.modeCode;
        }
    }

    // 跳转到子页面
    function jumpToSubMode() {
        var curSubMode = getCurSubModeCode();
        switch (curSubMode) {
            case EnumSubModeCode.offlineDomesticHotel:
                loginToOfflineHotel();
                break;
            case EnumSubModeCode.offlineOverSeaHotel:
                loginToOfflineHotel();   //先登国内，再跳海外
                break;
            case EnumSubModeCode.bookingProcess:
                loginTo1308();
                break;
            case EnumSubModeCode.offlineDomesticFlight:
                loginToOfflineDomesticFlight();
                break;
            case EnumSubModeCode.offlineOverSeaFlight:
                loginToOfflineOverSeaFlight();
                break;
            default:
                break;
        }
    }

    // 跳转到内层页面的内层模块（目前只用于offline海外酒店）
    function jumpToInnerMode() {
        var curSubMode = getCurSubModeCode();
        if (curSubMode == EnumSubModeCode.offlineOverSeaHotel) {
            window.location.href = '/Corp-Booking-OfflineHotelIntl/HotelSearch.aspx';
        }
    }

    // 如果当前页面是Offline商旅预订页面，则输入uid，并点击“酒店预订”按钮
    function loginToOfflineHotel() {
        //fat47的signinview.aspx需要跳转到当前的fat环境（如果当前fat环境不是fat47的话）
        if (window.location.href.indexOf('fat47') != -1 && fatConfigs.fatEnvir != 'fat47') {
            window.location.href = window.location.href.replace('fat47', fatConfigs.fatEnvir);
            return;
        }

        var userValue = document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue');
        go = document.getElementsByName('go')[0];
        if (userValue) {
            document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue').value = getUid();
            document.getElementById('MainContentPlaceHolder_ctl00_btnCorpHotelNewRESERVE').click();
        }
        else if (go) {
            go.click(); //确认用户信息的页面，相当于点击“请确认用户信息, 开始预订/查询!”按钮
        }
    }

    // 如果当前页面是员工登录后的首页，就自动输入7669模块号跳转
    function loginTo1308() {
        //fat其他环境的signinview.aspx需要跳转到fat47
        if (curEnvir == EnumEnvir.Fat && window.location.href.indexOf('fat47') == -1) {
            var curFatEnvir = getFatEnvirFromPostName(window.location.hostname);
            window.location.href = window.location.href.replace(curFatEnvir, 'fat47');
            return;
        }

        var userValue = document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue');
        if (userValue) {
            document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue').value = getUid();
            document.getElementById('MainContentPlaceHolder_ctl00_btnRequestLog').click();
        }
    }

    // 如果当前页面是Offline商旅预订页面，则输入uid，并点击“国内机票”按钮
    function loginToOfflineDomesticFlight() {
        //fat47的signinview.aspx需要跳转到当前的fat环境（如果当前fat环境不是fat47的话）
        if (window.location.href.indexOf('fat47') != -1 && fatConfigs.fatEnvir != 'fat47') {
            window.location.href = window.location.href.replace('fat47', fatConfigs.fatEnvir);
            return;
        }

        var userValue = document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue');
        if (userValue) {
            document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue').value = getUid();
            document.getElementById('MainContentPlaceHolder_ctl00_btnLoginNet').click();
        }
    }

    // 如果当前页面是Offline商旅预订页面，则输入uid，并点击“国际机票”按钮
    function loginToOfflineOverSeaFlight() {
        //fat47的signinview.aspx需要跳转到当前的fat环境（如果当前fat环境不是fat47的话）
        if (window.location.href.indexOf('fat47') != -1 && fatConfigs.fatEnvir != 'fat47') {
            window.location.href = window.location.href.replace('fat47', fatConfigs.fatEnvir);
            return;
        }

        var userValue = document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue');
        if (userValue) {
            document.getElementById('MainContentPlaceHolder_ctl00_SignIn_UserValue').value = getUid();
            document.getElementById('MainContentPlaceHolder_ctl00_btnCorpFlightIntRESERVE').click();
        }
    }

    // 关闭当前UID的提示信息页面
    function closeMessage() {
        window.close();
    }

    // 获取当前配置的子模块号
    function getCurSubModeCode() {
        switch (curEnvir) {
            case EnumEnvir.Fat:
                return fatConfigs.subModeCode;
            case EnumEnvir.Uat:
                return uatConfigs.subModeCode;
            case EnumEnvir.Prod:
                return prodConfigs.subModeCode;
            default:
                return '';
        }
    }

    // 获取Uid
    function getUid() {
        switch (curEnvir) {
            case EnumEnvir.Fat:
                return fatConfigs.uid;
            case EnumEnvir.Uat:
                return uatConfigs.uid;
            case EnumEnvir.Prod:
                return prodConfigs.uid;
            default:
                return '';
        }
    }

    // 通过主机名寻找fat环境，比如：inbound.fat4.qa.nt.ctripcorp.com/ -> fat4
    function getFatEnvirFromPostName(hostname) {
        if (hostname != null && hostname != '') {
            var fstPoint = hostname.indexOf('.');
            var scdPoint = hostname.indexOf('.', fstPoint + 1);
            return hostname.substring(fstPoint + 1, scdPoint);
        }
    }

    /* -------------------------------------------------- 函数定义end --------------------------------------------*/

});
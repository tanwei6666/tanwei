var colorGray = "gray";
var colorBlack = "black";

document.getElementById("checkAvailBtn").addEventListener("click", function () {
    prepareForGetText();
    getWebServiceText('CheckAvail');
});

document.getElementById("hotelResbookBtn").addEventListener("click", function () {
    prepareForGetText();
    getWebServiceText('HotelRes_Book');
});

document.getElementById("hotelResCommitBtn").addEventListener("click", function () {
    prepareForGetText();
    getWebServiceText('HotelRes_Commit');
});

document.getElementById("paymentFormBtn").addEventListener("click", function () {
    prepareForGetText();
    getWebServiceText('PaymentForm');
});

document.getElementById("offlineHotelData_ReserveHotel_Btn").addEventListener("click", function () {
    prepareForGetText();
    getWebServiceText('OfflineHotelData_ReserveHotel');
});

document.getElementById("offlineHotelData_HotelSearch_Btn").addEventListener("click", function () {
    prepareForGetText();
    getWebServiceText('OfflineHotelData_HotelSearch');
});

document.getElementById("hotelRatePlanBtn").addEventListener("click", function () {
    prepareForGetText();
    getWebServiceText('HotelRatePlan');
});

function prepareForGetText() {
    var reqTextArea = document.getElementById('reqTa');
    var respTextArea = document.getElementById('respTa');

    reqTextArea.style.color = colorGray;
    respTextArea.style.color = colorGray;
    reqTextArea.value = '正在获取中，请耐心等待...';
    respTextArea.value = '正在获取中，请耐心等待...';
}

function getWebServiceText(dataType) {

    // 通过与background通信向服务端发起Ajax请求，获取WebService服务报文
    chrome.extension.sendRequest({ type: 'getWebServiceTextAjax', dataType: dataType }, function (response) {
        var reqTextArea = document.getElementById('reqTa');
        var respTextArea = document.getElementById('respTa');

        var reqXml = response.data.RequestXml;
        if (reqXml != null && reqXml != '') {
            reqTextArea.style.color = colorBlack;
            reqTextArea.value = reqXml;
        } else {
            reqTextArea.style.color = colorGray;
            reqTextArea.value = '未获取到数据';
        }

        var respXml = response.data.ResponseXml;
        if (respXml != null && respXml != '') {
            respTextArea.style.color = colorBlack;
            respTextArea.value = respXml;
        } else {
            respTextArea.style.color = colorGray;
            respTextArea.value = '未获取到数据';
        }

    });
}
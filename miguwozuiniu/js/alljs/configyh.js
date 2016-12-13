    var ose=detectOS(),
//  cam=returnCitySN["cip"],
    channel = "014DB03",//渠道号
 	  version = "1.0",
    device = navigator.product,
 	  os = ose,
 	  mac = "bsdbdbdb",	//机器mac地址
   	client = 'linux_box',
   	secureKey = "5GEYBZMPCRFLH1KU79WXNSOI6DTJQ834",
   	salt = "",//随机数值
   	desMa;//3des密码
console.log("mac="+mac);
 var uid = '';
 var token = '';
// alert(mac);
function genSaltAndCode() {
	 //随机六位数
	for(var i=0;i<6;i++) 
	{ 
		salt+=Math.floor(Math.random()*10); 
	} 
	desMa = $.md5(salt+secureKey);
}
genSaltAndCode();
 	 
function addbaseParam() {
	var param = {};
	param['channel'] = channel;
 	param['version'] = version;
 	param['client'] = client;
 	param['device'] = device;
 	param['os'] = os;
 	param['mac'] = mac;
 	if (uid.length > 0) {
 		param['uid'] = parseInt(uid);
 	}
 	if (token.length > 0) {
 		param['token'] = token;
 	}
 	return param;
}

 function requestService(service, reqKey, param, succBlock, failBlock) {
 	var aParam = addbaseParam();
 	if (reqKey && reqKey.length > 0) {
 		aParam[reqKey] = param;
 	}
 	var data = DES3.encrypt(desMa,JSON.stringify(aParam));
 	var time = Math.floor(new Date().getTime()/1000);
 	var token = $.md5(service+time+data+salt+version+secureKey);
 	var requestData = {
 		'token' : token,
 		'data' : data,
 		'time' : time,
 		'service' : service,
 		'version' : version,
 		'salt' : salt,
 	};
 	
 	$.ajax({
 		type : 'post',
		dataType:"jsonp",
		url: 'http://172.16.4.2:8080/game/do/jsonp',
		data:requestData,
		success: function(obj){
			var	objSalt3des = $.md5(obj.salt+secureKey);
 			var bodyobj = DES3.decrypt(objSalt3des,obj.body);	
 			var result= $.parseJSON(bodyobj);
   			console.log(obj);
			succBlock(result);
		},
		error: function(obj){
			failBlock(obj);
			alert("网络错误");
		}
 	});
 }
 
 function GetQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg);   
    var context = ""; 
    if (r != null) 
         context = r[2]; 
    reg = null; 
    r = null; 
    return context == null || context == "" || context == "undefined" ? "" : context; 
}
    function detectOS() {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
    }
    return "other";
}
 
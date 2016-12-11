var channel = "014DB03",//渠道号
 	version = "1.0",
  	device = navigator.product,
 	os = "iOS9.3",
 	mac = "abcddafdada",	//机器mac地址，这里仅供测试用
   	client = 'linux_box',
   	secureKey = "5GEYBZMPCRFLH1KU79WXNSOI6DTJQ834",
   	salt = "",//随机数值
   	desMa;//3des密码

 var uid = '';
 var token = '';

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
 	if (parseInt(uid).length > 0) {
 		param['uid'] = parseInt(uid);
 	}
 	if (token.length > 0) {
 		param['token'] = token;
 	}
 	return param;
}
 	 
 function requestService(service, reqKey, param, succBlock, failBlock) {
 	var aParam = addbaseParam();
 	aParam[reqKey] = param;
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
 			console.log(result);
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
 
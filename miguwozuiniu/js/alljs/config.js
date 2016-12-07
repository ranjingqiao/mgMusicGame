var channel = "014DB03",//渠道号
 	version = "1.0",
   	service = "req_channel_register",
  	device = navigator.product,
 	os = "iOS9.3",
 	mac = "abcdda",
   	client = 'linux_box',
    time = Math.floor(new Date().getTime()/1000),//当前时间秒
   	secureKey = "5GEYBZMPCRFLH1KU79WXNSOI6DTJQ834",
   	sixNum = "6",
   	salt = "",//随机数值
   	dataJson,//data=json数据加密=key
   	desMa,//3des密码
   	token,//请求token
   	objBody,
   	objSalt,
   	data,
   	bBase;
 

 //随机六位数
   	for(var i=0;i<sixNum;i++) 
		{ 
			salt+=Math.floor(Math.random()*10); 
		} 
		desMa = $.md5(salt+secureKey);
	
	
	
	
	 jsonData={"channel":"014DB03","version":"1.0","client":"linux_box","device":device,"os":"iOS9.3","mac":mac};
 	 data = DES3.encrypt(desMa,JSON.stringify(jsonData));
	
	  
 
	 
 
	 token = $.md5(service+time+data+salt+version+secureKey);
	  
 
	 $.ajax({
		type: "post",
		dataType:"jsonp",
		jsonp:'callback',
		url: "http://172.16.4.196:8080/game_music/do/jsonp",
		data: {
			token: token,
			data: data,
			time: time,
			service: service,
			version: version,
			salt: salt
		},
		success: function(obj){
			DomObj(obj);
		
		},
		error: function(obj){
			console.log("返回时error数据");
			
		}
		 
});
	 
	 
function DomObj(e){
	var	objSalt3des = $.md5(e.salt+secureKey);
	var bodyobj = DES3.decrypt(objSalt3des,e.body);	
	var jsonjx= $.parseJSON(bodyobj);
//	console.log("uid="+jsonjx.uid);
	$(".index10").attr('src',jsonjx.respClientChannelRegister.userInfo.head); 
	$("#index11").text(jsonjx.respClientChannelRegister.userInfo.nickname)
}
	 
	 
	 
	 
 
	 
 
//var str = "网址：http://www.sina.com.cn";
//document.write("原始字符串:</br>"+str);
//var base64 = BASE64.encoder(str);//返回编码后的字符 
//document.write("</br>BASE64后:</br>"+base64);
////alert(base64);
//var unicode= BASE64.decoder(base64);//返回会解码后的字符串。  
////alert(unicode);
//document.write("</br>还原:</br>"+unicode);
//var str= "你好123hello";
//var key = "qXSdHWfbSZaaLeHBRhLgxBiG";
//alert(decrypt_3des);
//var des3en = DES3.encrypt(key,str);
//document.write("</br>des3加密:</br>"+des3en);
//document.write("</br>des3解密:</br>"+DES3.decrypt(key,des3en));



//http://cache.baiducontent.com/c?m=9f65cb4a8c8507ed4fece763105392230e54f73e7d868a4e23878448e4380c075a37beed703f515888873e3047b84e28e9f03772360737b0efce8f41d6bd866d72c8713b285d914163d24ff88a5124b137e02bfed918f0cbf125e5dfc5d2af4323bc44727a97818a4d7665&p=8b2a971e8bd909e01abd9b7d0d1d8d&newp=9261d51385cc43f211bd9b7d0d1dcc231610db2151d6d31e6b82c825d7331b001c3bbfb423231702d7ce7e670bae435feef13173320821a3dda5c91d9fb4c57479d56e&user=baidu&fm=sc&query=js+3des%BC%D3%C3%DC%BD%E2%C3%DC&qid=dde997120000465a&p1=1
// var t = json_parse(des3enToken);  解析json插件
//    alert(t.name);  
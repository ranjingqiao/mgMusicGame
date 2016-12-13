
var currentIndex = 2;
var idList = ['category-menu-1', 'pkMode', 'gateMode', 'standingMode'];
var urlList = [
 	'1.html',
 	'2.html',
	'chuangguan/chuangguan.html',
 	'guodu/yizhandaodi.html',
];
 
 function onDirection(varDir) {
 	var num = (varDir == gKeyLeft || varDir == gKeyUp) ? -1 : 1;
 	if (currentIndex == 0 && num < 0) {
 		return;
 	}
 	if (currentIndex == idList.length - 1 && num > 0) {
 		return;
 	}
 	
 	toggleClass(currentIndex);
 	currentIndex = currentIndex + num;
 	toggleClass(currentIndex);
 }
 
 function onEnter() {
 	// 领取页面
 	if (document.getElementById("lignqujiangli-ran").style.display != 'none') {
 		requestService('sign_in', '', {}, function(res) {
 			//TODO:金币变化 res.respSignIn.gold
 		}, function (res) {
 			
 		});
 		document.getElementById("lignqujiangli-ran").style.display = 'none';
 		return;
 	}
 	
 	if (uid > 0 && token.length > 0) {
 		if (currentIndex == 1) {
 			if (!loginInfo.userInfo.pkCanPlay) {
 				gameLockTip(true);
 				return;
 			}
 		} else if (currentIndex == 3) {
 			if (!loginInfo.userInfo.standCanPlay) {
 				gameLockTip(false);
 				return;
 			}
 		}
 		  		 
 		var url = urlList[currentIndex];
 		url = addParamToUrl(url, {'uid' : uid, 'token' : token, 'life' : loginInfo.userInfo.life, 'gold' : loginInfo.userInfo.gold});
 		window.location = url;
 	}
}

function onBack() {
	
}
 
 function toggleClass(eleIndex) {
 	var ele = document.getElementById(idList[eleIndex]);
 	if (ele.className == "normal" || ele.className == "selected") {
 		var isNor = ele.className == "normal";
 		if (isNor) {
 			ele.className = "selected"
 			var nSrc = ele.src.replace(/(.*)nor/, '$1sel');
 			ele.src = nSrc;
 		} else{
 			ele.className = "normal";
 			var nSrc = ele.src.replace(/(.*)sel/, '$1nor')
 			ele.src = nSrc;
 		}
 	} else {
 		$("#category-menu-1").toggleClass("personSelected");
 	}
 }
 
 function gameLockTip(isPK) {
 	//TODO:未解锁如何提示
 }

var loginInfo;
var signInfo;
window.onload = function () {
	$("#index7").css("display","block");
    $("#index2").stop().animate({top:"11%"},1000).animate({top:"30%"},1000);
    $("#index3").stop().animate({top:"-1%"},1000).animate({top:"10%"},1000);
    $("#index4").stop().animate({top:"5%"},1000).animate({top:"18%"},1000);
    $("#index5").stop().animate({top:"29%"},1000).animate({top:"40%"},1000);
    $("#index6").stop().animate({top:"23%"},1000).animate({top:"29%"},1000);
    $("#index7").stop().animate({bottom:"1%"},1000).animate({bottom:"0"},500);
    $("#category-menu-1").stop()
    .animate({ height: '1px', width: '1%', top: '1%', left: '1%', display:'block' },1000)
    .animate({ height: '50px', width: '10%', top: '6%', left: '6%', fontSize:'16px' },1500);
    
    var param = {'mac' : mac, 'channel' : channel, 'version' : '1.0'};
    requestService('req_channel_register','reqClientChannelRegister',param, function (res) {
	 	loginInfo = res.respClientChannelRegister;
	 	uid = loginInfo.userInfo.id;
	 	token = loginInfo.token;
	 	$(".index10").attr('src',loginInfo.userInfo.head); 
		$("#index11").text(loginInfo.userInfo.nickname);
		
		var imgName = loginInfo.userInfo.pkCanPlay ? 'nor' : 'lock';
		$('#pkMode').attr('src',  '../img/indeximg/home_pk_' + imgName + '.png');
		imgName = loginInfo.userInfo.standCanPlay ? 'nor' : 'lock';
		$('#standingMode').attr('src',  '../img/indeximg/home_match_' + imgName + '.png');
		
		//签到
		var signList = loginInfo.signList;
		if (signList && signList.length == 8) {
			for (var i = 0; i < signList.length; i++) {
				if (signList[i].status == 1) {
					signInfo = signList[i];
					configSignView();
					$("#lignqujiangli-ran").show();
				} else if (signList[i].status == 0) {
					break;
				}
			}
		}
	 }, function (res) {
 		alert('信息获取失败');
	 });
};

//签到测试
//setTimeout(function() {
//	signInfo = {'day' : 5, 'gold' : 30, 'status' : 1};
//	configSignView();
//	$("#lignqujiangli-ran").show();
//},3000);

function configSignView() {
	var list = $(".indexonelingshang-content div");
	for (var i = 0; i < signInfo.day; i++) {
		var l = $(list[i]);
		$(l.children()[1]).css("display","none");
		$(l.children()[2]).css("display","block");
		$(l.children()[3]).css("display","none");
	}
}

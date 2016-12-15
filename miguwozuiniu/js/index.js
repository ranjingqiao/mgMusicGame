
var selectedId = 'gateMode';
var currentLayerId = 'main';
var layerIds = ['category-menu-1', 'pkMode', 'gateMode', 'standingMode'];
var layerInfo = {
	'main' : {
		'selectedId' : selectedId,
		'ids' : layerIds,
	},
	'lignqujiangli-ran' : {
		'ids' : ['lignqujiangli-ran-1'],
		'selectedId' : 'lignqujiangli-ran-1',
	},
	'onbackGame' : {
		'ids' : ['IBVExit', 'IBVCancel'],
		'selectedId' : 'IBVCancel',
	},
}
 
 function onDirection(varDir) {
 	var num = (varDir == gKeyLeft || varDir == gKeyUp) ? -1 : 1;
 	var currentIndex = layerIds.indexOf(selectedId);
 	if (currentIndex == 0 && num < 0) {
 		return;
 	}
 	if (currentIndex == layerIds.length - 1 && num > 0) {
 		return;
 	}
 	
 	if (currentLayerId == 'main') {
 		toggleClass(currentIndex, false);
 		currentIndex = currentIndex + num;
 		selectedId = layerIds[currentIndex];
 		toggleClass(currentIndex, true);
 	} else if (currentLayerId == 'onbackGame') {
 		toggleIconClass(selectedId, false);
 		var nextIndex = currentIndex + num;
 		selectedId = layerIds[nextIndex];
 		toggleIconClass(selectedId, true);
 	}
}
 
 function onEnter() {
 	if (currentLayerId == 'lignqujiangli-ran') {
 		requestService('sign_in', '', {}, function(res) {
 			//TODO:金币变化 res.respSignIn.gold
 		}, function (res) {
 			
 		});
 		hideLayer();
 	} else if (currentLayerId == 'onbackGame') {
 		if (selectedId == 'IBVExit') {
 			window.close();
 		} else {
 			hideLayer();
 		}
 	} else {
 		var currentIndex = layerIds.indexOf(selectedId);
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
	 		
	 		if (currentIndex != 2) {
	 			alert('功能正在开发中...');
	 			return;
	 		}
	 		
	 		var urlList = [
			 	'1.html',
			 	'2.html',
				'chuangguan/chuangguan.html',
			 	'guodu/yizhandaodi.html',
			];		 
	 		var url = urlList[currentIndex];
	 		url = addParamToUrl(url, {'uid' : uid, 'token' : token, 'life' : loginInfo.userInfo.life, 'gold' : loginInfo.userInfo.gold});
	 		window.location = url;
	 	} 		
 	}
}

function onBack() {
	if (currentLayerId != 'main') {
		hideLayer();
	} else {
		showFloatingLayer('onbackGame');
	}
}
 
 function toggleIconClass(eId, isSel) {
 	$('#' + selectedId).toggleClass('iconSelected');
 	var ele = document.getElementById(selectedId);
 	if (!isSel) {
 		var nSrc = ele.src.replace(/(.*)sel/, '$1nor')
		ele.src = nSrc;
	} else{
 		var nSrc = ele.src.replace(/(.*)nor/, '$1sel');
 		ele.src = nSrc;
 	}
 }
 
 function toggleClass(eleIndex, isSel) {
 	var ele = document.getElementById(layerIds[eleIndex]);
 	if (eleIndex > 0) {
 		if (isSel) {
 			ele.className = "selected";
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
		$("#nickName").text(loginInfo.userInfo.nickname);

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
					showFloatingLayer('lignqujiangli-ran');
				} else if (signList[i].status == 0) {
					break;
				}
			}
		}
	 }, function (res) {
 		alert('信息获取失败');
	 });
	 
//	 var mediaStr = 'http://182.150.56.177:58080/mgstatic/m_upload/music/1118/jiaruwoshiyizhangzhongguohua.mp3';
//	 cteatePlayerAndPlay(mediaStr);
};

//签到测试
//setTimeout(function() {
//	signInfo = {'day' : 5, 'gold' : 30, 'status' : 1};
//	configSignView();
//	showFloatingLayer('lignqujiangli-ran');
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

//var player;
//function cteatePlayerAndPlay(mediaStr) {
//	player = new MediaPlayer();
//	player.setSingleOrPlayListMode(0);
//	player.setCircleFlag(0);
//	player.setSingleMedia(mediaStr);
//	player.playFromStart();
//}




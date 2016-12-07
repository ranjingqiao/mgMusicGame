
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
 		document.getElementById("lignqujiangli-ran").style.display = 'none';
 		return;
 	}
 	
 	window.location = urlList[currentIndex];
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
 		
 	}
 }



















//游戏按钮类型
var gameButton = "game-button";
 //签到类型
 var sginButton = "sgin-button"
//新加部分
 function fun_enter(){  
      var oldObject = getElementObject(selectedClass);
	 if(!oldObject){
	 	return false;//className not exists
	 }
	 var attrType = oldObject[0].getAttribute("classSelectedActive");  
	 if(attrType == sginButton){
	 	signOkAction();
	 	return false;
	 }else if (attrType == gameButton) {
	 	gameOkAction(oldObject);
	 	return false;
	 }else{
	 	alert("未知类型");
	 	return false;
	 }
	 
}
//游戏按OK键操作
function gameOkAction(oldObject) {
	alert("游戏按OK键操作");
	var classNameList = oldObject[0].className;
	 var  _class =  classNameList.match(/\w{5}\-\d{1}\-\d{1}/);
	 if(!_class){
	 	return false; //逻辑设计错误class不存在
	 }
	 var classFiledList = parseClassName(_class[0]);
	 if(!classFiledList || !classFiledList[1]){
	 	return false; //class格式错误
	 }
	 var url = urlList[classFiledList[1]];
 	 window.location.href = url + '?action=' + classFiledList[1];	
}

//签到按OK键操作
function signOkAction() {
//	alert("签到按OK键操作");
	$("#lignqujiangli-ran").css("display","none");
	$($(".querenlingjian")[1]).remove("class-selected");
	 $("#cgms2").addClass("class-selected");
}


 
/***
*1、签到天数根据API取到签到的天数显示绿色对勾
*2、首页首次弹出浮层根据API数据来显示
*3、首次签到将默认class加到浮层
*4、签到之后将浮层默认class删除，添加到游戏选择按钮页面
*
****/
/*
isContinuation：是否为连续签到
sginInList：连续签到时间序列
isSginIn：当天是否签到过
**/
var UserSignList = {"isContinuation":true,"sginInList":[1,2,3,4],"isSginIn":false};

function initGame(info) {
	if(info.isSginIn){
		$("#cgms2").addClass("class-selected");
		$($('.indexonelingshang')[0]).css("display","none");
		return false;
	}
	$($(".querenlingjian")[1]).addClass("class-selected");
	var num =  info.isContinuation ? info.sginInList.length : 1;
	var list = $(".indexonelingshang-content div");
	for (var i = num - 1; i >= 0; i--) {
		var l = $(list[i]);
		$(l.children()[1]).css("display","none");
		$(l.children()[2]).css("display","block");
		$(l.children()[3]).css("display","none");
	}
}

initGame(UserSignList);



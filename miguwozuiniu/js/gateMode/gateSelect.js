
var chapterListInfo;
// 0-返回上一页列表, > totalGate, 进入下一页列表
var currentIndex = 1; //当前选中关卡 初始值chapterListInfo.focus
var totalGate = 19;		//本章所有关卡数

//当前挑战关卡记录
var recordChapter = 1;	
var recordGate = 9;	
//是否显示进入下一关
var hasNext = false;

 function onDirection(varDir) {
 	var num = (varDir == gKeyLeft || varDir == gKeyUp) ? -1 : 1; 
 	var minIndex = (chapterListInfo.currentParent > 1) ? 0 : 1;
 	if (currentIndex == minIndex && num < 0) {
 		return;
 	}
 	
 	var maxIndex = hasNext ? (recordGate + 1) : recordGate;
 	if (currentIndex == maxIndex && num > 0) {
 		return;
 	}
 	
 	toggleClass(currentIndex, false);
 	currentIndex = currentIndex + num;
 	toggleClass(currentIndex, true);
 }
   
 function onEnter() {
 	var url = "";
 	//TODO:确定跳转元素
 	if (currentIndex == 0 || currentIndex > totalGate ) {
 		if (eleIndex == 0) {
 			
 		} else {
 			
 		}
 	} else{
 		var url = "chuangguantwo.html?uid=" + uid + '&token=' + token + '&chapter=' + chapterListInfo.currentParent + '&section=' + currentIndex;
 	}
 	window.location = url;
}

function onBack() {
	//TODO：返回事件
}
 
 function toggleClass(eleIndex, isSel) {
 	if (eleIndex == 0 || eleIndex > totalGate ) {
 		if (eleIndex == 0) {
 			$('#leftArrow').toggleClass('selected');
 		} else {
 			$('#rightArrow').toggleClass('selected');
 		}
 	} else{
 		var src = isSel ? "../../img/chuangguanImg/stage_sel.png" :  "../../img/chuangguanImg/stage_nor.png";
 		$(".cg-starImgPosition-" + eleIndex).children(".cg-state").attr("src", src);
 	}
 }
 
 function parseQueryParam() {
	 uid = GetQueryString('uid');
	 token = GetQueryString('token');
	 if (uid.length < 1 || token.length < 1) {
	 	alert('query param error');
	 }
 }
 
function requestChapterList(chapterIdx) {
	requestService('chapter_list', 'reqChapterList', {'uid' : parseInt(uid), 'parent' : chapterIdx}, function (res) {
		chapterListInfo = res.respChapterList;
		updateVariable();
		updateUI();
	}, function (res) {
	});
}

function updateVariable () {
	currentIndex = chapterListInfo.focus;
	totalGate = chapterListInfo.chapterShows.length;
	recordGate = Math.min(chapterListInfo.passed + 1, totalGate);
	hasNext = chapterListInfo.passed == totalGate && chapterListInfo.currentParent < chapterListInfo.chapterCount;
}

function updateUI () {
	$('.yzdd-ran-img').attr('src', chapterListInfo.map);
	var chapterShows = chapterListInfo.chapterShows;
	$('.cg-star').hide();
	
	for (var i = 0; i < chapterShows.length; i++) {
		if (chapterShows[i].canPlay) {
			$('.cg-starImgPosition-' + (i+1)).children('.fight-num').each(function(idx, ele) { 
				ele.src = ele.src.replace(/(.*)number_no_/, '$1fight_mission');
			});
			var star = chapterShows[i].userStar;
			if (star > 0) {
				$('.cg-starImgPosition-' + (i+1)).children('.cg-star').show().attr('src', '../../img/chuangguanImg/stage_star_' + star +'.png');
			}
		}
	}
	toggleClass(currentIndex, true);
	if (chapterListInfo.currentParent > 1) {
		$('#leftArrow').show();
	}
	if (hasNext) {
		$('#rightArrow').show();
	}
	toggleClass(currentIndex, true);
}


window.onload = function () {
	parseQueryParam();
	requestChapterList(0);
};
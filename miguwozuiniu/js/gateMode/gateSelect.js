
var chapterListInfo;
// 0-返回上一页列表, > totalGate, 进入下一页列表
var currentIndex = 1; //当前选中关卡 初始值chapterListInfo.focus
var totalGate = 19;		//本章所有关卡数

//当前挑战关卡记录
var recordChapter = 1;	
var recordGate = 1;	
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
 	if (currentIndex == 0 || currentIndex > totalGate ) {
 		if (currentIndex == 0) {
 			requestChapterList(chapterListInfo.currentParent - 1);
 		} else{
 			if (chapterListInfo.totalStar > 45) {
 				requestChapterList(chapterListInfo.currentParent + 1);
 			} else{
 				//TODO:提示用户星星数不够
 				
 			}
 		}
 	} else{
 		var param = { 'uid' : uid,
 			'token' : token, 
 			'chapter' : chapterListInfo.currentParent, 
 			'section' : currentIndex, 
 			'totalSection' : totalGate,
 			'life' : life, 
 			'gold' : gold,
 		};
 		var url = addParamToUrl('chuangguantwo.html', param);
 		window.location = url;
 	}
}

function onBack() {
	//TODO:如果显示浮层，就隐藏浮层，否则返回首页
	window.location = '../indexone.html';
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
	 life = parseInt(GetQueryString('life'));
	 gold = parseInt(GetQueryString('gold'));
	 updateLife(life);
	 updateGold(gold);
	 if (uid.length < 1 || token.length < 1) {
	 	alert('query param error');
	 }
	 
	 var chapter = parseInt(GetQueryString('chapter')) ;
	 if (!chapter) {
	 	chapter = 0;
	 }
	requestChapterList(chapter);
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
	hasNext = chapterListInfo.passed == totalGate && chapterListInfo.currentParent < chapterListInfo.parentCount;
}

function updateUI () {
	$('.yzdd-ran-img').attr('src', chapterListInfo.map);
	var chapterShows = chapterListInfo.chapterShows;
	var vRatio = $(window).height() / 1080, hRatio = $(window).width() / 1920;
	$('#sectionContaner').html('');
	for (var i = 0; i < chapterShows.length; i++) {
		var index = i+1;
		var classId = 'cg-starImgPosition-' + index;
		var sectionNode = '<div class="' + classId + '"></div>';
		$('#sectionContaner').append(sectionNode);
		
		$('.' + classId).css('top', chapterShows[i].y * vRatio).css('left', chapterShows[i].x * hRatio);
		
		if (chapterShows[i].userStar > 0) {
			var starNode = '<img class="cg-star" src="../../img/chuangguanImg/stage_star_' + chapterShows[i].userStar + '.png"/>'
			$('.' + classId).append(starNode);
		}	
		
		var stateNode = '<img class="cg-state" src="../../img/chuangguanImg/stage_nor.png"/>';
		$('.' + classId).append(stateNode);
		
		var imgPre = chapterShows[i].canPlay ? 'fight_mission' : 'number_no_';
		if (index < 10) {
			var indexNode = '<img class="fight-num-' + index + ' fight-num" src="../../img/chuangguanImg/' + imgPre + index + '.png"/>';
			$('.' + classId).append(indexNode);
		} else {
			var tenNode = '<img class="fight-num-01 fight-num" src="../../img/chuangguanImg/' + imgPre + Math.floor(index / 10) + '.png"/>';
			var unit = Math.floor(index % 10);
			var unitId = unit == 1 ? 'fight-num-111' : 'fight-num-11';
			var unitNode = '<img class="' + unitId + ' fight-num" src="../../img/chuangguanImg/' + imgPre + unit + '.png"/>';
			$('.' + classId).append(tenNode, unitNode);
		}
	}
	
	if (chapterListInfo.currentParent > 1) {
		$('#leftArrow').show();
	} else {
		$('#leftArrow').hide();
	}
	if (hasNext) {
		$('#rightArrow').show();
	} else {
		$('#rightArrow').hide();
	}
	toggleClass(currentIndex, true);
}

window.onload = function () {
	parseQueryParam();
};
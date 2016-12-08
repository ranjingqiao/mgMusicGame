
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
 		//TODO:返回或前进
 	} else{
 		var url = "chuangguantwo.html";
 	}
 	window.location = url;
}

function onBack() {
	//TODO：返回事件
}
 
 function toggleClass(eleIndex, isSel) {
 	if (eleIndex == 0 || eleIndex > totalGate ) {
 		//TODO:返回或前进元素
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
	chapterShows = [{
		'parent' : 1,
		'child' : 1,
		'userStar' : 3,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 2,
		'userStar' : 2,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 3,
		'userStar' : 0,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 4,
		'userStar' : 1,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 5,
		'userStar' : 0,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 6,
		'userStar' : 3,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 7,
		'userStar' : 2,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 8,
		'userStar' : 0,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 9,
		'userStar' : 1,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 10,
		'userStar' : 2,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 11,
		'userStar' : 3,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 12,
		'userStar' : 3,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 13,
		'userStar' : 3,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 14,
		'userStar' : 2,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 15,
		'userStar' : 2,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 16,
		'userStar' : 3,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 17,
		'userStar' : 1,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 18,
		'userStar' : 2,
		'canPlay' : true,
	},
	{
		'parent' : 1,
		'child' : 19,
		'userStar' : 2,
		'canPlay' : true,
	}
];
	
	var totalStar = 0;
	for (var i = 0; i < chapterShows.length; i++) {
		totalStar += chapterShows[i].userStar;
	}
	
	chapterListInfo = {
		'chapterCount': 5,
		'chapterParent': 1,
		'totalStar' : 57,
		'userStar' : totalStar,
		'focus' :chapterShows.length,
		'chapterShows' : chapterShows,
		'passed' : chapterShows.length ,
		'map' : ''
	}
	updateVariable();
	updateUI();
	return;
	
	requestService('chapter_list', {'uid' : uid, 'parent' : chapterIdx}, function (res) {
		console.log(res);
	}, function (res) {
	});
}

function updateVariable () {
	currentIndex = chapterListInfo.focus;
	recordGate = Math.min(chapterListInfo.passed + 1, totalGate);
	
	hasNext = chapterListInfo.passed == totalGate;
}

function updateUI () {
	var chapterShows = chapterListInfo.chapterShows;
	$('.cg-star').hide();
	for (var i = 0; i < chapterShows.length; i++) {
		var star = chapterShows[i].userStar;
		if (star > 0) {
			$('.cg-starImgPosition-' + (i+1)).children('.cg-star').show().attr('src', '../../img/chuangguanImg/stage_star_' + star +'.png');
		}
		if (chapterShows[i].canPlay) {
			$('.cg-starImgPosition-' + (i+1)).children('.fight-num').each(function(idx, ele) { 
				ele.src = ele.src.replace(/(.*)number_no_/, '$1fight_mission');
			});
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
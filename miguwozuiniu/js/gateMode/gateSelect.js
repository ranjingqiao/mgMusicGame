
// 0-返回上一页列表, > totalGate, 进入下一页列表
var currentIndex = 1;	//当前选中关卡
var currentPage = 1;
var totalGate = 19;		//本页所有关卡数
//当前挑战关卡记录
var recordPage = 1;	
var recordGate = 3;	
var hasNext = currentPage < recordPage;
var hasPre = currentPage > 1;

 function onDirection(varDir) {
 	var num = (varDir == gKeyLeft || varDir == gKeyUp) ? -1 : 1; 
 	var minIndex = hasPre ? 0 : 1;
 	if (currentIndex == minIndex && num < 0) {
 		return;
 	}
 	
 	var maxIndex = hasNext ? recordGate + 1 : recordGate;
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
 	} else{
 		var src = isSel ? "../../img/chuangguanImg/stage_sel.png" :  "../../img/chuangguanImg/stage_nor.png";
 		$(".cg-starImgPosition-" + eleIndex).children(".cg-state").attr("src", src);
 	}
 }

//当前选中关卡
var currentIndex = 1;	
var currentPage = 1;

var randomRules = {
	'removeChar' : {
		"KEY_LEFT" : "",
		"KEY_UP" : "",
		"KEY_RIGHT" : "playBtn",
		"KEY_DOWN" : "skipChapter"
	},
	'skipChapter' : {
		"KEY_LEFT" : "removeChar",
		"KEY_UP" : "removeChar",
		"KEY_RIGHT" : "playBtn",
		"KEY_DOWN" : "char1"
	},
	'playBtn' : {
		"KEY_LEFT" : "skipChapter",
		"KEY_UP" : "removeChar",
		"KEY_RIGHT" : "tipAnswer",
		"KEY_DOWN" : "char7"
	},
	'tipAnswer' : {
		"KEY_LEFT" : "playBtn",
		"KEY_UP" : "removeChar",
		"KEY_RIGHT" : "",
		"KEY_DOWN" : "clearBtn"
	},
	'clearBtn' : {
		"KEY_LEFT" : "char8",
		"KEY_UP" : "tipAnswer",
		"KEY_RIGHT" : "",
		"KEY_DOWN" : "deleteBtn"
	},
	'deleteBtn' : {
		"KEY_LEFT" : "char24",
		"KEY_UP" : "clearBtn",
		"KEY_RIGHT" : "",
		"KEY_DOWN" : ""
	},
};

// char1-24
var selectedId = "removeChar";
var playBtnEnable = false;

function direct(eleId, direction) {
	if (eleId.length == 0) {
		return eleId;
	} else {
		if (eleId.indexOf('char') == 0) {
			return charDirection(eleId, direction);
		} else {
			var nId = randomRules[eleId][direction];
			if (nId == 'playBtn' && !playBtnEnable) {
				nId = randomRules[nId][direction];
			}
			return nId;
		}
	}
}

function charDirection(charID, vDir) {
	var index = parseInt(charID.substring(4));
	var delta = 0;
	if (vDir == gKeyUp) {
		if (index < 9) {
			return 'skipChapter';
		} else {
			delta = -8;
		}
	} else if (vDir == gKeyDown) {
		if (index > 16) {
			return '';
		} else {
			delta = 8;
		}
	} else if (vDir == gKeyLeft) {
		if (index % 8 == 1) {
			return '';
		} else {
			delta = -1;
		}
	} else if (vDir == gKeyRight) {
		if (index % 8 == 0) {
			if (index > 16) {
				return 'deleteBtn';
			} else {
				return 'clearBtn';
			}
		} else {
			delta = 1;
		}
	} 
	var nidx = index + delta;
	return 'char' + nidx;
}

 function onDirection(varDir) {
 	var nextId = direct(selectedId, varDir);
 	if (nextId.length > 0) {
	 	toggleClass(selectedId, false);
	 	toggleClass(nextId, true);
	 	selectedId = nextId;
 	} 
 }
   
 function onEnter() {
 	if (selectedId.indexOf('char') == 0) {
 		var str = getChar(selectedId);
 		if (str && str.length > 0) {
 			$('#answer' + answerIndex).html(str);
 			answerIndex++;
 			if (answerIndex > rightAnswer.length) {
 				var ans = '';
 				for (var i = 1; i < answerIndex; i++) {
 					ans += $('#answer' + i).html();
 				}
 				setTimeout(function(){
 					if (ans == rightAnswer) {
 						alert('回答成功');
 					} else{
 						alert('回答错误');
 						updateAnswerPool(rightAnswer);
 					}
 				}, 100);
 			}
 		}
 	} else {
 		if (selectedId == 'clearBtn') {
 			updateAnswerPool(rightAnswer);
 		} else if (selectedId == 'deleteBtn') {
 			if (answerIndex > 1) {
 				answerIndex--;
 				$('#answer' + answerIndex).html('');
 			}
 		} else if (selectedId == 'tipAnswer') {
 			
 		} else if (selectedId == 'skipChapter') {
 			
 		} else if (selectedId == 'removeChar') {
 			
 		} else if (selectedId == 'playBtn') {
 			
 		}
 	}
}

function onBack() {
	//TODO：返回事件
}
 
 function toggleClass(eleID, isSel) {
 	if (eleID.indexOf('char') == 0) {
 		eleID = 'bg' + eleID;
 	}
 	var ele = document.getElementById(eleID);
 	var nSrc;
 	if (isSel) {
 		nSrc = ele.src.replace(/(.*)nor/, '$1sel');
 	} else{
 		nSrc = ele.src.replace(/(.*)sel/, '$1nor');
 	}
 	ele.src = nSrc;
 }
 

var rightAnswer = "我相信你们";
var poolAnswer = "你们我想啊是个人才相注意王尼玛信月定";
var answerIndex = 1;

function updatePool (poolAns) {
	poolAnswer = poolAns;
	var poolCount = poolAnswer.length;
	if (poolCount > 24) {
		return;
	}
	var countPerRow = Math.ceil(poolCount / 3);
	var space = Math.floor((8 - countPerRow)/2);
	var row = -1;
	for (var i = 0; i < poolCount; i++) {
		var col = i % countPerRow;
		if(col == 0) {
			row++;
		}
		var index = row * 8 + space + col + 1;
		$("#char" + index).html(poolAnswer[i]);
	}
}

function updateAnswerPool(rightAns) {
	rightAnswer = rightAns;
	var ansCount = rightAnswer.length;
	var content = '';
	if (ansCount > 0) {
		content = '<div id="answer1" class="now-title2-1"></div>';
	}
	for (var i = 1; i < ansCount; i++) {
		content += '<div id="answer' + (i+1) + '" class="now-title2-2"></div>'
	}
	$('#answerContainer').width(46 * ansCount);
	$('#answerContainer').html(content);
	answerIndex = 1;
}

function getChar(charID) {
	return $("#" + charID).html();
}

updatePool(poolAnswer);
updateAnswerPool(rightAnswer);
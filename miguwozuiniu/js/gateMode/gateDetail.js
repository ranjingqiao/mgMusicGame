
//当前选中关卡
var chapter = 0;	
var section = 0;

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
 		if (str && str.length == 1) {
 			addAnswer(str);
 		}
 	} else {
 		if (selectedId == 'clearBtn') {
 			updateAnswerPool();
 		} else if (selectedId == 'deleteBtn') {
 			if (answerIndex > 1) {
 				answerIndex--;
 				$('#answer' + answerIndex).html('');
 			}
 		} else if (selectedId == 'tipAnswer') {
 			
 			addAnswer(questionInfo.answer[answerIndex - 1]);
 		} else if (selectedId == 'skipChapter') {
 			
 		} else if (selectedId == 'removeChar') {
 			removeDisturbChar();
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
 
function parseQueryParam() {
	 uid = GetQueryString('uid');
	 token = GetQueryString('token');
	 chapter = parseInt(GetQueryString('chapter'));
	 section = parseInt(GetQueryString('section'));
	 if (uid.length < 1 || token.length < 1 || chapter < 1 || section < 1) {
	 	alert('query param error');
	 }
 }

var questionInfo = {
	'questionId' : 'dafa',
	'title' : '猜歌手',
	'displayType' : 0,
	'music' : '',
	'code' : '', 
	'pause' : '30',
	'pool' : [],		//poolAnswer
	'answer' : "我相信你",
	'ask' : '',
	'answerType' : 'crossword', 
}
var poolAnswer = "你们我想啊是个人才相注意王尼玛信月定";
var disturbStr = '';
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
		setChar('char' + index, poolAnswer[i]);
	}
}

function updateAnswerPool() {
	var ansCount = questionInfo.answer.length;
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

function updateUI(chapter, section) {
	//TODO:章节数>9时会出问题
	$('#detailChapterIndex').attr('src', '../../img/chuangguanImg/fight_mission' + chapter  + '.png');
	if (section > 9) {
		var ten = Math.floor(section / 10);
		var unit = section % 10;
		$('#detailGateIndex1').attr('src', '../../img/chuangguanImg/fight_mission' + ten  + '.png');
		$('#detailGateIndex2').show().attr('src', '../../img/chuangguanImg/fight_mission' + unit  + '.png');
	} else{
		$('#detailGateIndex1').attr('src', '../../img/chuangguanImg/fight_mission' + section  + '.png');
		$('#detailGateIndex2').hide();
	}
}

function getChar(charID) {
	return $("#" + charID).html();
}

function setChar(charID, chr) {
	$('#' + charID).html(chr);
}

function addAnswer(c) {
	if (c && c.length == 1) {
		$('#answer' + answerIndex).html(c);
		answerIndex++;
		if (answerIndex > questionInfo.answer.length) {
			var ans = '';
			for (var i = 1; i < answerIndex; i++) {
				ans += $('#answer' + i).html();
			}
			setTimeout(function(){
				if (ans == questionInfo.answer) {
					alert('回答成功');
				} else{
					alert('回答错误');
					updateAnswerPool();
				}
			}, 100);
		}
	}
}

function genDisturbStr(pAnswer, rAnswer) {
	disturbStr = pAnswer;
	for (var i = 0; i < rAnswer.length; i++) {
		disturbStr = disturbStr.replace(rAnswer[i], '');
	}
	console.log('disturb chars: ' + disturbStr);
}

function removeDisturbChar() {
	if (disturbStr.length > 0) {
		var index = Math.floor(Math.random()*disturbStr.length);
		var removedChar = disturbStr[index];
		console.log('remove char: ' + removedChar);
		for (var i = 1; i < 24; i++) {
			var chr = getChar('char' + i);
			if (chr && chr == removedChar) {
				setChar('char' + i, '');
				disturbStr = disturbStr.replace(removedChar, '');
				return;
			}
		}
	}
}

window.onload = function () {
	parseQueryParam();
	updateUI(chapter, section);
	updatePool(poolAnswer);
	updateAnswerPool();
	genDisturbStr(poolAnswer, questionInfo.answer);
}


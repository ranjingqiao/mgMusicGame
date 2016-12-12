
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
 	if (currentLayerId == 'main') {
 		var nextId = direct(selectedId, varDir);
	 	if (nextId.length > 0) {
		 	toggleClass(selectedId, false);
		 	toggleClass(nextId, true);
		 	selectedId = nextId;
	 	} 
	 } else {
	 	var index = layerIds.indexOf(selectedId);
	 	var num = (varDir == gKeyLeft || varDir == gKeyUp) ? -1 : 1; 
	 	var nIdx = index + num;
	 	if (nIdx < 0 || nIdx > layerIds.length - 1) {
	 		return;
	 	}
	 	toggleIconClass(selectedId, false);
	 	selectedId = layerIds[nIdx];
	 	toggleIconClass(selectedId, true);
	 }
 }
   
 function onEnter() {
 	if (currentLayerId == 'main') {
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
 	} else {
 		//TODO:各种浮层的事件
 		if (currentLayerId == 'answerRightView') {
 			if (selectedId == 'answerRetry') {
 				updateViewWithQuestion();
 			} else {	 //answerNext
 				if (section == 19) {
 					backToMap();
 				} else {
 					section += 1;
 					requestQuestion(chapter,section);
 				}
 			}
 			hideLayer();
 		} else if (currentLayerId == 'backView') {
 			
 		} else {
 			
 		}
 	} 	
}

function onBack() {
	if (currentLayerId == 'main') {
		showFloatingLayer('backView');
	} else {
		hideLayer();
	}
}

function backToMap() {
	//TODO:返回地图关卡
}

function toggleIconClass(eleID, isSel) {
	$('#' + eleID).toggleClass('iconSelected');
	toggleClass(eleID, isSel);
	
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
var sceneId;

function requestQuestion(parent, child) {
	requestService('chapter_detail', 'reqChapterDetail', {'parent' : parseInt(parent), 'child' : parseInt(child)}, function(res) {
		questionInfo = res.questions.question[0];
		updateViewWithQuestion();
	}, function(res) {
		
	});
}

function chapterStart(parent, child) {
	requestService('chapter_start', 'reqChapterStart', {'parent' : parseInt(parent), 'child' : parseInt(child)}, function(res) {
		sceneId = res.scene.uuid;
	}, function(res) {
		
	});
}

function chapterPass() {
	requestService('chapter_pass', 'reqChapterPass', {'sceneId' : sceneId}, function(res) {
		$('#answerText').html(questionInfo.answer);
		
		showFloatingLayer('answserRightView');
	}, function(res) {
		
	});
}

function updateViewWithQuestion() {
	poolAnswer = questionInfo.pool.join('');
	updatePool(poolAnswer);
	updateAnswerPool();
	genDisturbStr(poolAnswer, questionInfo.answer);
	chapterStart(chapter, section);
}

function updatePool (poolAns) {
	poolAnswer = poolAns;
	var poolCount = poolAnswer.length;
	if (poolCount > 24) {
		poolCount = 24;
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
					chapterPass();
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
	requestQuestion(chapter, section);
	updateUI(chapter, section);
}

//main backView返回, answserRightView回答正确, lackView缺少金币或体力, shopView商店
var currentLayerId = 'main';
var layerIds = [];
var layerInfo = {
	'main' : {
		'selectedId' : selectedId,
	},
	'answserRightView' : {
		'ids' : ['answerRetry', 'answerNext'],
		'selectedId' : 'answerNext',
	},
	'lackView' : {
		'ids' : ['LVCancel', 'LVShop'],
		'selectedId' : 'LVShop',
	},
	'backView' : {
		'ids' : ['BVContinue', 'BVSkip', 'BVExit'],
		'selectedId' : 'BVContinue',
	},
	
}

function showFloatingLayer(layerId) {
	if (currentLayerId == layerId) {
		return;
	} 

	//保存layer信息
	layerInfo[currentLayerId].selectedId = selectedId;
	if (currentLayerId != 'main') {
		$('#' + currentLayerId).hide();
	}

	currentLayerId = layerId;
	if (layerId != 'main') {
		$('#' + layerId).show();
	}
	layerIds = layerInfo[layerId].ids;
	selectedId = layerInfo[layerId].selectedId;
}

function hideLayer() {
	showFloatingLayer('main');
}

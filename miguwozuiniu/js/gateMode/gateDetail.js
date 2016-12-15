//当前选中关卡
var chapter = 0;
var section = 0;
var totalSection = 19;

var isLifeLack = false;

var randomRules = {
    'removeChar': {
        "KEY_LEFT": "",
        "KEY_UP": "",
        "KEY_RIGHT": "playBtn",
        "KEY_DOWN": "skipChapter"
    },
    'skipChapter': {
        "KEY_LEFT": "removeChar",
        "KEY_UP": "removeChar",
        "KEY_RIGHT": "playBtn",
        "KEY_DOWN": "char1"
    },

    'playBtn': {
        "KEY_LEFT": "skipChapter",
        "KEY_UP": "removeChar",
        "KEY_RIGHT": "tipAnswer",
        "KEY_DOWN": "char7"
    },
    'tipAnswer': {
        "KEY_LEFT": "playBtn",
        "KEY_UP": "removeChar",
        "KEY_RIGHT": "",
        "KEY_DOWN": "clearBtn"
    },
    'clearBtn': {
        "KEY_LEFT": "char8",
        "KEY_UP": "tipAnswer",
        "KEY_RIGHT": "",
        "KEY_DOWN": "deleteBtn"
    },
    'deleteBtn': {
        "KEY_LEFT": "char24",
        "KEY_UP": "clearBtn",
        "KEY_RIGHT": "",
        "KEY_DOWN": ""
    }
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
                consumWealth(true, 30, function () {
                    goodConsum('chapter_prompt', function (res) {
                        updateGold(res.respGoldPay.gold);
                        addAnswer(questionInfo.answer[answerIndex - 1]);
                    });
                });
            } else if (selectedId == 'skipChapter') {
                skipSection();
            } else if (selectedId == 'removeChar') {
                consumWealth(true, 5, function () {
                    goodConsum('chapter_exclude', function (res) {
                        updateGold(res.respGoldPay.gold);
                        removeDisturbChar();
                    });
                });
            } else if (selectedId == 'playBtn') {
                playMusic();
            }
        }
    } else {
        //TODO:各种浮层的事件
        if (currentLayerId == 'answerRightView') {
            if (selectedId == 'answerRetry') {
                hideLayer();
                updateViewWithQuestion();
            } else {	 //answerNext
                hideLayer();
                if (section == totalSection) {
                    backToMap();
                } else {
                    goNextSection();
                }
            }
        } else if (currentLayerId == 'backView') {
            if (selectedId == 'BVContinue') {
                onBack();
            } else if (selectedId == 'BVSkip') {
                if (gold >= 90) {
                    skipSection();
                } else {
                    //提示金币不足
                }
            } else { //BVExit
                backToMap();
            }
        } else if (currentLayerId == 'lackView') {
            if (selectedId == 'LVCancel') {
                if (isLifeLack) {
                    backToMap();
                } else {
                    hideLayer();
                }
            } else { // LVShop
                //TODO:商店
                alert('商店未实现');
                if (isLifeLack) {
                    backToMap();
                } else {
                    hideLayer();
                }
            }

        }
    }
}

function goNextSection() {
    consumWealth(false, 1, function () {
        section += 1;
        requestQuestion(chapter, section);
    });
}

function onBack() {
    if (currentLayerId == 'main') {
        showFloatingLayer('backView');
    } else {
        hideLayer();
    }
}

function skipSection() {
    consumWealth(true, 90, function () {
        goodConsum('chapter_auto', function (res) {
            updateGold(res.respGoldPay.gold);
            chapterPass();
        })
    });
}

function consumWealth(isGold, value, callback) {
    isLifeLack = !isGold;
    if (isGold) {
        if (gold >= value) {
            updateGold(gold - value);
            callback();
        } else {
            $('#LVTip').html('金币值用完了，要不兑换点？');
            showFloatingLayer('lackView');
        }
    } else {
        if (life >= value) {
            callback();
        } else {
            $('#LVTip').html('体力值用完了，要不兑换点？');
            showFloatingLayer('lackView');
        }
    }
}

function goodConsum(goodType, succBlock) {
    var param = {
        'uid': uid,
        'type': 'chapter',
        'goodsType': goodType,
        'chargeType': 0,
        'sceneId': sceneId,
        'questionId': questionInfo.questionId,
        'count': 1
    };
    requestService('gold_pay', 'reqGoldPay', param, succBlock, function () {

    });
}

function backToMap() {
    var url = addParamToUrl('chuangguan.html', {
        'uid': uid,
        'token': token,
        'life': life,
        'gold': gold,
        'chapter': chapter
    });
    window.location = url;
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
    } else {
        nSrc = ele.src.replace(/(.*)sel/, '$1nor');
    }
    ele.src = nSrc;
}

function parseQueryParam() {
    uid = parseInt(GetQueryString('uid'));
    token = GetQueryString('token');
    chapter = parseInt(GetQueryString('chapter'));
    section = parseInt(GetQueryString('section'));
    totalSection = parseInt(GetQueryString('totalSection'));
    life = parseInt(GetQueryString('life'));
    gold = parseInt(GetQueryString('gold'));
    updateLife(life);
    updateGold(gold);
    if (token.length < 1 || chapter < 1 || section < 1) {
        alert('query param error');
    }
}

var questionInfo = {};
var poolAnswer = '';
var disturbStr = '';
var answerIndex = 1;
var sceneId;

function requestQuestion(parent, child) {
    requestService('chapter_detail', 'reqChapterDetail', {
        'parent': parseInt(parent),
        'child': parseInt(child)
    }, function (res) {
        questionInfo = res.questions.question[0];
        updateViewWithQuestion();
        heartRequest();
    }, function (res) {

    });
}

function chapterStart(parent, child) {
    requestService('chapter_start', 'reqChapterStart', {
        'parent': parseInt(parent),
        'child': parseInt(child)
    }, function (res) {
        sceneId = res.scene.uuid;
    }, function (res) {

    });
}

function chapterPass() {
    requestService('chapter_pass', 'reqChapterPass', {'sceneId': sceneId}, function (res) {
        requestService('httpTcpPush', 'uuid', salt, function (res) {
            updateGold(res.gold_change.goldChange.gold);
            var star = res.http_uid_channel.respChapterPass.star;
            var imgName = ['clear', 'good', 'good', 'perfect'][star];
            $('#answerEvalate').attr('src', '../../img/chuangguanImg/answer_result_ico_' + imgName + '.png');
            $('#answerStar').attr('src', '../../img/chuangguanImg/answer_result_star_' + star + '.png');
            $('#answerText').html(questionInfo.answer);
            if (section == totalSection) {
                $('#answerNext').attr('src', $('#answerNext').attr('src').replace(/(.*)next/, '$1return'));
            }
            showFloatingLayer('answerRightView');
        }, function (res) {

        });


    }, function (res) {

    });
}

function updateViewWithQuestion() {
    showFloatingLayer('main');
    updateUI(chapter, section);
    questionInfo.pool.sort(function () {
        return 0.5 - Math.random()
    });
    poolAnswer = questionInfo.pool.join('');
    genDisturbStr(poolAnswer, questionInfo.answer);
    updatePool(poolAnswer);
    updateAnswerPool();

    if (questionInfo.displayType == 0) {
        $('#questionAsk').hide();
        $('.now-runing0').show();
        $('.now-runing2').show();
        $('.now-runing3').show();
    } else {
        $('#questionAsk').show().html(questionInfo.ask);
        $('.now-runing0').hide();
        $('.now-runing2').hide();
        $('.now-runing3').hide();
    }

    var titleIndex = ['猜歌手', '猜歌曲', '猜歌词'].indexOf(questionInfo.title);
    if (titleIndex >= 0) {
        var titleNames = ['singername', 'songname', 'lrc'];
        $('#questionType').attr('src', '../../img/yzddImg/fight_content_' + titleNames[titleIndex] + '.png');
    }

    chapterStart(chapter, section);
    updateMusicControl();
}

function updateMusicControl() {
	fullscreenPlayForMp3(questionInfo.music);
//  var audioNode = document.getElementById('sectionMusic');
//  try{
//  	 audioNode.src = ;
// 		 audioNode.onened=function () {
//      playBtnEnable = true;
//      $('#playBtn').attr('src', '../../img/chuangguanImg/match_play_ico_nor.png');
//  };
//  playMusic();
//  }catch(e){
//  	alert(e+"网络请求异常")
//  }
}

function playMusic() {
    playBtnEnable = false;
    $('#playBtn').attr('src', '../../img/chuangguanImg/match_play_ico_no.png');
    toggleClass(selectedId, false);
    selectedId = 'removeChar';
    toggleClass(selectedId, true);
//  var audioNode = document.getElementById('sectionMusic');
//  audioNode.currentTime = 0;
//  audioNode.play();
}

function updatePool(poolAns) {
    poolAnswer = poolAns;
    var poolCount = poolAnswer.length;
    if (poolCount > 24) {
        poolCount = 24;
    }
    var countPerRow = Math.ceil(poolCount / 3);
    var space = Math.floor((8 - countPerRow) / 2);
    var row = -1;
    for (var i = 0; i < poolCount; i++) {
        var col = i % countPerRow;
        if (col == 0) {
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
        content += '<div id="answer' + (i + 1) + '" class="now-title2-2"></div>'
    }
    $('#answerContainer').width(46 * ansCount);
    $('#answerContainer').html(content);
    answerIndex = 1;
}

function updateUI(chapter, section) {
    //TODO:章节数>9时会出问题
    $('#detailChapterIndex').attr('src', '../../img/chuangguanImg/fight_mission' + chapter + '.png');
    if (section > 9) {
        var ten = Math.floor(section / 10);
        var unit = section % 10;
        $('#detailGateIndex1').attr('src', '../../img/chuangguanImg/fight_mission' + ten + '.png');
        $('#detailGateIndex2').show().attr('src', '../../img/chuangguanImg/fight_mission' + unit + '.png');
    } else {
        $('#detailGateIndex1').attr('src', '../../img/chuangguanImg/fight_mission' + section + '.png');
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
            setTimeout(function () {
                if (ans == questionInfo.answer) {
                    chapterPass();
                } else {
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
        var index = Math.floor(Math.random() * disturbStr.length);
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
}

//main backView返回, answerRightView回答正确, lackView缺少金币或体力, shopView商店
var currentLayerId = 'main';
var layerIds = [];
var layerInfo = {
    'main': {
        'selectedId': selectedId
    },
    'answerRightView': {
        'ids': ['answerRetry', 'answerNext'],
        'selectedId': 'answerNext'
    },
    'lackView': {
        'ids': ['LVCancel', 'LVShop'],
        'selectedId': 'LVShop'
    },
    'backView': {
        'ids': ['BVContinue', 'BVSkip', 'BVExit'],
        'selectedId': 'BVContinue'
    }
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

function heartRequest() {
    requestService('req_heart', 'reqHeart', {'time': 1},
        function (res) {
            heartInfo = res.respHeart;
            lifeRecovery();
        }, function (res) {

        });
}

// 体力值更新
function lifeRecovery() {
    life = heartInfo.hearts + '';
    updateLife(life);
    var countdown = heartInfo.countDown;
    var btn = document.getElementById("btn");
    //体力值上限
    if (countdown == -1) {
        btn.style.display = "none";
    } else {
        btn.style.display = "inline";
        var timer1 = setInterval(function () {
            if (countdown == 0) {
                clearInterval(timer1);
                heartRequest();
                return;
            }
            countdown--;
            var minute = parseInt(countdown / 60);
            if (minute < 10) {
                minute = '0' + minute;
            }
            var second = countdown % 60;
            if (second < 10) {
                second = '0' + second;
            }
            btn.innerHTML = minute + ':' + second;
        }, 1000);
    }
}
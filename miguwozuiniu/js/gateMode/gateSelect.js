var chapterListInfo;
// 0-返回上一页列表, > totalGate, 进入下一页列表
var totalGate = 19;		//本章所有关卡数

//当前挑战关卡记录
var recordChapter = 1;
var recordGate = 1;
//是否显示进入下一关
var hasNext = false;

var selectedId = 1;	//在main中可认为是index。
var currentLayerId = 'main';
var layerIds = [];
var layerInfo = {
    'main': {
        'selectedId': selectedId,
        'ids': layerIds
    },
    'lackView': {
        'ids': ['LVCancel', 'LVShop'],
        'selectedId': 'LVShop'
    },
    'lackStarView': {
        'ids': ['LSVCollection'],
        'selectedId': 'LSVCollection'
    }
}


function onDirection(varDir) {
    var num = (varDir == gKeyLeft || varDir == gKeyUp) ? -1 : 1;
    if (currentLayerId == 'lackView') {
        var index = layerIds.indexOf(selectedId);
        var nIdx = index + num;
        if (nIdx < 0 || nIdx > layerIds.length - 1) {
            return;
        }
        toggleIconClass(selectedId, false);
        selectedId = layerIds[nIdx];
        toggleIconClass(selectedId, true);
        return;
    }

    var minIndex = (chapterListInfo.currentParent > 1) ? 0 : 1;
    if (selectedId == minIndex && num < 0) {
        return;
    }

    var maxIndex = hasNext ? (recordGate + 1) : recordGate;
    if (selectedId == maxIndex && num > 0) {
        return;
    }

    toggleClass(selectedId, false);
    selectedId = selectedId + num;
    toggleClass(selectedId, true);
}


var currentLayerId = 'main';
var selectedId = 'LVShop';

function onEnter() {
    if (currentLayerId != 'main') {
        hideLayer();
        return;
    }

    if (selectedId == 0 || selectedId > totalGate) {
        if (selectedId == 0) {
            requestChapterList(chapterListInfo.currentParent - 1);
        } else {
            var levelStar = Math.floor(chapterListInfo.totalStar * 0.8);
            if (chapterListInfo.userStar < levelStar) {
                $('#LSVTip').html('您已经收集了' + chapterListInfo.userStar + '颗 <img src="../../img/chuangguanImg/chapter_star.png" /> 星星，还差' + (levelStar - chapterListInfo.userStar) + '颗星才能开启下一章节哦~');
                showFloatingLayer('lackStarView');
            } else {
                requestChapterList(chapterListInfo.currentParent + 1);
            }
        }
    } else {
        if (life < 1) {
            showFloatingLayer('lackView');
            return;
        }

        var param = {
            'uid': uid,
            'token': token,
            'chapter': chapterListInfo.currentParent,
            'section': selectedId,
            'totalSection': totalGate,
            'life': life,
            'gold': gold
        };
        var url = addParamToUrl('chuangguantwo.html', param);
        window.location = url;
    }
}

function onBack() {
    if (currentLayerId != 'main') {
        hideLayer();
    } else {
        window.location = '../indexone.html';
    }
}

function toggleIconClass(eId, isSel) {
    $('#' + selectedId).toggleClass('iconSelected');
    var ele = document.getElementById(selectedId);
    if (!isSel) {
        var nSrc = ele.src.replace(/(.*)sel/, '$1nor')
        ele.src = nSrc;
    } else {
        var nSrc = ele.src.replace(/(.*)nor/, '$1sel');
        ele.src = nSrc;
    }
}

function toggleClass(eleIndex, isSel) {
    if (eleIndex == 0 || eleIndex > totalGate) {
        if (eleIndex == 0) {
            $('#leftArrow').toggleClass('selected');
        } else {
            $('#rightArrow').toggleClass('selected');
        }
    } else {
        var src = isSel ? "../../img/chuangguanImg/stage_sel.png" : "../../img/chuangguanImg/stage_nor.png";
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

    var chapter = parseInt(GetQueryString('chapter'));
    if (!chapter) {
        chapter = 0;
    }
    requestChapterList(chapter);
}

function requestChapterList(chapterIdx) {
    requestService('chapter_list', 'reqChapterList', {'uid': parseInt(uid), 'parent': chapterIdx}, function (res) {
        chapterListInfo = res.respChapterList;
        updateVariable();
        updateUI();
    }, function (res) {
    });
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
    var btn = document.getElementById("btnn");
    //体力值上限
    if (countdown == -1) {
        btn.style.display = 'none';
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

function updateVariable() {
    selectedId = chapterListInfo.focus;
    totalGate = chapterListInfo.chapterShows.length;
    recordGate = Math.min(chapterListInfo.passed + 1, totalGate);
    hasNext = chapterListInfo.passed == totalGate && chapterListInfo.currentParent < chapterListInfo.parentCount;
}


function updateUI() {
    $('.yzdd-ran-img').attr('src', chapterListInfo.map);
    $('#userStarCount').html(chapterListInfo.userStar + ' / ' + chapterListInfo.totalStar);
    var chapterShows = chapterListInfo.chapterShows;
    var vRatio = $(window).height() / 1080, hRatio = $(window).width() / 1920;
    $('#sectionContaner').html('');
    for (var i = 0; i < chapterShows.length; i++) {
        var index = i + 1;
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
    toggleClass(selectedId, true);
}

window.onload = function () {
    parseQueryParam();
    heartRequest();
};


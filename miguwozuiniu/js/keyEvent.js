
var gKeyLeft = "KEY_LEFT";
var gKeyUp = "KEY_UP";
var gKeyRight = "KEY_RIGHT";
var gKeyDown = "KEY_DOWN";
var gKeyEnter = "KEY_ENTER";
var gKeyBack = "KEY_BACK";

// KeyUp, keyLeft, KeyRight, KeyDown, KeyEnter,KeyBack
//其他页面需要实现onDirection, onEnter, onBack方法

document.onkeydown=handleKeyEvent;
function handleKeyEvent(event) {
	if (event.keyCode==37 || event.keyCode==gKeyLeft) {
		onDirection(gKeyLeft);
	} else if (event.keyCode==38 || event.keyCode==gKeyUp){  
		onDirection(gKeyUp);
	} else if (event.keyCode==39 || event.keyCode==gKeyRight){
		onDirection(gKeyRight);
   } else if (event.keyCode==40 || event.keyCode==gKeyDown){
		onDirection(gKeyDown);
   } else if (event.keyCode==13 || event.keyCode==gKeyEnter) {
   		onEnter();
   } else if (event.keyCode==8 || event.keyCode==gKeyBack) {
   		//TODO:返回按键的值
   		onBack();
   }
} 
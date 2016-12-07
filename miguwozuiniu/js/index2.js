$(function(){
	var $pk1=$("#pk1"),
		$pk2=$("#pk2"),
		$yzdd1=$("#yzdd1"),
		$yzdd2=$("#yzdd2"),
		$cgms1=$("#cgms1"),
		$cgms2=$("#cgms2"),
		categoryCurrentId=1;
	function myfun(){
		 $("#index7").css("display","block");
	    $("#index2").stop().animate({top:"11%"},1000).animate({top:"30%"},1000);
	    $("#index3").stop().animate({top:"-1%"},1000).animate({top:"10%"},1000);
	    $("#index4").stop().animate({top:"5%"},1000).animate({top:"18%"},1000);
	    $("#index5").stop().animate({top:"29%"},1000).animate({top:"40%"},1000);
	    $("#index6").stop().animate({top:"23%"},1000).animate({top:"29%"},1000);
	    $("#index7").stop().animate({bottom:"1%"},1000).animate({bottom:"0"},500);
	    $("#index910").stop()
	    .animate({ height: '1px', width: '1%', top: '1%', left: '1%', display:'block' },1000)
	    .animate({ height: '50px', width: '10%', top: '6%', left: '6%', fontSize:'16px' },1500);
	    //闯关模式

		$("#cgms2").stop().animate({width:"1%", bottom:"-9%",display:"block"},100)
		.animate({width:"14%", bottom:"20%"},500);
	   
	    //一站到底模式
	    $("#yzdd1").stop()
	    .animate({ width: '1%', bottom:"-46%", right: '17%' },100)
	    .animate({ width: '22%', bottom:"18%", right: '17%', opacity: '1' },500);
	    //一站到底模式
	    $("#yzdd2").stop()
	    .animate({ opacity: '1' },500);
	    //PK模式
	    $("#pk1").stop().animate({ width: '1%', bottom:"-46%", left: '18%' },100)
	    .animate({ width: '23%', bottom:"18%", left: '18%', opacity: '1' },500);
	    $("#pk2").stop()
	    .animate({ opacity: '1' },500);
	    
	    
	}
	window.onload=myfun;//调用myfun
 
 



//	获取 
 
 
	function jumpPage() {   
    if (event.keyCode==37 || event.keyCode=="KEY_LEFT")//左   
       	 fun_left();   
    if (event.keyCode==38 || event.keyCode=="KEY_UP")//上   
        fun_up();  
    if (event.keyCode==39 || event.keyCode=="KEY_RIGHT" )//右   
        fun_right();   
    if (event.keyCode==40 || event.keyCode=="KEY_DOWN" )//下   
        fun_down();  
    if (event.keyCode==13 || event.keyCode=="KEY_ENTER")//enter   
        fun_enter();   
	}  
	function fun_left(){
		 

	}
	function fun_up(){

	}
	function fun_right(){
			 
	 
	}
	function fun_down(){
		
	}
	function fun_enter(){
//		window.location.href="http://www.baidu.com"	 
	}
document.onkeydown=jumpPage;   
function removeClass(removeClassName,selectedId){  
    var classNames = document.getElementById(selectedId).className;  
    classNames=classNames.replace(/(^\s*)|(\s*$)/g, "");  
    var classNameArr = classNames.split(" ");  
    var okClassNames = "";  
    for (var ii = 0; ii < classNameArr.length; ii++) {   
        if(!(classNameArr[ii]==removeClassName)){  
            okClassNames+=" "+classNameArr[ii];  
        }  
    }  
    document.getElementById(selectedId).className=okClassNames;  
}  	 
	 
	 
	  
	  
})//加载结束 
 
  
 
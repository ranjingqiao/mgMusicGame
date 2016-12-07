  /*$(function(){
 	var action = {
			//{"idName":"show or hide"}
		actionGo:function(obj){
			var _this = this
			$.each(obj,function(idName,action){
					var elenments = $("#"+idName)
					action == "show" ? _this.actionShow(elenments) : _this.actionHide(elenments)
			})
		},
		//show动画
		actionShow:function(obj){
			obj.show()
		},
		actionHide:function(obj){
			obj.hide()
		}
	}

	//闯关模式
 	$("#cgms1").click(function(){
 		 
		 var list = {"cgms1":"hide","cgms2":"show","yzdd2":"hide","yzdd1":"show","pk2":"hide","pk1":"show"}
		action.actionGo(list)
 	})
 	$('#cgms2').click(function(){
		 var list = {"cgms1":"hide","yzdd2":"hide","yzdd1":"show","pk2":"hide","pk1":"show"}
		action.actionGo(list)
		 
	});
	//一站到底模式
	
	$("#yzdd1").click(function(){
		
		 var list = {"yzdd1":"hide","yzdd2":"show","cgms2":"hide","cgms1":"show","pk2":"hide","pk1":"show"}
		 action.actionGo(list)
	})
	$("#yzdd2").click(function(){
		 
		 var list = {"cgms1":"hide","cgms2":"hide","yzdd2":"show","yzdd1":"hide","pk2":"hide","pk1":"show"}
		action.actionGo(list)
	})
	$("#pk1").click(function(){
		 
		var list = {"cgms1":"show","cgms2":"hide","yzdd2":"hide","yzdd1":"show","pk2":"show","pk1":"hide"}
		action.actionGo(list)
	})
	
	$("#pk2").click(function(){
	 
		 
		var list = {"cgms1":"show","cgms2":"hide","yzdd2":"hide","yzdd1":"show","pk2":"show","pk1":"hide"}
		action.actionGo(list)
	})
 })
	 
 */
 


 var action = {
			//{"idName":"show or hide"}
		actionGo:function(obj){
			var _this = this
			$.each(obj,function(idName,action){
					var elenments = $("#"+idName)
					action == "show" ? _this.actionShow(elenments) : _this.actionHide(elenments)
			})
		},
		//show动画
		actionShow:function(obj){
			obj.show()
		},
		actionHide:function(obj){
			obj.hide()
		}
	}
function fun_left(){
	alert('左边');
	//$("#pk1").css("width","100px");
	var list = {"cgms1":"show","cgms2":"hide","yzdd2":"hide","yzdd1":"show","pk2":"show","pk1":"hide"}
	action.actionGo(list)
	
}
function  fun_right(){
	alert('右边');
//	$("#cgms2").css("width","100px");
	 var list = {"cgms1":"hide","yzdd2":"hide","yzdd1":"show","pk2":"hide","pk1":"show"}
		action.actionGo(list)
	
}
function fun_up(){
	$("#yzdd1").css("width","100px");
	
	alert('上面')
}
function fun_down(){
	$("#pk1").css("width","100px");
	
	alert('按下')
}

 
 function fun_enter(){  
// 	 window.location.href="http://www.baidu.com";
      
}  



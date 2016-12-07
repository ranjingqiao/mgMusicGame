  
var rantime = 61, t;
			function times(){
			 	rantime--;
			document.getElementById("time").innerHTML=rantime;
			
				t = setTimeout('times()', 1000);
					if ( rantime <= 0 ){
						 rantime = 60;
						 alert("时间超时")
						 
			 			clearTimeout(t);
					}
			}
			times();	  
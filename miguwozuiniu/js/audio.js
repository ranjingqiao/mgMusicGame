  var mp;
        /** 初始化播放器 */
		function init(){
			if(mp == null || mp == undefined)
				mp = new MediaPlayer();
			var instanceId 			= mp.getNativePlayerInstanceID();
			var playListFlag 		= 0;		
			var videoDisplayMode 	= 1; 		// 0-自定义尺寸,1-全屏(默认),255-不显示在背后播放
			var width 				= 1280;		
			var height 				= 720;
			var left 				= 0; 		// 自定义尺寸必须指定
			var top		 			= 0;  		// 自定义尺寸必须指定
			var muteFlag 			= 0; 		// 0-有声(默认),1-静音
			var useNativeUIFlag 	= 1; 		// 0-不使用player的本地UI显示功能,1-使用player的本地UI显示功能(默认)
			var subtitleFlag 		= 0; 		// 0-不显示字幕(默认),1-显示字幕
			var videoAlpha 			= 0; 		// 0-不透明(默认),100-完全透明
			var cycleFlag 			= 1;		// 0-设置为循环播放（默认值）, 1-设置为单次播放 
			var randomFlag 			= 0;
			var autoDelFlag 		= 0;
			mp.initMediaPlayer(instanceId,playListFlag,videoDisplayMode,height,width,left,top,muteFlag,useNativeUIFlag,subtitleFlag,videoAlpha,cycleFlag,randomFlag,autoDelFlag);
			mp.setAllowTrickmodeFlag(0); //0-允许 TrickMode 操做 ,1-不允许 TrickMode 操作 (默认值) 
			mp.setAudioVolumeUIFlag(1);
		}


		/** 全屏播放 url--mp3播放地址 */
		function fullscreenPlayForMp3(url){
			mp.setSingleMedia(this.getMediaStrForMP3(url));
			mp.setVideoDisplayMode(0);
			mp.refreshVideoDisplay();
			mp.playFromStart();
		}



		/** 获取播放串MP3 */
		function getMediaStrForMP3(url){
			var json = '';
			json += '[{mediaUrl:"'+url+'",';
			json +=	'mediaCode: "jsoncode1",';
			json +=	'mediaType:4,';
			json +=	'audioType:2,';
			json +=	'videoType:1,';
			json +=	'streamType:1,';
			json +=	'drmType:1,';
			json +=	'fingerPrint:0,';
			json +=	'copyProtection:1,';
			json +=	'allowTrickmode:1,';
			json +=	'startTime:0,';
			json +=	'endTime:20000.3,';
			json +=	'entryID:"jsonentry1"}]';
			return json;
		}



		init();
		fullscreenPlayForMp3('http://182.150.56.177:58080/mgstatic/m_upload/music/1118/jiaruwoshiyizhangzhongguohua.mp3');


 
  
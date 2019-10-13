!function($){

    function modernize() {

      var userAgent     = window.navigator.userAgent.toLowerCase();
      var appVersion     = window.navigator.appVersion.toLowerCase();
      var isLegacy     = appVersion.indexOf("msie 8.0") > -1 || appVersion.indexOf("msie 9.0") > -1 || appVersion.indexOf("msie 10.0") > -1;
      var isIE10         = appVersion.indexOf("msie 10.0") > -1;
      var isIE11         = navigator.userAgent.toLowerCase().indexOf('trident/7') > -1;
      var isIE8over     = appVersion.indexOf("msie 8.0") > -1 || appVersion.indexOf("msie 9.0") > -1 || appVersion.indexOf("msie 10.0") > -1 ||  appVersion.indexOf("msie 11.0") > -1;
      var isIE         = userAgent.indexOf("msie") !== -1 || navigator.userAgent.match(/Trident/);
      var isAndroid     = navigator.userAgent.match(/Android/i);
      var isIPhone     = navigator.userAgent.match(/iPhone/i);
      var isSP         = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i);
      var isIPad         = navigator.userAgent.match(/iPad/i);
      var isFF         = userAgent.indexOf("firefox")!== -1;
      var isEdge         = userAgent.indexOf("applewebkit") > -1 && userAgent.indexOf("edge") > -1;
      var isSafari     = userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1;
      var isMobile    = true;
      var isSmallScreen = false;
      var isPC = true;

      if(isAndroid || isIPhone || isIPad){
        isPC = false;
        if(isAndroid){
            document.documentElement.className = "os_android";
        }
      }else{
        isPC = true;
        $("body").addClass("noTouch");
      }

      if(isIE) {
        $("body").addClass("isIE");
      } else {
        $("body").addClass("noIE");
      }
    }

    // FUNCTIONS

    function drawer() {
    	$('#navBtn').on('click',function(){
    		$('body').toggleClass('nav-isOn');
    	});
    }

    function SmoothScroll() {

    	$('a[href^="#"]').on('click', function(e){

    		e.preventDefault(); // デフォルトの処理キャンセル

    		var id = this.getAttribute('href').split('#')[1];
    		if(id && $('#'+id).length !== 0){
    			var y = $('#'+id).offset().top;
    		}else{
    			var y = 0;
    		}
    		var duration = Math.min(600, Math.abs(y-(document.body.scrollTop || document.documentElement.scrollTop)));
    		// ページの長さに応じて速度を変える
    		var fixheaderH = 0; // 固定ヘッダーの高さ
    		var offsetY = 80; // オフセット
    		var easing = 'easeOutQuint' // with jquery.easing
    		$('html,body').stop().animate({scrollTop:y - fixheaderH - offsetY }, duration, easing , function(){
    		});

        let whash = window.location.hash;
//      	window.history.pushState(null, null, this.hash); // ヒストリー追加 + ハッシュ書換
        if(id=="top"){
          window.location.hash = "";
        }else {
          window.location.hash = id;  // ハッシュ書換
        }

        $('body').removeClass('nav-isOn');
    	});
    }

    // RUN
	$(function(){
    $('body').addClass('isReady');
    modernize();
    SmoothScroll();
    drawer();
	});

}(jQuery);

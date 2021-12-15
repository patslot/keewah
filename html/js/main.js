;(function() {
    var mainapp = angular.module("mainapp", ['ngAnimate','ngTouch']);

    mainapp.controller("maincontroller",['$scope','$filter', '$window', '$timeout', function($scope,$filter ,$window,$timeout) {
        var cookies_images =['images/cookie1.png','images/cookie2.png','images/cookie3.png','images/cookie4.png','images/cookie4.png'];
        var cookies = [];
        var collisionbox = $("#collisionbox");
        var cookieContainer = $("#cookieContainer");
        var backgroundContainer = $("#bg");
        var background = $("#bg img");
        var charater = $("#char");
        var step = 8 ; 
        var timecounter = 0;
        var creatCookieHandle = null ;
        var backgroundMotionHandle = null ;
        var clockHandle = null;
        var start = null;
        var gameEnd = false; 
          var queries = {};
          var sfrom=""; 
          $.each(document.location.search.substr(1).split('&'),function(c,q){
            var i = q.split('=');
            if(i!=""){
                queries[i[0].toString()] = i[1].toString();
                if (queries.b){
                    sfrom = queries.b;
                    
                }
            }
          });
        
        $scope.witherror = false ; 
        $scope.errorobj = {
                    name: null,
                    mobile: null,
                    hkid: null,
                    email: null,
                    tnc: null
                    }; 
        $scope.totalPoint = 0 ; 
        if(sfrom){ 
            $scope.stage = 2; }
        else{
            $scope.stage = 1; 
        }
        $scope.point = 0 ; 
        var windowfocus = true; 
        var backgroundContainerPos = {      x1:backgroundContainer.position().left,
                                            y1:backgroundContainer.position().top,
                                            x2:backgroundContainer.position().left + backgroundContainer.width(),
                                            y2:backgroundContainer.position().top + backgroundContainer.height()
                                       };
        $(window).on('focus', function(){ windowfocus = true; });
        $(window).on('blur', function(){ windowfocus = false; });
        //$(window).on('resize',resizewindow); 
        $scope.hide = function(){
            
        }
        function resizewindow(){
          
        }
           function collision($div1, $div2) {
              var x1 = $div1.offset().left;
              var y1 = $div1.offset().top;
              var h1 = $div1.outerHeight(true);
              var w1 = $div1.outerWidth(true);
              var b1 = y1 + h1;
              var r1 = x1 + w1;
              var x2 = $div2.offset().left;
              var y2 = $div2.offset().top;
              var h2 = $div2.outerHeight(true);
              var w2 = $div2.outerWidth(true);
              var b2 = y2 + h2;
              var r2 = x2 + w2;

              if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
              return true;
            }
        function detectbound(obj, direction){
            var objPos = {     x1:obj.position().left,
                               y1:obj.position().top,
                               x2:obj.position().left + obj.width(),
                               y2:obj.position().top + obj.height()
                       };    
           
            if(direction=="left"){
                if ( objPos.x1 - step > backgroundContainerPos.x1){
                  return true
              }
                else{
                    return false
                } 
            }
            if(direction=="right"){
                if ( objPos.x2 + step < backgroundContainerPos.x2){
                  return true
              }
                else{
                    return false
                } 
            }
                    
        }
        var i = 0 ;
         
        function createCookie(){
            if(!windowfocus) return
             if(gameEnd) return
            var random = Math.floor(Math.random() * 5);
            if (random == 0){ point = 10; speed = 7; }
            if (random == 1){ point = 30; speed = 5;}
            if (random == 2){ point = 50; speed = 3; }
            if (random == 3){ point = 100; speed = 1.5; }
            if (random == 4){ point = 100; speed = 1.5; }
            var position = Math.floor(Math.random() * 70)+10;
            i=i+1 ;
            var cookie = {
                        cookieId : 'cookie'+i , 
                        cookieimage : cookies_images[random],
                        point : point,
                        speed : speed,
                        position : position,
                        handle : null 
                     }; 
            
             $('#cookieContainer').append('<div class="cookie" id="'+cookie.cookieId+'" style="left:'+ cookie.position+'%"><img src="'+cookie.cookieimage+'"></div>').ready(function(){
            
             var startcounter = null;
              var x =0 ;
              function step(timestamp) {
                  if (!startcounter) startcounter = timestamp;
                  var progress = timestamp - startcounter;

                  if (progress >= 20) {
                      startcounter = timestamp;
                      x = x + 1.5 ;
                     cookieMotion(cookie);
                  }
                 window.requestAnimationFrame(step);
                }

            window.requestAnimationFrame(step);    
               
                 //cookie.handle = setInterval( function(){cookieMotion(cookie)},20);
                 
             });
            
            cookies.push(cookie);
            
        }
   
        function cookieMotion(obj){
           
            
           var objElement = $("#"+obj.cookieId);
            if(objElement.length == 0 ) return 
            if(gameEnd) return 
           var objPos ={    
                        x1:objElement.position().left,
                        y1:objElement.position().top,
                        x2:objElement.position().left + objElement.width(),
                        y2:objElement.position().top + objElement.height()
                      };
           var topbound = Math.floor(Math.random() * (cookieContainer.height()/6) );
            
            if(objPos.y1 < cookieContainer.height()){
                if( collision(objElement,collisionbox) ){
                    
                    //$.mbAudio.play('effectSprite', 'collision');
                    obj.speed = -obj.speed
                    objElement.css('top', charater.position().top ) ;
                }
                if (( objPos.y1 < topbound ) && (obj.speed < 0)){
                    obj.speed = -obj.speed
                }
                var factor =  cookieContainer.height() / (obj.speed * objElement.height() ) ;
                
                var y = objElement.position().top + factor ; 
                objElement.css('top',y)
            }else{
               // $.mbAudio.play('effectSprite', 'drop');
                $("#"+obj.cookieId).remove();
                cookies = jQuery.grep(cookies, function(value) {
                  return value.cookieId !== obj.cookieId;
                });
                clearInterval(obj.handle);
            }
        }
        
        
        function background_motion() {
            if(gameEnd) return
            var backgroundPos ={    x1:background.position().left,
                                    y1:background.position().top,
                                    x2:background.position().left + background.width(),
                                    y2:background.position().top + background.height()
                               };
            if(backgroundPos.x2>backgroundContainerPos.x2){
                var x = background.position().left - ( background.width() / 1500 ); 
                background.css('left',x)
            }else{
                //background.css('left',0)
                stopgame();    
           }
        }
        
        $scope.setStage = function(x){
            if(x==5){
                if($scope.totalPoint < 700){
                    ga('send', 'event', 'coupon95',  'coupon95' , 'coupon95' );
                }else{
                    ga('send', 'event', 'coupon90',  'coupon90' , 'coupon90' );
                }
            
            }
            $scope.stage = x; 
        }
        $scope.showtnc = function(){
            $scope.stage = 8 ; 
        }
        $scope.gamestart = function(){
             gameEnd = false;
             var startcounter = null;
            
             var bgcounter = null;
              var x =0 ;
              function step(timestamp) {
                  if (!startcounter) startcounter = timestamp;
                   if (!bgcounter) bgcounter = timestamp;
                  var progress = timestamp - startcounter;

                  var bgprogress = timestamp - bgcounter;
                  if (bgprogress >= 20) {
                      bgcounter = timestamp;
                      background_motion();   
                  }
                  if (progress >= 1500) {
                      startcounter = timestamp;
                      x = x + 1 ;
                     
                     if(x <= 30){
                         
                        createCookie();          
                     }
                  
                  }
                 window.requestAnimationFrame(step);
                }

            window.requestAnimationFrame(step);
            start = new Date ; 
            $scope.stage = 3 ;
            ga('send', 'event', 'game',  'start' , "start");

            
            
            //creatCookieHandle =  setInterval(function(){ createCookie();  } ,1500);
            
            //backgroundMotionHandle =  setInterval(background_motion ,20);
           
            //clockHandle = setInterval(clockmotion, 1000);
            
            
        }
        
        $scope.clickPanel = function(e){
            e.preventDefault();
            mouseClickPosX = e.offsetX;
            var charaterCenter = charater.position().left + (charater.width()/2) ;
           
            if (mouseClickPosX <= charaterCenter){
                
                moveleft() ;
            }
            else{
                moveright() ;
            }
            
        }
        
        $scope.moveleft = function(e){
            e.preventDefault();
            moveleft() ;
        }
        $scope.moveright = function(e){
             e.preventDefault();
            moveright() ;
        }
        $scope.replay = function(){
            
            ga('send', 'event', 'game',  'replay' , 'replay' );
           location.reload();
        }
        function moveleft(){
            if(detectbound(charater,"left") ){
               
               var moveDistanse = backgroundContainer.width() * (step / 100 ); 
               
                var x = charater.position().left ; 
                charater.css('left', x-moveDistanse);
                collisionbox.css('left','13%');
                $("#char img").attr("src","images/charater_left.gif");
            }
        }
        
        function moveright(){
            
             if(detectbound(charater,"right") ){
                var moveDistanse = backgroundContainer.width() * (step / 100 ); 
                
                var x = charater.position().left ; 
                charater.css('left', x+moveDistanse);
                collisionbox.css('left','49%');
                $("#char img").attr("src","images/charater_right.gif");
             }
        }
         function stopgame(){
             gameEnd = true ; 
             //clearInterval(creatCookieHandle);
             //clearInterval(backgroundMotionHandle);
             //clearInterval(clockHandle);
             
            ga('send', 'event', 'game',  'finish' , "finish");
             $scope.clickPanel = null ;
              $("#char img").attr("src","images/panda_stand.png");
             $.each(cookies, function(id, obj){
                 $scope.totalPoint =  $scope.totalPoint + obj.point ;
                    
                 // console.log($scope.totalPoint);
                 clearInterval(obj.handle);
                 //cookieContainer.empty();
             });
             var i = 0 ; 
             var j = cookies.length ;
             $.each(cookies,function(id,obj){
                var self = obj ;
                    setTimeout(function () {
                        $scope.$apply(function () {
                             $scope.point = $scope.point + obj.point ;
                        });
                    }, 500*id);
                    $("#"+self.cookieId).delay(500 * id).animate({
                         top:'3%',left:'46%',opacity: '0'
                    }); 
                    $("#"+self.cookieId).promise().done(function(){
                        i++ ; 
                        
                     
                       $("#"+self.cookieId).remove();   
                        if(i==j){
                            setTimeout(function () {
                                showresult();
                            },2000);
                        }
                    });  
               
             });
              
             
         }
         
         function showresult() {
             $scope.stage = 4;
             $scope.$apply();
         }
         function clockmotion() {
             
             timecounter = Math.floor((new Date - start) / 1000) ;
              // console.log(timecounter);
             if(timecounter>=30){
                 //stopgame();
             }
         }
        $scope.reseterror = function(x){
            $scope.errorobj[x] = null ;
            $("#"+x).val('');
            $("#"+x).focus();
        }
        $scope.formsubmit = function(){
            $scope.witherror = false;
            if($scope.name == null){
                console.log("name error");
                $scope.errorobj.name = "error" ; 
                $scope.witherror = true;
            }
            var mobileregexp = /^[5689][0-9]{7}$/;
            if($scope.mobile == null){
                console.log("mobile error");
                $scope.errorobj.mobile = "error" ; 
                $scope.witherror = true;
            }else  if (!/^[5689][0-9]{7}$/.test($scope.mobile)) {
                console.log($scope.mobile + " mobile wrong " + mobileregexp.test($scope.mobile));
                $scope.errorobj.mobile = "error" ; 
                $scope.witherror = true;
            }
            
            var hkidregexp = /^[0-9]{4}$/;
            if($scope.hkid == null){
                console.log("hkid error");
                $scope.errorobj.hkid = "error" ; 
                $scope.witherror = true;
            }else  if (!hkidregexp.test($scope.hkid)) {
                console.log("hkid wrong");
                $scope.errorobj.hkid = "error" ; 
                $scope.witherror = true;
            }
            
            var emailregexp =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
            if($scope.email == null){
                console.log("email error");
                $scope.errorobj.email = "error" ; 
                $scope.witherror = true;
            }else  if (!emailregexp.test($scope.email)) {
                console.log("email wrong");
                $scope.errorobj.email = "error" ; 
                $scope.witherror = true;
            }
            
            
            if(!$scope.tnc){
                console.log("tnc error");
                $scope.errorobj.tnc = "error" ; 
                $scope.witherror = true;
            }else{
                $scope.errorobj.tnc = null ; 
                $scope.$apply;
            }
            if(!$scope.witherror){
                godatabase();
            }
        }    
         
         var godatabase = function(){
               
                var formdata = {
                     
                      name: $scope.name,
                      phone: $scope.mobile,
                      hkid: $scope.hkid,
                      email: $scope.email,
                      mark: $scope.totalPoint
                    };
                    
                    console.log(formdata);
                $.post('https://keewah-186808.appspot.com/submit',formdata).done(function( data ) {
                            var responseData = jQuery.parseJSON( data );
                            if(responseData.status=="SUCCESS") {
                                
                                //ga('send', 'event', 'formsubmited',  formdata.location );
                                $scope.stage = 10 ;  
                                $scope.$apply();
                                // $(".content").html("多謝參加")
                            }else
                            if(responseData.status=="REGISTER-FAIL") {
                                alert("未能成功提交！")
                            }
                            else{
                                alert("未能成功提交！")
                            }
                            
                    })
            
         }   
        
         
         
         function handle_fbshare() {
                var currenetPath = $window.location.pathname;
                  currenetPath = currenetPath.substring(0, currenetPath.lastIndexOf("/"));
                  currenetPath = $window.location.protocol+"//"+$window.location.host + currenetPath + "/";
                var filename = $scope.ringname ;
                    FB.ui({
                                method: 'share_open_graph',
                                action_type: 'og.shares',
                                action_properties: JSON.stringify({
                                    object : {
                                       'og:url': currenetPath +'index.html',
                                       'og:title': '【有獎遊戲】《奇華Make a Wish‧熊貓驚喜Fun Fun賞》',
                                       'og:description': '立即入嚟幫奇華聖誔熊貓佈置聖誔樹，即有機會獲得奇華餅家聖誔套裝一份(總值:$268)',
                                        'og:image:url': 'http://campaign.nextdigital.com.hk/keewah_xmas2017/images/fbshare.jpg' ,
                                        'og:image:width': '1200',
                                        'og:image:height': '630'
                                    },
                                    image: 'http://campaign.nextdigital.com.hk/keewah_xmas2017/images/fbshare.jpg'
                                })


                    }, function(response) { 
                            ga('send', 'event', 'share',  'facebook' , "facebook");
                      });
            } 
           $scope.sharefacebook = function(){
               handle_fbshare();
               
            } 

            
            
    }]);
    
    
    
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
          appId: '907948416036450',
          version: 'v2.7'
        });     
        $('#loginbutton,#feedbutton').removeAttr('disabled');
   
    });
    
    
})();    



$(function() {
  

  $( document ).ready(function() {
      

    $("body").on("contextmenu",  function() { return false; });
      
    $(".luckball").delay(500).animate({top:'3%'},{duration:2000}).animate(
            {rotation: 360},
            {
            duration: 1500,
            step: function(now, fx) {
              $(this).css({"transform": "rotate("+now+"deg)"});
            }
          }
    ).delay(1000).animate({top:'-400%'},{duration:2000});
      
  });
    
    
   $( "input" ).focus(function() {
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
		if(isAndroid) {
			// Do something!
			// Redirect to Android-site?
			$("#formcontainer").addClass("keyboardbugfix");
		}
	});
	$( "input" ).blur(function() {
		$("#formcontainer").removeClass("keyboardbugfix");
	}); 
    
    $.mbAudio.sounds = {
            effectSprite: {
                id    : "effectSprite",
                mp3   : "sound/sound.wav",
                sprite: {
                    silent     : {id: "streak", start: 0, end: 0.1, loop: false},
                    drop     : {id: "streak", start: 0.1, end: 0.7, loop: false},
                    collision         : {id: "great", start: 0.7, end: 1, loop: false}
                    
                }
            }
        };
    //$.mbAudio.play('effectSprite', 'silent');
    function audioIsReady() {
            setTimeout(function () {
                
                   

            }, 3000);
        }

        $(document).on("initAudio", function () {
            $.mbAudio.pause('effectSprite', audioIsReady);
        });
});
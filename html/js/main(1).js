;(function() {
    var mainapp = angular.module("mainapp", ['ngAnimate']);

    mainapp.controller("maincontroller",['$scope','$filter', '$window', '$timeout', function($scope,$filter ,$window,$timeout) {
        var cookies_images =['images/cookie1.png','images/cookie2.png','images/cookie3.png'];
        var cookies = [];
        var collisionbox = $("#collisionbox");
        var cookieContainer = $("#cookieContainer");
        var backgroundContainer = $("#bg");
        var background = $("#bg img");
        var charater = $("#char");
        var step = 50 ; 
        var backgroundContainerPos = {      x1:backgroundContainer.position().left,
                                            y1:backgroundContainer.position().top,
                                            x2:backgroundContainer.position().left + backgroundContainer.width(),
                                            y2:backgroundContainer.position().top + backgroundContainer.height()
                                       };
        
        $(window).on('resize',resizewindow); 
        
        function resizewindow(){
           backgroundContainerPos = {      x1:backgroundContainer.position().left,
                                            y1:backgroundContainer.position().top,
                                            x2:backgroundContainer.position().left + backgroundContainer.width(),
                                            y2:backgroundContainer.position().top + backgroundContainer.height() 
                                     };
            
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
            console.log(objPos);
            
            console.log(backgroundContainerPos);
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
            
            var random = Math.floor(Math.random() * 3);
            if (random == 0){ point = 50; }
            if (random == 1){ point = 100; }
            if (random == 2){ point = 150; }
            var speed = Math.ceil(Math.random() * 4);
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
                 cookie.handle = setInterval( function(){cookieMotion(cookie)},20);
                 
             });
            
            cookies.push(cookie);
            
        }
        
        function cookieMotion(obj){
           var objElement = $("#"+obj.cookieId);
           var objPos ={    
                        x1:objElement.position().left,
                        y1:objElement.position().top,
                        x2:objElement.position().left + objElement.width(),
                        y2:objElement.position().top + objElement.height()
                      };
           var topbound = Math.floor(Math.random() * (cookieContainer.height()/5) );
            
            if(objPos.y1 < cookieContainer.height()){
                if( collision(objElement,collisionbox) ){
                    
                    obj.speed = -obj.speed
                    objElement.css('top', charater.position().top ) ;
                }
                if (( objPos.y1 < topbound ) && (obj.speed < 0)){
                    obj.speed = -obj.speed
                }
                var y = objElement.position().top + obj.speed; 
                objElement.css('top',y)
            }else{
                $("#"+obj.cookieId).remove();
                cookies = jQuery.grep(cookies, function(value) {
                  return value.cookieId !== obj.cookieId;
                });
                clearInterval(obj.handle);
            }
        }
        
        
        function background_motion() {
            var backgroundPos ={    x1:background.position().left,
                                    y1:background.position().top,
                                    x2:background.position().left + background.width(),
                                    y2:background.position().top + background.height()
                               };
            if(backgroundPos.x2>backgroundContainerPos.x2){
                var x = background.position().left - 1; 
                background.css('left',x)
            }else{
                background.css('left',0)
            }
        }
        
        var creatCookieHandle = null ;
        var backgroundMotionHandle = null ;
        $scope.stage = 1; 
        $scope.gamestart = function(){
            
            $scope.stage = 2 ;
            
            createCookie(); 
            
            creatCookieHandle =  setInterval(createCookie,4000);
      
            backgroundMotionHandle =  setInterval(background_motion,20);
            
        }
        $scope.clickPanel = function(e){
            mouseClickPosX = e.pageX;
            var charaterCenter = charater.position().left + (charater.width()/2) ;
            
           
            if (mouseClickPosX <= charaterCenter){
                
                moveleft() ;
            }
            else{
                moveright() ;
            }
            
        }
        function moveleft(){
            
            
            if(detectbound(charater,"left") ){
               console.log("move left");
                var x = charater.position().left ; 
                charater.css('left', x-step);
                $("#char img").attr("src","images/charater_left.gif");
            }
        }
        
        function moveright(){
            
             if(detectbound(charater,"right") ){
                 console.log("move right");
                var x = charater.position().left ; 
                charater.css('left', x+step);
                $("#char img").attr("src","images/charater_right.gif");
             }
        }
         function stopgame(){
             var totalPoint = 0 ; 
             clearInterval(creatCookieHandle);
             
             clearInterval(backgroundMotionHandle);
             clearInterval(clockHandle);
             $.each(cookies, function(id, obj){
                 totalPoint =  totalPoint + obj.point ;
                 console.log(totalPoint);
                 clearInterval(obj.handle);
                 cookieContainer.empty();
             });
             console.log(cookies);
         }
         function clockmotion() {
             var timecounter = Math.floor((new Date - start) / 1000) ;
             if(timecounter>=30){
                 stopgame();
             }
         }
         
            var start = new Date;
            var clockHandle = setInterval(clockmotion, 1000);
        
    }]);
    
})();    



$(function() {
    
    function clickPanel (e){
            mouseClickPosX = e.pageX;
            var charaterCenter = charater.position().left + (charater.width()/2) ;
            
           
            if (mouseClickPosX <= charaterCenter){
                
                moveleft() ;
            }
            else{
                moveright() ;
            }
            
        }
    
});
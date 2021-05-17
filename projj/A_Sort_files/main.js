

window.onload = function() {

    //pourra être inliné...
    window.isIpad = navigator.userAgent.match(/iPad/i) != null;

    
    //pour prototypage nico

   

    // window.audioAPI.addSound("test",document.getElementById("sound-test"));
    // console.log(window.audioAPI)    

   

    //DynamicText.replaceDom($('#intro h1')[0]);

    if (Modernizr.requestanimationframe) { 
            if( typeof  AudioAPI !== "undefined" ){
        // window.audioAPI = new AudioAPI("src/audio/sound_test.mp3",[0,56,112,168,224,280,336,392,448,504,560,616,617]);
                 window.audioAPI = new AudioAPI("src/audio/sound_test.mp3",[{s:0,e:27},{s:30,e:55},{s:60,e:85},{s:88,e:114},{s:117,e:143},{s:149,e:170},{s:175,e:201},{s:204,e:230},{s:234,e:258},{s:262,e:289},{s:290}]);
            
                // $(window).focus(function() {
                //   //  window.audioAPI.muted = true;
                //     window.audioAPI.mute();
                // });

                // $(window).blur(function() {
                //   //  window.audioAPI.muted = false;
                //     window.audioAPI.mute();

                    
                // });

                // Set the name of the hidden property and the change event for visibility
                var hidden, visibilityChange; 
                if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
                  hidden = "hidden";
                  visibilityChange = "visibilitychange";
                } else if (typeof document.mozHidden !== "undefined") {
                  hidden = "mozHidden";
                  visibilityChange = "mozvisibilitychange";
                } else if (typeof document.msHidden !== "undefined") {
                  hidden = "msHidden";
                  visibilityChange = "msvisibilitychange";
                } else if (typeof document.webkitHidden !== "undefined") {
                  hidden = "webkitHidden";
                  visibilityChange = "webkitvisibilitychange";
                }

                

                function handleVisibilityChange() {

                  if (document[hidden]) {
                     //window.audioAPI.muted = false;
                     window.audioAPI.mute();
                  } else {
                     window.audioAPI.muted = true;
                     window.audioAPI.mute();
                  }
                }

                document.addEventListener("visibilitychange", handleVisibilityChange, false);
                 
            }

            Nav.appearText();

            setTimeout(beginExperience,3000);
    }
    else{
        $('body').addClass('old');
    }


};

function beginExperience(){

    var sl = new ShaderLoader();
    sl.loadShaders(
    {
        blend_fs: "blend_fs",
        blend_vs: "blend_vs",
        bitmap_fs: "bitmap_fs",
        bitmap_vs: "bitmap_vs",
        transition_fs: "transition_fs"
    }, "src/3d/glsl/", onShadersLoaded );

    

    
    Nav.setListeners();
}

function onShadersLoaded(){
    window.audioAPI.play();
  //  console.log("ISIPAD"+window.isIpad)
    if(!window.isIpad)launch();
    else{
        $('body').addClass('isIpad');
        $('#loading').fadeOut(1000);
        setTimeout(function(){
            $('#ipadButton').fadeIn(1000);
        },1000);
    }
}

function launch()
{

    var debug = false;

    setTimeout(function(){ Nav.close('intro')},1000);

    var w = window.innerWidth,
        h = window.innerHeight;

    //if( typeof AudioAPI !== "undefined" )window.audioAPI.mute();

    function onTransitionOver( id ){

        if( debug ){
            console.log( 'Alfred.transition is over, current scene ID is:', id );
            console.log( 'call UI.setScene(', id, ')' );
        }

        UI.setScene( id );
    }

    function onGoalReached(){

        if( debug )console.log( 'UI cursor reached goal, call Alfred.nextScene( duration, callback )' );
        Alfred.nextScene( 2, onTransitionOver );
    }

    var id = SCENE;
    Alfred.init( id, w, h, function()
    {
        if( debug )console.log( "first scene ready" );

        // w, h et methode à appeler quand on atteint le but
        UI.init( w,h, onGoalReached );
        UI.setScene( id );

        update();

    } );

    function update()
    {
        requestAnimationFrame( update );
        Alfred.setSceneTime( UI.ratio );
        Alfred.update();
    }


    //handlers

    window.addEventListener( "resize",  function()
    {
        var w = window.innerWidth,
            h = window.innerHeight;

        Alfred.resize(w,h);
        UI.resize(w,h);
        Nav.resize(w,h);
    }, false );

    window.addEventListener( "mousemove",
    function(ev)
    {
        Alfred.last.x = Alfred.mouse.x;
        Alfred.last.y = Alfred.mouse.y;

        Alfred.mouse.x += ( ( ev.clientX -  window.innerWidth / 2 ) / window.innerWidth    - Alfred.mouse.x ) * 0.1;
        Alfred.mouse.y += ( ( ev.clientY - window.innerHeight / 2 ) / window.innerHeight   - Alfred.mouse.y ) * 0.1;

        Alfred.screen.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
        Alfred.screen.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;
    }, false );

    window.ondevicemotion = function(event){
        Alfred.mouse.x = -event.accelerationIncludingGravity.y/10;
        Alfred.mouse.y = event.accelerationIncludingGravity.x/10;
        //var accelerationZ = event.accelerationIncludingGravity.z;
         
    }


    function touchHandler(event)
    {
        var touches = event.changedTouches,
            first = touches[0],
            type = "";
        switch(event.type)
        {
            case "touchstart": type = "mousemove"; break;
            case "touchmove":  type = "mousemove"; break;        
            case "touchend":   type = "mouseup";   break;
            default:           return;
        }
        console.log("TOUCH - "+event);
        // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
        //                screenX, screenY, clientX, clientY, ctrlKey, 
        //                altKey, shiftKey, metaKey, button, relatedTarget);

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                      first.screenX, first.screenY, 
                                      first.clientX, first.clientY, false, 
                                      false, false, false, 0/*left*/, null);

        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }
       // document.addEventListener("touchstart", touchHandler, true);


        //facebook

          window.fbAsyncInit = function() {
            FB.init({
              appId      : '204459056567109',
              xfbml      : true,
              version    : 'v2.5'
            });
          };

          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "//connect.facebook.net/en_US/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));


}

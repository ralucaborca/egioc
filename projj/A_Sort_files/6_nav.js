var Nav = function( exports ){ 


    var uiCredits = document.getElementById('ui-credits');
    var uiIntro = document.getElementById('ui-intro');
    var uiSound = document.getElementById('ui-sound');
    var introContent = document.getElementById('intro-content');
    var endContent = document.getElementById('end-content');
    var creditsContent = document.getElementById('credits-content');
    var errorContent = document.getElementById('error-content');
    var postcardContent = document.getElementById('postcard-content');
    var postcardContinueButton = document.getElementById('postcard-continue-button');
    var postcardThnksMessage = document.getElementById('thnks');
    var postcardErrorMessage = document.getElementById('postcard-error');
    var postcardInstructionMessage = document.getElementById('postcard-instructions');
    var postcardFbButton = document.getElementById('postcard-share-fb');
    var postcardTwButton = document.getElementById('postcard-share-tw');
    var ipadButton = document.getElementById('ipadButton');
    var creditsLeft = document.getElementById('credits-left');
    var creditsRight = document.getElementById('credits-right');
    var creditsBackButton = document.getElementById('credits-back-button');
    var endResetButton = document.getElementById('end-reset-button');

    var elements = [];

    elements['end'] = document.getElementById('end');
    elements['credits'] = document.getElementById('credits');
    elements['intro'] = document.getElementById('intro');
    elements['postcard'] = document.getElementById('postcard');
    elements['jumelles'] = document.getElementById('jumelles');
    elements['flash'] = document.getElementById('flash');
    elements['error'] = document.getElementById('error');

    var lettersIntro = [];

    var canShare = false;

    // lettersIntro[0] = $('#intro-content span:nth-child(1)');
    // lettersIntro[1] = $('#intro-content span:nth-child(2)');
    // lettersIntro[2] = $('#intro-content span:nth-child(3)');
    // lettersIntro[3] = $('#intro-content span:nth-child(4)');
    // lettersIntro[4] = $('#intro-content span:nth-child(5)');
    // lettersIntro[5] = $('#intro-content span:nth-child(6)');
    // lettersIntro[6] = $('#intro-content span:nth-child(7)');

    for(var i = 0; i <  $('#intro-content span').length; i ++){
        var i2 = i+1;
        lettersIntro[i] = $('#intro-content span:nth-child('+i2+')');
    }

    var lettersEnd = [];

    for(var i = 0; i < $('#end-content span').length; i ++){
        var i2 = i+1;

        lettersEnd[i] = $('#end-content span:nth-child('+i2+')');

    }

    exports.flash = function(t1,t2){
        if(!window.isIpad){
            if(!t1)t1 = 100;
            if(!t2)t2 = 3000;
             $(elements['flash']).fadeIn(t1);
             setTimeout(function(){$(elements['flash']).fadeOut(t2);},t1);
        }

    }

    exports.appearText = function(){
       // console.log(letters[0].text());
       window.audioAPI.playOnce('texte');

       TweenMax.to(lettersIntro[0], 2, {css: {top: 0, opacity:1}, delay: 0, ease:Elastic.easeOut});
       TweenMax.to(lettersIntro[2], 2, {css: {top: 0, opacity:1}, delay: 0.1, ease:Elastic.easeOut});
       TweenMax.to(lettersIntro[4], 2, {css: {top: 0, opacity:1}, delay: 0.2, ease:Elastic.easeOut});
       TweenMax.to(lettersIntro[6], 2, {css: {top: 0, opacity:1}, delay: 0.3, ease:Elastic.easeOut});

       TweenMax.to(lettersIntro[1], 2, {css: {top: 0, opacity:1}, delay: 0.4, ease:Elastic.easeOut});
       TweenMax.to(lettersIntro[3], 2, {css: {top: 0, opacity:1}, delay: 0.5, ease:Elastic.easeOut});
       TweenMax.to(lettersIntro[5], 2, {css: {top: 0, opacity:1}, delay: 0.6, ease:Elastic.easeOut});

       TweenMax.to($('#intro-content h2'), 8, {css: {opacity:1},delay:0, ease:Elastic.easeOut});
       TweenMax.to($('#intro-content #loading'), 8, {css: {opacity:1},delay:0, ease:Elastic.easeOut});
    }

    exports.appearTextEnd = function(){

        if(!window.isIpad){
           TweenMax.to(lettersEnd[0], 2, {css: {opacity:1}, delay: 0, ease:Elastic.easeOut});
           for(var i = 0; i < lettersEnd.length; i++){
                TweenMax.to(lettersEnd[i], 2, {css: {opacity:1}, delay:Math.random(3), ease:Elastic.easeOut});
           }
           TweenMax.to($('#end-content h1:nth-child(1)'), 4, {css: {opacity:1}, delay:1, ease:Elastic.easeOut});
           TweenMax.to($('#end-content h3'), 4, {css: {height:25, marginBottom:0},delay:2, ease:Elastic.easeOut});
           TweenMax.to($('#end-content ul li a img'), 4, {css: {opacity:1,transform:"scale(1)"},delay:2, ease:Elastic.easeOut});
           TweenMax.to($('#end-reset-button'), 4, {css: {opacity:1},delay:3, ease:Elastic.easeOut});
        }


    }

    function switchState(el){
        if(el.className.indexOf("open")>-1)close(el);
        else open(el);
    }

    exports.open = function(s,t){
        var el = elements[s];
         if(window.isIpad){
             $(el).css('display','block');
            exports.resize();
        }else{
            if(!t)t=600;
            
            $(el).fadeIn(t);
            exports.resize();
        }

    }

    exports.close = function(s){
        var el = elements[s];
         if(window.isIpad){
            $(el).css('display','none');
        }else{
            
            $(el).fadeOut(600);
            exports.resize();
        } 

    }

    exports.openPostcard = function(){
        var _this = this;
        window.audioAPI.playOnce('photo');
        setTimeout(function(){_this.flash();},400);

        setTimeout(function(){
             _this.open('postcard');
      
            setTimeout(function(){
                $(postcardContent).addClass("rotated");

                setTimeout(function(){
                    $('#postcard').addClass('rotated');
                },1000)

            },2000);
        },1000)
       
    }

    exports.displayErrorMessagePostcard = function(b){
        var _this = this;
        if(b){
            $(postcardErrorMessage).addClass('display');
            $(postcardInstructionMessage).removeClass('display');
        }
        else{
            $(postcardErrorMessage).removeClass('display');
            $(postcardInstructionMessage).addClass('display');
        }

    }

    exports.shareOnTw = function(){
        var _this = this;
        var text = $('#postcard-back-content textarea').val();
        if(text!=""){

            var url = "http://twitter.com/share?text=";
            url += $('#postcard-back-content textarea').val();
            url += "&url=http://ashortjourney.com/templates/card.html&hashtags=AShortJourney";
            //http://twitter.com/share?text=Cool cool cool lama cool&url=https://www.google.fr&hashtags=2016,cherami
            $(postcardTwButton).find('a').attr('href',url);

             $('#postcard-back-content h1').css('display','none');
                $('#postcard-back-content textarea').css('display','none');
                $('#postcard-back-content h2').removeClass('display');
                $('#postcard-back-content ul').css('display','none');
                $(postcardThnksMessage).addClass('display');
                $(postcardContinueButton).text('CONTINUE THE JOURNEY');

                setTimeout(function(){
                    if(!_this.flag){
                        _this.flag = true;
                        _this.close('postcard');
                        $(postcardContent).removeClass("rotated");
                        Alfred.flag = false;
                        Alfred.nextScene(1.5,UI.setScene);
                    }
                },3000);
        }
        else{
  
            exports.displayErrorMessagePostcard(true);
         }
    }

    exports.shareOnFacebook = function(){
        var _this = this;
         var text = $('#postcard-back-content textarea').val();
             if(text!=""){
                
                FB.ui({
              method: 'feed',
              link: 'http://ashortjourney.com',
              picture: 'http://ashortjourney.com/dist/img/0_POSTCARD_1200x900.jpg',
              caption: text,
            }, function(response){
                $(postcardContinueButton).click();
            });
                
                $('#postcard-back-content h1').css('display','none');
                $('#postcard-back-content textarea').css('display','none');
                $('#postcard-back-content h2').removeClass('display');
                $('#postcard-back-content ul').css('display','none');
                $(postcardThnksMessage).addClass('display');
                $(postcardContinueButton).text('CONTINUE THE JOURNEY');

                setTimeout(function(){
                    if(!_this.flag){
                        _this.flag = true;
                        _this.close('postcard');
                        $(postcardContent).removeClass("rotated");
                       
                        Alfred.flag = false;
                        Alfred.nextScene(1.5,UI.setScene);
                    }
                },3000);
         }
         else{
  
            exports.displayErrorMessagePostcard(true);
         }
        

    }

    exports.setListeners = function(){
        var _this = this;

        uiCredits.addEventListener('click',function(){_this.open('credits')});
        creditsBackButton.addEventListener('click',function(){_this.close('credits')});
        creditsLeft.addEventListener('click',function(){_this.close('credits')});
        creditsRight.addEventListener('click',function(){_this.close('credits')});
        uiIntro.addEventListener('click',function(){switchState('intro')});
        endResetButton.addEventListener('click',function(){
            document.location.reload();
        });


        postcardContinueButton.addEventListener('click',function(){
            
            $(postcardContent).removeClass("rotated");
             $(postcardContent).addClass("posted");
            setTimeout(function(){
                if(!_this.flag){
                _this.flag = true;
                _this.close('postcard');
                Alfred.flag = false;
                Alfred.nextScene(1.5,UI.setScene);
                }
            },2000);

        });

        postcardFbButton.addEventListener('click',function(){
            _this.shareOnFacebook();
        });

        postcardTwButton.addEventListener('click',function(){
            _this.shareOnTw();
        });

        ipadButton.addEventListener('click',function(){
            //window.audioAPI.audioSrc[0].play();
            window.audioAPI.audioSrc[1].play();
            launch();
        })

        uiSound.addEventListener('click',function(){

            window.audioAPI.mute(true);
            // window.audioAPI.manualMute = !window.audioAPI.manualMute;
            if(window.audioAPI.muted)$(uiSound).addClass('off')
            else $(uiSound).removeClass('off')
        })

        $('#postcard-content textarea').bind('input propertychange', function() {
            //console.log($('#postcard-back-content textarea').val());
            if($('#postcard-back-content textarea').val() != ""){
                _this.displayErrorMessagePostcard(false);
            }
         
        })

    }

    exports.resize = function(){

            $(endContent).css('marginTop',$(window).height()/2-$(endContent).height()/2);
            $(creditsContent).css('marginTop',$(window).height()/2-$(creditsContent).height()/2);
            //$(errorContent).css('marginTop',$(window).height()/2-$(errorContent).height()/2-300);
            $(postcardContent).css('marginTop',$(window).height()/2-$(postcardContent).height()/2);
            $(introContent).css('marginTop',$(window).height()/2-$(introContent).height()/2-100);
    };

    exports.resize();

    return exports;
}({});
var AudioAPI = function(f,pos){
	var _this = this;
    _this.muted = false;
	_this.audio1 = new Audio(f);
	_this.audio2 = new Audio(f);
	_this.audioSrc = [];
	_this.currentPos = [];

	_this.pos = pos;
	_this.currentPos[0] = _this.pos[0];
	_this.currentPos[1] = _this.pos[0];


	_this.audioSrc[0] = _this.audio1;
	_this.audioSrc[1] = _this.audio2;

	_this.fadeDuration = 1;

	_this.audioSrc[0].volume = 1;
	_this.audioSrc[1].volume = 0;

	_this.sounds = [];

	_this.sounds['crayons'] = new Audio("src/audio/crayons.mp3");
	_this.sounds['popup'] = new Audio("src/audio/popup.mp3");
	_this.sounds['moteur'] = new Audio("src/audio/moteur.mp3");
	_this.sounds['photo'] = new Audio("src/audio/photo.mp3");
	_this.sounds['zip'] = new Audio("src/audio/zip.mp3");
	_this.sounds['ballon'] = new Audio("src/audio/ballon.mp3");
	_this.sounds['avion'] = new Audio("src/audio/avion.mp3");
	_this.sounds['bateau'] = new Audio("src/audio/bateau.mp3");
	_this.sounds['plage'] = new Audio("src/audio/plage.mp3");
	_this.sounds['parasol'] = new Audio("src/audio/parasol.mp3");
	_this.sounds['lumiere'] = new Audio("src/audio/lumiere.mp3");
	_this.sounds['texte'] = new Audio("src/audio/texte.mp3");
	this.vol = 0;
	this.vol0 = 0;
	this.vol1 = 0;

	_this.manualMuted;
};

AudioAPI.prototype.play = function() {
	var _this = this;
    if( _this.muted )return;

	_this.audioSrc[0].play();
	_this.audioSrc[1].play();
	_this.isActive = true;

	_this.checkLoop();
}

// AudioAPI.prototype.playOnce = function(p,options){
// 	var _this = this;

// 	_this.audioSrc[1].currentPos = p;
// 	_this.audioSrc[1].volume = 1;
// 	_this.playOnceFlag = true;
// };

AudioAPI.prototype.muteSwitch = function(){
	var _this = this;
    if( _this.muted )return;

	if(!_this.isMute){
		for(s in sounds){
			s.volume = 0;
		}
	}


	
	_this.isMute = !_this.isMute;
}

AudioAPI.prototype.playOnce = function(s){
	var _this = this;
    if( _this.muted )return;

    if(!_this.isMute)_this.sounds[s].volume = 0.7;
	_this.sounds[s].play();
}

AudioAPI.prototype.playLoop = function(s){
	var _this = this;
    if( _this.muted )return;

    _this.sounds[s].loop = true;
	_this.sounds[s].play();
}

AudioAPI.prototype.isPlaying = function(s){
	var _this = this;
	return !_this.sounds[s].paused;
}

AudioAPI.prototype.stopAll = function(){
	var _this = this;
   
   for(sound in _this.sounds){
   	if(_this.sounds[sound]){
	   	_this.sounds[sound].pause();
	   	_this.sounds[sound].currentTime = 0;
	}
   }
   	
}

// AudioAPI.prototype.stop = function(s){
// 	_this.sounds[s].pause();
// 	_this.sounds[s].currentTime = 0;
// }



AudioAPI.prototype.setVolume = function(s,v){
	var _this = this;
    if( _this.muted )return;

    if(v<=1 && v>=0 && !_this.isMute)_this.sounds[s].volume = v;
}

AudioAPI.prototype.stopLoop = function(s){
	var _this = this;
    if( _this.muted )return;

    _this.sounds[s].loop = false;
	_this.sounds[s].pause();
	_this.sounds[s].currentTime = 0;
}

AudioAPI.prototype.goTo = function(p,options){
	var _this = this;
    _this.audioSrc[1].currentTime = _this.pos[p].s;
	_this.currentPos[1] = _this.pos[p];

	if(!window.isIpad)_this.crossFade();
};

AudioAPI.prototype.crossFade = function(){
	var _this = this;

	if(!_this.muted){
		TweenMax.to( _this.audioSrc[0], _this.fadeDuration,{volume:0,
	 		onUpdate:function(){
	 			_this.audioSrc[1].volume = 1 - _this.audioSrc[0].volume;
	 		},
            onComplete:function(){
                var _oldAudioSrc = _this.audioSrc[0];
                _this.currentPos[0] = _this.currentPos[1];
                _this.audioSrc[0] = _this.audioSrc[1];
                _this.audioSrc[1] = _oldAudioSrc;
	            }
	    });
	}
	else{

	   var _oldAudioSrc = _this.audioSrc[0];
	    _this.currentPos[0] = _this.currentPos[1];
	    _this.audioSrc[0] = _this.audioSrc[1];
	    _this.audioSrc[1] = _oldAudioSrc;

	    _this.vol0 = 0;
	    _this.vol1 = 1;

		var _oldVol = _this.vol0;
		_this.vol0 = _this.vol1;
		_this.vol1 = _oldVol;
	}


                
}

AudioAPI.prototype.checkLoop = function(){
	var _this = this;
    //if( _this.muted )return;
    //console.log(_this.audioSrc[0].currentTime + "-" +_this.currentPos[0].e);
    if(_this.audioSrc[0].currentTime >= _this.currentPos[0].e && _this.currentPos[0].e){
	
		_this.audioSrc[0].currentTime = _this.currentPos[0].s;
	}

	if(_this.audioSrc[1].currentTime >= _this.currentPos[1].e && _this.currentPos[0].e){

		_this.audioSrc[1].currentTime = _this.currentPos[1].s;
	}

	if(_this.isActive)setTimeout(function(){
		_this.checkLoop();
	},10);
}

//parce que c'est un peu pénible à la fin :)
AudioAPI.prototype.mute = function(manual){
	var _this = this;  
	console.log('manual -> ' + manual + 'manualMuted -> ' + _this.manualMuted + 'muted -> ' + _this.muted);
	if(_this.muted){
		this.vol = 1;
		if(_this.manualMuted){
			if(manual){
				_this.manualMuted = false;
			}
			else{
				return
			}
		}
		else{

		}
	}
	else{
		if(manual){
			_this.manualMuted = true;
		}
		this.vol = 0;
	}

    if(_this.muted){
    	_this.muted = false;
    	_this.audioSrc[0].volume = this.vol0;
    	_this.audioSrc[1].volume = this.vol1;
    }
    else{
    	_this.muted = true;
    	this.vol0 = _this.audioSrc[0].volume;
    	this.vol1 = _this.audioSrc[1].volume;
    	_this.audioSrc[0].volume = 0;
    	_this.audioSrc[1].volume = 0;
    }
    
    

    _this.sounds['crayons'].volume = this.vol;
	_this.sounds['popup'].volume = this.vol;
	_this.sounds['moteur'].volume = this.vol;
	_this.sounds['photo'].volume = this.vol;
	_this.sounds['zip'].volume = this.vol;
	_this.sounds['ballon'].volume = this.vol;
	_this.sounds['avion'].volume = this.vol;
	_this.sounds['bateau'].volume = this.vol;
	_this.sounds['plage'].volume = this.vol;
	_this.sounds['parasol'].volume = this.vol;
	_this.sounds['lumiere'].volume = this.vol;
	_this.sounds['texte'].volume = this.vol;
};
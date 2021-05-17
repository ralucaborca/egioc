
var S6_beach = function(){

    var ball;
    function beach()
    {
        Scene.call( this );

        // X Y Z > x z -y
        // y = 137.294
        var o = this.origin = new THREE.Vector3( 0, -109.294, 0);
        this.dest = new THREE.Vector3( 0, -137.294, 0);
        this.camera.position.set(o.x, o.z, -o.y );

        this.target = new THREE.Vector3( 0, 0, 0 );
        this.camera.lookAt( this.target );

        this.camera.fov = 30;
        this.updateAspectRatio();

        this.rc = new THREE.Raycaster();

        var scope = this;
        textures.loadTexture( "src/3d/textures/5_beach/ball.jpg", function(t){

            var mat = materials.bitmap.clone();
            mat.uniforms.texture.value = t;
            ball = new THREE.Mesh( new THREE.SphereBufferGeometry(2,32,16), mat );
            ball.position.x = -15;
            ball.position.y =  6;
            ball.position.z = 2;
            scope.add(ball)
        })


    }
    function init(cb) {


        var scope = this;
        this.beach = new Beach( this.group, function(beach){


             var coords = {
                 cam : { p:new THREE.Vector3(    1, 14, 0 ), r:new THREE.Vector3( 0, 90 * RAD, 90 * RAD ), s:2.25 },
                 jum : { p:new THREE.Vector3( -3.895999999999998, -6.576999999999999, 1 ), r:new THREE.Vector3( 0, 68 * RAD, 90 * RAD ), s:1.95 },
                 bag : { p:new THREE.Vector3( 14.976, -6.685, 1 ), r:new THREE.Vector3( 90*RAD, -15*RAD, 0 ), s:1.95 }
             };

            scope.cam = new Camera( scope.group, function(cam){

                scope.group.remove( cam );
                var g = new THREE.Group();
                cam.rotateZ(-0.3551581987946001);
                g.add(cam);
                scope.group.add( g );
                cam.position.copy( coords.cam.p );
                cam.rotateX( coords.cam.r.x );
                cam.rotateY( coords.cam.r.y );
                cam.rotateZ( coords.cam.r.z );
                cam.scale.multiplyScalar( coords.cam.s );

      
                    textures.loadTexture( "src/3d/textures/5_beach/ombre_ballon.png", function( t ){

                        ballShadowMat = materials.blend.clone();
                        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
                        ballShadowMat.uniforms.texture.value = t;
                        var geom = getPlaneBufferGeometry(0,0,1,1);
                        ballShadow = new THREE.Mesh( geom,ballShadowMat );
                        ballShadow.position.z = 1;

                        ballShadow.rotateX(0);

                        ballShadow.scale.set( 3, 3, 1. );

                        scope.group.add( ballShadow );
                      

                        if( cb )cb();

                    });
                    
                    textures.loadTexture( "src/3d/textures/5_beach/parasol.png", function( t ){

                        blendMat = materials.blend.clone();
                        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
                        blendMat.uniforms.texture.value = t;
                       

                        var frames = 5;
                        blendMat.uniforms.frameCount.value = frames;

                        var geom = getPlaneBufferGeometry(0,0,1/frames,1);
                        blendPlane = new THREE.Mesh( geom,blendMat );

                        blendPlane.position.x = -11;
                        blendPlane.position.y = -10;
                        blendPlane.position.z = 10;

                        blendPlane.rotateX(0);

                        blendPlane.scale.set( 15, 18, 1. );

                        scope.group.add( blendPlane );
                        scope.loaded = true;

                        if( cb )cb();

                    });
                    
                    textures.loadTexture( "src/3d/textures/5_beach/parasol_shadow.png", function( t ){

                         parasolShadowMat = materials.blend.clone();
                         t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
                         parasolShadowMat.uniforms.texture.value = t;
                       

                        var frames = 5;
                        parasolShadowMat.uniforms.frameCount.value = frames;

                        var geom = getPlaneBufferGeometry(0,0,1/frames,1);
                         parasolShadow = new THREE.Mesh( geom, parasolShadowMat );

                         parasolShadow.position.x = -13;
                         parasolShadow.position.y = -8;
                         parasolShadow.position.z = 1;

                         parasolShadow.rotateX(0);

                         parasolShadow.scale.set( 15, 18, 1. );

                        scope.group.add(  parasolShadow );
                        scope.loaded = true;

                        if( cb )cb();

                    });


                    scope.bag = new Bag( scope.group, function(bag){

                        bag.position.copy( coords.bag.p );
                        bag.rotateX( coords.bag.r.x );
                        bag.rotateY( coords.bag.r.y );
                        bag.rotateZ( coords.bag.r.z );
                        bag.scale.multiplyScalar( coords.bag.s );
                        scope.loaded = true;
                        if( cb )cb();
                    });

                // });
            });
        });
    };

    var tweenBag = false;
    function update( mouse )
    {

        if( !this.loaded )return;

        var d = new THREE.Vector3(
            lerp( this.time, this.origin.x, this.dest.x ),
            lerp( this.time, this.origin.y, this.dest.y ),
            lerp( this.time, this.origin.z, this.dest.z )
        );
   


        if(!window.audioAPI.isPlaying('parasol') && !this.flag && UI.ratio != 0 && UI.ratio != 1){
            window.audioAPI.playOnce('parasol');
            this.flag = true;
        }
        if(!UI.isDragging)this.flag = false;

        this.camera.position.set( d.x, d.z, -d.y );

        this.camera.position.x += ( ( this.origin.x + mouse.x * 25 ) - this.camera.position.x ) * 0.1;
        this.camera.position.y += ( ( this.origin.z - mouse.y * 25 ) - this.camera.position.y ) * 0.1;



        var coords = {
            x : Alfred.screen.x,
            y : Alfred.screen.y
        };

        this.rc.setFromCamera( coords, this.camera );
        var intersect = this.rc.intersectObject( ball, false )[0];
        if(intersect){
            kick();
        }

        intersect = this.rc.intersectObject( this.bag, true )[0];
        if(intersect){
            window.audioAPI.playOnce('zip');
            if( !tweenBag ){
                tweenBag = true;
                var t = this.bag.bag_top.material.uniforms.transition.value == 1 ? 0 : 1;
                TweenMax.to( this.bag.bag_top.material.uniforms.transition, 1, {value:t, onComplete:function(){tweenBag = false;}});
            }
        }

        var ratioStep = UI.ratio;
        var step = 1/5;
        if(ratioStep < step)ratioStep = 0;
        if(ratioStep > step && ratioStep < step *2)ratioStep = step;
        if(ratioStep > step *2 && ratioStep < step *3)ratioStep = step*2;
        if(ratioStep > step *3 && ratioStep < step *4)ratioStep = step*3;
        if(ratioStep > step *3 && ratioStep < step *4)ratioStep = step*4;
        if(ratioStep > step *4)ratioStep = step*5;

        blendMat.uniforms.transition.value = ratioStep;
        parasolShadowMat.uniforms.transition.value = ratioStep;

        ballShadow.position.set(ball.position.x-1,ball.position.y+1,ballShadow.position.z);
        var sizeRatio = ball.position.z*0.2;
        //if(sizeRatio > 4) sizeRatio = 4;
        ballShadow.scale.x = 3 + 1 * (sizeRatio);
        ballShadow.scale.y = 3 + 1 * (sizeRatio);
        
      //  console.log(ball.position.z);

        return true;

    }
    var tweening = false;
    function kick()
    {
        if( tweening )return;
        tweening = true;

        var p = ball.position.clone();

        var d = getDistance( Alfred.mouse, Alfred.last );
        var a = getAngle( Alfred.mouse, Alfred.last );

        var dx = Math.cos( a )  * 5;
        var dy = -Math.sin( a ) * 5;

        window.audioAPI.playOnce('ballon');

        TweenMax.to( ball.rotation, .95 + Math.random() *.1,{
            x:Math.random() * PI2,
            y:Math.random() * PI2,
            z:Math.random() * PI2
        } );
        TweenMax.to( ball.position,.15 + Math.random() *.1,{
            x: p.x + dx,
            y: p.y + dy,
            z: Math.abs( dx + dy ) * 2,
            onUpdate : function(){
       
            },
            onComplete : function()
            {
                TweenMax.to( ball.position, .45  + Math.random() *.1 ,{ x: ball.position.x + dx, y: ball.position.y + dy });
                TweenMax.to( ball.position, .75  + Math.random() *.1 ,{ z: p.z, ease:Bounce.easeOut, onComplete : function(){ tweening = false; } });
            }
        } );

    }

    var _p = beach.prototype = Object.create( Scene.prototype );
    _p.constructor = beach;

    _p.init = init;
    _p.update = update;

    return beach;

}();

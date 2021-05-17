
var S7_room = function(){

    function room()
    {
        
        Scene.call( this );

        // X Y Z > x z -y
        var o = this.origin = new THREE.Vector3( 10.5, -0.827, 3);
        this.camera.position.set(o.x, o.z, -o.y );
        this.target = new THREE.Vector3( 0, 2, 0 );

        this.camera.fov = 40;
        this.updateAspectRatio();

    }

    function init( cb ) {

        var scope = this;
        this.clock = new Clock( this );

        this.room = new Room(this.group, function( obj ) {

             textures.loadTexture( "src/3d/textures/6_room/clock.png", function( t ){

                        ballShadowMat = materials.blend.clone();
                        //ballShadowMat.uniforms.texture.value = t;
                         ballShadowMat.transparent = true;
                        // ballShadowMat.uniforms.alpha.value = 0.9;
                        t.minFilter = THREE.LinearFilter;
                         t.magFilter = THREE.LinearFilter;
                    
                        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;

                        ballShadowMat.uniforms.texture.value = t;
                        var geom = getPlaneBufferGeometry(0,0,1,1);
                        ballShadow = new THREE.Mesh( geom,ballShadowMat );
                        ballShadow.position.x = -1.9;
                        ballShadow.position.y = 4.15;
                        ballShadow.position.z = 2.87;
                        ballShadow.renderOrder = 1;
                        ballShadow.rotateY(Math.PI/2);

                        ballShadow.scale.set( 1, 0.5, 1. );
                        //ballShadow.position.set( 1, 3, 1. );

                        scope.group.add( ballShadow );
                      

                        if( cb )cb();

                    });


            scope.loaded = true;
            if( cb )cb();
        });

  

    }


    function update( mouse )
    {
        if( !this.loaded )return;

        this.camera.position.z += ( ( this.origin.x - mouse.x * 2.5 ) - this.camera.position.x ) * 0.01;
        this.camera.position.y += ( ( this.origin.z - mouse.y * 2.5 ) - this.camera.position.y ) * 0.01;
        if(this.camera.position.z < -3)this.camera.position.z = -3;
        if(this.camera.position.z > 2.5)this.camera.position.z = 2.5;
        this.camera.lookAt( this.target );
      
        this.room.body.material.uniforms.transition.value = UI.ratio;
        this.room.handle.material.uniforms.transition.value = UI.ratio;
        this.room.room.material.uniforms.transition.value = UI.ratio;
        this.clock.update( UI.ratio );

        if(!window.audioAPI.isPlaying('lumiere') && !this.flag && UI.ratio != 0 && UI.ratio != 1){
            window.audioAPI.playOnce('lumiere');
            this.flag = true;
        }
        if(!UI.isDragging)this.flag = false;



        return true;

    }


    var _p = room.prototype = Object.create( Scene.prototype );
    _p.constructor = room;

    _p.init = init;
    _p.update = update;

    return room;

}();


var S1_desk = function()
{


    var blendPlane, blendMat;
    function desk() {

        Scene.call(this);
        var o = this.origin = new THREE.Vector3(-28.954, -109.13, 50.952);
        this.camera.position.set(o.x, o.z, -o.y);
        this.target = new THREE.Vector3(-5, 0, -25);

    }
    function init( cb )
    {
        
        var scope = this;
        this.desk = new Desk(this.group, function(desk)
        {

            //position de l'écran
            desk.topOrigin = new THREE.Vector3( -6.243, 2.121, -12.984 );

            scope.pot = new Pot( scope.group, function(pot){

                pot.relocate();

                textures.loadTexture( "src/3d/textures/1_desk/shadows.png", function( t ){

                    blendMat = materials.blend.clone();
                    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
                    blendMat.uniforms.texture.value = t;

                    var frames = 5;
                    blendMat.uniforms.frameCount.value = frames;

                    var geom = getPlaneBufferGeometry(0,0,1/frames,1);
                    blendPlane = new THREE.Mesh( geom,blendMat );

                    blendPlane.position.x = -13.34;
                    blendPlane.position.y = 0.01;
                    blendPlane.position.z = -5.0;

                    blendPlane.rotateX( -PI / 2 );

                    blendPlane.scale.set( 48.849, 53.456, 1. );

                    scope.group.add( blendPlane );
                    scope.loaded = true;

                    window.audioAPI.playLoop('popup');

                    if( cb )cb();

                });

            });
        });

    }


    function update( mouse )
    {
        if( !this.loaded )return;

        if( mouse )
        {

            this.group.rotation.x = ( -(mouse.y+0.5) * RAD * 5 );
            this.group.rotation.y += ( ( mouse.x * RAD * 30 ) - this.group.rotation.y ) * 0.025;
            if(this.group.rotation.x < -0.025)this.group.rotation.x = -0.025;
            if(this.group.rotation.y > 0.04)this.group.rotation.y = 0.04;
            var t = Date.now() *0.001;
            this.group.rotation.x -= Math.cos( t * 0.25 ) * 0.005;
            this.group.rotation.y += Math.sin( t * 0.5 ) * 0.001;

            this.pot.animate(mouse, this.camera, this.desk.pot_shadow );

        }

        //this.time = Math.sin( Date.now() * 0.001 ) * 0.5 + 0.5;

        //animate
        this.desk.animate( this.time );

        window.audioAPI.setVolume('popup',1- this.time);

        //shadow update
        blendMat.uniforms.transition.value = this.desk.openingRatio;

        this.camera.lookAt( this.target );
        return true;

    }
    var _p = desk.prototype = Object.create( Scene.prototype );
    _p.constructor = desk;
    _p.init = init;
    _p.update = update;
    return desk;

}();

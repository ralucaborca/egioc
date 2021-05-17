
var S2_bag = function(){

    var blendPlane, blendMat;
    function bag()
    {
        Scene.call( this );

        // X Y Z > x z -y
        var o = new THREE.Vector3( 6.894, -1.178, 17,498 );
        this.camera.position.set(o.x, o.z, -o.y );

        this.camera.fov = 25;
        this.updateAspectRatio();


    }

    function init( cb )
    {
        
        var scope = this;
        new Room0( this.group, function(room){

            new Jumelles( scope.group, function(jum){

                new Camera( scope.group, function(cam){

                    scope.bag = new Bag( scope.group, function(bag){

                        blendMat = bag.bag_top.material;
                        scope.loaded = true;
                        if( cb )cb();

                    });
                });
            });
        });
    }

    //do something with mouse
    function update( mouse )
    {
        if( !this.loaded )return;

        this.camera.lookAt( this.group.position );

        blendMat.uniforms.transition.value = UI.ratio;

        if(!window.audioAPI.isPlaying('zip') && !this.flag && UI.ratio != 0 && UI.ratio != 1){
            window.audioAPI.playOnce('zip');
            this.flag = true;
        }
        if(!UI.isDragging)this.flag = false;

        if( mouse ){

            this.group.rotation.x = ( ( mouse.x  * 3 ) - this.group.rotation.x ) * 0.25;
            this.group.rotation.y = ( ( mouse.y  * 6 ) - this.group.rotation.y ) * 0.025;
        }
        return true;

    }
    var _p = bag.prototype = Object.create( Scene.prototype );
    _p.constructor = bag;

    _p.init = init;
    _p.update = update;

    return bag;

}();

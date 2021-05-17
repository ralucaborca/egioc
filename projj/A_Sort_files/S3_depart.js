
var S3_depart = function(){

    var sprites = [];


    function depart(){

        Scene.call( this );
        var o = this.origin = new THREE.Vector3( 0, -139.052, 14.605);
        this.camera.position.set(o.x, o.z, -o.y );
    }

    var texture, material, bg;
    function init(cb){

        this.loaded = true;
        this.camera.fov = 22;
        this.updateAspectRatio();

        var scope = this;
        scope.car = new Car( scope.group, function(obj){

            obj.relocate();
            obj.initHeadlights();
            scope.road = new Road( scope.group, function(road){
                 scope.road.renderOrder = 1;
                scope.background = new CarBackground( scope.group, function( bg ){

                    scope.loaded = true;
                    if(cb)cb();
                });
            });
        });
       
    }

    function flip() {

        if( !this.loaded )
        {
            //console.log( 'not loaded yet', this );
            setTimeout( this.flip.bind( this ), 100 );
            return;
        }

        this.scale.x *= -1;

        //direction retour
        this.car.flip( this.scale.x );
        this.road.flip(this.scale.x);

        //flippage
        this.background.scale.x = this.scale.x;
        this.background.flip( this.scale.x );

    }

    function update( mouse ) {


        if( !this.loaded )return;
        if( mouse == null )return;

        var time = this.time;
        if( this.isFlipped() )
        {
            time = 1 - time;
        }

        window.audioAPI.setVolume('moteur',0.5 + time);

        // this.camera.position.x += ( ( this.origin.x - ( time - 0.5 ) * 20 ) - this.camera.position.x ) * 0.1;
        // this.camera.position.y += ( ( this.origin.z - mouse.y * 6 ) - this.camera.position.y ) * 0.1;

        this.camera.position.x += ( ( this.origin.x - mouse.x * 6 ) - this.camera.position.x ) * 0.1;
        this.camera.position.y += ( ( this.origin.z - mouse.y * 6 ) - this.camera.position.y ) * 0.1;


        // bg.position.x = this.camera.position.x * 35 * this.scale.x;
        // bg.position.y = 90+mouse.y * 15;
        this.car.animate(time, this.isFlipped() );

        //road
        var speed =  Math.max( 0.015, ( time ) * 0.15 );
        this.road.update( speed );

        //background
        //this.camera.position.y += ( ( this.origin.z - mouse.y * 6 ) - this.camera.position.y ) * 0.1;
        this.background.update( time );

        return true;

    }


    var _p = depart.prototype = Object.create( Scene.prototype );
    _p.constructor = depart;

    _p.update = update;
    _p.init = init;
    _p.flip = flip;

    return depart;

}();

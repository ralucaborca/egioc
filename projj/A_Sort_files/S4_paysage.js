
var S4_paysage = function(){


    function paysage()
    {
        Scene.call( this );

        // X Y Z > x z -y
        var o = this.origin = new THREE.Vector3( 0, 25, 105 );
        this.dest = new THREE.Vector3( 0, 25, 80 );
        this.camera.position.set(o.x, o.y, o.z );

        this.target = new THREE.Vector3( 0, 25, 0 );

        this.camera.fov = 30;
        this.updateAspectRatio();

        this.animation = new AnimationPerso();
        this.animation.scale.multiplyScalar( .1 );
        this.animation.position.x = 8.5;
        this.animation.position.y = 11.7;
        this.animation.position.z = -13;
        this.add( this.animation );

        //silent render to upload meshes & textures to GPU
        stage3d.render( this, this.camera, Scene.rtt );


    }

    function init(cb)
    {

        var scope = this;

        scope.car = new Car(scope.group, function (car) {

            car.position.set(-3.5, 0, -23);
            car.rotation.set(0, 1.13, 0);

            scope.decor = new Landscape(scope.group, function (bg) {

                //les éléments du background
                scope.background = new LandscapeBackground( scope.group, function( bg )
                {
                    scope.loaded = true;
                    if (cb)cb();
                });
            });
        });

    }

    function flip( scope )
    {
        if( !this.loaded )
        {
            //console.log( 'not loaded yet', this );
            setTimeout( this.flip.bind( this ), 100 );
            return;
        }

        this.scale.x *= -1;

        //le flippage
        this.background.scale.x = this.scale.x;
        this.background.flip( this.scale.x );

        //this.group.remove(this.sky);
        //this.group.remove(this.sun);
        //this.group.remove(this.sea);
        //this.group.remove(this.mountain1);
        //this.group.remove(this.mountain2);
        //this.group.remove(this.clouds);

        //console.log( this );
        //console.log( "-------");


        this.decor.scale.x = this.scale.x;
        this.decor.flip( this.scale.x );

        this.car.flip( this.scale.x );

        this.animation.flip( this.scale.x );
        if( this.scale.x == -1 )
        {
            this.animation.position.x = -4.2;
            this.animation.position.y = 11.3;
            this.car.position.x = -21;
        }
        else
        {
            this.animation.position.x = 8.5;
            this.animation.position.y = 11.7;
            this.animation.position.z = -13;
            this.car.position.set(-3.5, 0, -23);
        }

    }

    function update( mouse )
    {

        var time = this.time;
        if( this.isFlipped() )
        {
            time = 1-this.time;
        }

        var d = new THREE.Vector3(
            lerp( time, this.origin.x, this.dest.x ),
            lerp( time, this.origin.y, this.dest.y ),
            lerp( time, this.origin.z, this.dest.z )
        );

        //update background
        this.background.update( time );

        this.camera.position.set( d.x, d.y, d.z );

        this.camera.position.x += ( ( this.origin.x + mouse.x * 40 ) - this.camera.position.x ) * 0.1;
        this.camera.position.y += ( ( this.origin.z - mouse.y * 20 ) - this.camera.position.y ) * 0.1;
        this.camera.lookAt( this.target );

        //update perso
        this.animation.update( this.time );

        return true;
    }


    var _p = paysage.prototype = Object.create( Scene.prototype );
    _p.constructor = paysage;

    _p.init = init;
    _p.flip = flip;
    _p.update = update;

    return paysage;

}();

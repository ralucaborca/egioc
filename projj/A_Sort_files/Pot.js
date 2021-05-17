var Pot = function(){

    var assets = [
        {  model: 'src/3d/models/1_desk/pen0.js',           texture:"src/3d/textures/1_desk/pot_pen.jpg" },
        {  model: 'src/3d/models/1_desk/pen1.js',           texture:"src/3d/textures/1_desk/pot_pen.jpg" },
        {  model: 'src/3d/models/1_desk/pot.js',            texture:"src/3d/textures/1_desk/pot_pen.jpg" }
    ];

    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;



    _p.init = function(){

        this.rc = new THREE.Raycaster();

        Object.defineProperties( this,{
            pen0: { get:function () { return this.children[0] || models.dummy; }},
            pen1: {get: function() { return this.children[1] || models.dummy; } },
            pot: { get:function () { return this.children[2] || models.dummy; }}
        });

    };

    _p.animate = function(mouse, camera, shadow){


        var coords = {
            x : Alfred.screen.x,
            y : Alfred.screen.y
        }
        this.rc.setFromCamera( coords, camera);
        var intersect = this.rc.intersectObject( this, true )[0];
        if(intersect){
            this.plop(shadow);
        }

        //var axis = new THREE.Vector3(0,1,0);
        //this.pen0.rotateOnAxis( axis, RAD );

    };

    _p.plop = function(shadow){

        if( this.tweening )return;
        this.tweening = true;
        var scope = this;
        window.audioAPI.playOnce('crayons');

        var sox = shadow.position.x;
        var soz = shadow.position.z;
        var sdx = sox - 3;
        var sdz = soz - 3;
        //shadow
        TweenMax.to( shadow.position,.15, {
            x:sdx,
            z:sdz,
            onComplete : function()
            {
                TweenMax.to( shadow.position,.15, { x:sox, z:soz } );
            }
        } );

        //pot
        var yp = this.pot.position.y;
        TweenMax.to( this.pot.position,.15, {
            y:yp + 2.,
            onComplete : function()
            {
                TweenMax.to( scope.pot.position,.15, { y:yp } );
            }
        } );

        var oy0 = this.pen0.position.y;
        var ry0 = -PI / 2 + Math.random() * PI;
        TweenMax.to( this.pen0.position,.15,{

            y: oy0 + 5+ Math.random() * 5,
            ease:Expo.easeOut,
            delay:Math.random() *.05,
            onComplete:function()
            {
                TweenMax.to( scope.pen0.position,.45+ Math.random() * .15,
                {
                    y:oy0,
                    ease:Bounce.easeOut,
                    onUpdate : function(v)
                    {
                        scope.pen0.rotation.y += ( this.progress() * ry0 - scope.pen0.rotation.y ) * .1;
                    },
                    onComplete: function()
                    {
                        setTimeout( function(){ scope.tweening = false; }, 1000 );
                    }
                } );
            }
        });


        var oy1 = this.pen1.position.y;
        var ry1 = Math.random() * PI;
        TweenMax.to( this.pen1.position,.15,
        {
            y: oy1 + 3.5 + Math.random() * 5,
            ease:Expo.easeOut,
            delay:Math.random() *.05,
            onComplete:function()
            {
                TweenMax.to( scope.pen1.position,.45+ Math.random() * .15,{
                    y:oy1,
                    onUpdate : function(v)
                    {
                        scope.pen1.rotation.y += ( this.progress() * ry1 - scope.pen1.rotation.y ) * .1;
                    },
                    ease:Bounce.easeOut
                } );
            }
        });

    };


    return Model;

}();
var Car = function(){

    var assets = [
        { model: 'src/3d/models/3_depart/car_body.js',         texture: 'src/3d/textures/3_depart/body.jpg'     },
        { model: 'src/3d/models/3_depart/car_wheels_back.js',  texture: 'src/3d/textures/3_depart/wheels.jpg'   },
        { model: 'src/3d/models/3_depart/car_wheels_front.js', texture: 'src/3d/textures/3_depart/wheels.jpg'   },
        { model: 'src/3d/models/3_depart/suitcase_bottom.js',  texture: 'src/3d/textures/3_depart/valises.jpg'  },
        { model: 'src/3d/models/3_depart/suitcase_top.js',     texture: 'src/3d/textures/3_depart/valises.jpg'  }
    ];

    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;

    _p.init = function(){

        Object.defineProperties( this,{
            body: { get:function () { return this.children[0] || models.dummy; }},
            frontWheels:    {get: function() { return this.children[1] || models.dummy; } },
            backWheels:     {get: function() { return this.children[2] || models.dummy; } },
            bottomSuitcase: {get: function() { return this.children[3] || models.dummy; } },
            topSuitcase:    {get: function() { return this.children[4] || models.dummy; } },
            headlights:     {get: function() { return this.lights || models.dummy; } }
        });

        this.body.material.uniforms.scaleUv.value.x = 0.5;
        //this.body.material.uniforms.scaleUv.value.x = 1;

    };

    _p.initHeadlights = function()
    {
        var mat = materials.bitmap.clone();
        textures.loadTexture( "src/3d/textures/3_depart/headlights.png", function(t)
        {
            mat.uniforms.texture.value = t;
            mat.uniforms.alpha.value = 0.9;
            mat.transparent = true;
        });

        this.lights = new THREE.Mesh( new THREE.PlaneBufferGeometry( 40,40 ), mat );
        this.lights.scale.x = -1;
        this.lights.renderOrder = 1;
        this.lights.position.x += 38.3;
        this.lights.position.y -= 3.7;
        this.lights.position.z += 7.3;
        this.body.add( this.lights );

    };

    _p.animate = function(time, flipped ){

        this.lights.material.uniforms.alpha.value = time - Math.random() + 0.5;
        this.lights.material.uniforms.alpha.needsUpdate = true;

        this.headlights.visible = flipped;

        this.backWheels.rotation.z -=  ( RAD * 20 + RAD * ( time * 40 ) );
        this.frontWheels.rotation.z -= ( RAD * 20 + RAD * ( time * 40 ) );

        var a = Date.now() * 0.001 * PI2;
        var r = time;
        //car
        this.body.position.y = this.body.origin.y + Math.sin( a*=1.5 ) * r;
        //suitcase bottom
        this.bottomSuitcase.position.y = this.bottomSuitcase.origin.y +  Math.abs( Math.sin( a )   * r * 0.75 );
        //suitcase top
        this.topSuitcase.position.y = this.topSuitcase.origin.y + Math.abs( Math.sin( a + PI/3 ) * r * 0.85 );

    };

    _p.flip = function( dir )
    {
        if( this.body.type == "Mesh" )
        {
            this.body.material.uniforms.deltaUv.value.x = dir < 0 ? .5 : 0;
        }
        else
        {
            this.body.children[0].material.uniforms.deltaUv.value.x = dir < 0 ? .5 : 0;
        }
        if( this.topSuitcase.type == "Mesh" )
        {
            this.topSuitcase.material.uniforms.deltaUv.value.x = dir < 0 ? .5 : 0;
        }
        else
        {
            this.topSuitcase.children[0].material.uniforms.deltaUv.value.x = dir < 0 ? .5 : 0;
        }
        if( this.lights )this.lights.visible = dir < 0;
    };

    return Model;

}();
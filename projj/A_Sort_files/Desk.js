var Desk = function(){

    var assets = [
        {  model: 'src/3d/models/1_desk/laptop_top.js',     texture:"src/3d/textures/1_desk/laptop.jpg" },
        {  model: 'src/3d/models/1_desk/desk.js',           texture:"src/3d/textures/1_desk/desk.png" }
    ];

    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;


    var geom = getPlaneBufferGeometry(0,0,1,1);
    var texture;
    var popups = [];
    var last;
    var pot_shadow;

    _p.init = function(){

        //shadow pot
        var x = 0.888;
        var y = 0.854;
        var w = ( 0.994 - x );
        var h = ( y - 0.734 );
        var g = getPlaneBufferGeometry(x,1-y,w,h);

        var mat = materials.bitmap.clone();
        mat.uniforms.texture.value = textures.getTexture( "src/3d/textures/1_desk/desk.png" );
        mat.transparent = true;

        pot_shadow = new THREE.Mesh( g, mat );
        pot_shadow.scale.multiplyScalar( 22 );
        pot_shadow.rotateX( -PI / 2 );
        pot_shadow.position.x = 18.369;
        pot_shadow.position.y = 0.01;
        pot_shadow.position.z = -22.69;
        this.add( pot_shadow );

        Object.defineProperties( this,{
            top:    {get: function() { return this.children[0] || models.dummy; } },
            desk: { get:function () { return this.children[1] || models.dummy; }},
            pot_shadow: { get:function () { return pot_shadow || models.dummy; }}
        });

        this.openingRatio = 0;
        popups.push( this.createPopup() );


        textures.loadTexture( "src/3d/textures/1_desk/popups.jpg", function(t)
        {
            texture = t;
            popups.forEach( function( m, i )
            {
                m.material.uniforms.texture.value = t;
                m.material.uniforms.scaleUv.value.x = .5;
                m.material.uniforms.deltaUv.value.x = i*.5;
            });
        });
        last = Date.now();

    };
    _p.createPopup = function()
    {
        var mat = materials.bitmap.clone();
        mat.uniforms.texture.value = texture;
        mat.uniforms.scaleUv.value.x = .5;
        mat.uniforms.deltaUv.value.x = Math.random()> .5 ? 0 : .5;

        var m = new THREE.Mesh( geom, mat );
        popups.push( m );
        m.position.set( ( Math.random() -.5 ) * 15,
                        12 + ( Math.random() -.5 ) * 9,
                        -1.15 + popups.indexOf(m) *.01 );

        var duration = .15 + Math.random() * .5;
        TweenMax.to( m.scale,duration, {
            x:5 + 10 * Math.random(),
            y:5 + 5 * Math.random(),
            ease:Bounce.easeOut });

        mat.uniforms.brightness.value = 5;
        TweenMax.to(mat.uniforms.brightness, duration, { value:1, ease:Bounce.easeOut, onUpdate:function(){
            mat.uniforms.alpha.value = this.progress();// * 2, 1 );
        } });

        this.top.add(m);
        return m;
    };

    _p.animate = function(time){

        this.top.rotation.x += ( -27 * RAD + RAD * 120 * time - this.top.rotation.x ) * 0.1;
        this.top.position.copy( this.topOrigin );

        this.openingRatio = norm( this.top.rotation.x, -27 * RAD, ( -27 * RAD + RAD * 120 ) );

        if( Date.now() - last > 500 + Math.random() * 500 )
        {
            popups.push( this.createPopup() );
            last = Date.now();
        }

        if( popups.length > 10 ){

            var scope = this;
            var id = parseInt( popups.length / 2 * Math.random() );
            var m = popups[id];
            var mat = m.material;
            mat.transparent = true;
            TweenMax.to(mat.uniforms.alpha, .25,{
                value:0,
                onUpdate:function(){
                    m.scale.multiplyScalar( 1.01 );
                    if( m.scale.x < .1 )m.scale.x = .1;
                    if( m.scale.y < .1 )m.scale.y = .1;
                    if( m.scale.z < .1 )m.scale.z = .1;
                },
                onComplete: function()
                {
                    scope.top.remove( m );
                }
            });
            popups.splice( id, 1 );
        }
        popups.forEach( function( p,i )
        {
            p.position.z = -1.15 + i *.01
        });

    };

    return Model;

}();
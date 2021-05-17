var LandscapeBackground = function() {

    var textureDay, textureNight, day, night;
    function Model(parent, cb) {
        
        THREE.Object3D.call( this );
        parent.add( this );
        
        day = new THREE.Group();
        this.add( day );

        night = new THREE.Group();
        this.add( night );
        night.visible = false;

        textures.loadTexture( "src/3d/textures/4_paysage/paysage_spritesheet.png", function(Tday){

            buildSceneWithTex( Tday, day, false );

            textures.loadTexture( "src/3d/textures/4_paysage/paysage_retour_spritesheet.png", function( Tnight ){

                buildSceneWithTex( Tnight, night, true );
                
                if( cb ) cb();
                
            });
        });
    }

    var uvs = {
        mountain1:{x:0,y:260,w:2080,h:720},
        mountain2:{x:0,y:1090,w:2080,h:1004},
        cloud1:{x:200,y:2220,w:500,h:260},
        cloud2:{x:850,y:2220,w:450,h:260},
        cloud3:{x:1300,y:2220,w:700,h:260},
        sea:{x:0,y:2552,w:2080,h:365},
        sun:{x:0,y:3150,w:2080,h:764},
        sky:{x:13,y:4000,w:84,h:84},
        trails:{x:0,y:2915,w:2048,h:135},
        size: {w:2048,h:4096}
    };

    function buildSceneWithTex( texture, parent ,flip ){
        
        var material = materials.bitmap.clone();
        material.uniforms.texture.value = texture;
        material.transparent = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        var sw = uvs.size.w;
        var sh = uvs.size.h;

        var sky = new THREE.Mesh( getPlaneBufferGeometry(uvs.sky.x / sw , uvs.sky.y / sh , uvs.sky.w / sw, uvs.sky.h / sh ), material);
        sky.scale.set( 4096, 2048, 1);
        sky.position.set( 0, 0, -1900);
        parent.add(sky);


        var sun = new THREE.Mesh( getPlaneBufferGeometry( uvs.sun.x / sw , uvs.sun.y / sh , uvs.sun.w / sw, uvs.sun.h / sh ), material );
        if(!flip) sun.position.set( 50, 100, -1650);
        else sun.position.set( 0, 0-160, -1650);

        sun.scale.set( uvs.sun.w, uvs.sun.h, 1.0 );
        parent.add(sun);

        var trails = new THREE.Mesh( getPlaneBufferGeometry( uvs.trails.x / sw , uvs.trails.y / sh , uvs.trails.w / sw, uvs.trails.h / sh ), material );
        trails.position.set( 0, 200, -1450);
        trails.scale.set( uvs.trails.w, uvs.trails.h, 1.0 );
        parent.add(trails);


        
        // var trails = new THREE.Mesh( getPlaneBufferGeometry( uvs.trails.x / sw , uvs.trails.y / sh , uvs.trails.w / sw, uvs.trails.h / sh ), material );
        // trails.position.set( 0, 0, 0);

        // trails.scale.set( uvs.sun.w, uvs.sun.h, 1.0 );
        // parent.add(trails);

        var cloud1 = new THREE.Mesh( getPlaneBufferGeometry( uvs.cloud1.x / sw , uvs.cloud1.y / sh , uvs.cloud1.w / sw, uvs.cloud1.h / sh ), material );
        cloud1.position.set( -350, 100, -1850);
        cloud1.scale.set( uvs.cloud1.w, uvs.cloud1.h, 1.0 );
        parent.add(cloud1);

        var cloud2 = new THREE.Mesh( getPlaneBufferGeometry( uvs.cloud2.x / sw , uvs.cloud2.y / sh , uvs.cloud2.w / sw, uvs.cloud2.h / sh ), material );
        cloud2.position.set( 0, 100, -1800);
        cloud2.scale.set( uvs.cloud2.w, uvs.cloud2.h, 1.0 );
        parent.add(cloud2);

        var cloud3 = new THREE.Mesh( getPlaneBufferGeometry( uvs.cloud3.x / sw , uvs.cloud3.y / sh , uvs.cloud3.w / sw, uvs.cloud3.h / sh ), material );
        cloud3.position.set( 350, 100, -1750);
        cloud3.scale.set( uvs.cloud3.w, uvs.cloud3.h, 1.0 );
        parent.add(cloud3);

        var sea = new THREE.Mesh( getPlaneBufferGeometry( uvs.sea.x / sw , uvs.sea.y / sh , uvs.sea.w / sw, uvs.sea.h / sh ), material );
        sea.position.set( 0, -200, -1600);
        sea.scale.set( uvs.sea.w, uvs.sea.h, 1.0 );
        parent.add(sea);

        var mountain1 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain1.x / sw , uvs.mountain1.y / sh , uvs.mountain1.w / sw, uvs.mountain1.h / sh ), material );
        mountain1.position.set( -700, -300, -1280);
        mountain1.scale.set( uvs.mountain1.w, uvs.mountain1.h, 1.0 );
        parent.add(mountain1);

        var mountain2 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain2.x / sw , uvs.mountain2.y / sh , uvs.mountain2.w / sw, uvs.mountain2.h / sh ), material );
        mountain2.position.set( 700, -300, -1390);
        mountain2.scale.set( uvs.mountain2.w, uvs.mountain2.h, 1.0 );
        parent.add(mountain2);



        //stores references
        parent.mountain1 = mountain1;
        parent.mountain2 = mountain2;
        parent.sea = sea;
        parent.trails = trails;
        parent.sun = sun;
        parent.cloud1 = cloud1;
        parent.cloud2 = cloud2;
        parent.cloud3 = cloud3;


    }
    
    
    
    
    
    var _p = Model.prototype = Object.create( THREE.Object3D.prototype );
    _p.constructor = Model;

    _p.init = function () {

    };
    
    _p.flip = function ( dir ) {

        day.visible = dir > 0;
        night.visible = dir < 0;


    };

    _p.update = function( time )
    {

        var decalY = time * 70;
        var g = this.scale.x > 0 ? day : night;
        g.cloud1.position.x -= 0.05;
        g.cloud2.position.x -= 0.07;
        g.cloud3.position.x -= 0.09;
       // g.mountain1.position.y = - 300 - decalY;
       // g.mountain2.position.y = - 300 - decalY;
       // g.sea.position.y = - 150 - ( decalY*1.3 );
        //g.sun.position.y = - 150 - ( decalY*1.3 );

    };

    return Model;

}();
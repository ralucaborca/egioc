var CarBackground = function() {

    var textureDay, textureNight, day, night;
    function Model(parent, cb) {
        
        THREE.Object3D.call( this );
        parent.add( this );
        
        day = new THREE.Group();
        this.add( day );

        night = new THREE.Group();
        night.visible = false;
        night.scale.x = -1;
        this.add( night );

        textures.loadTexture( "src/3d/textures/3_depart/car_spritesheet.png", function(Tday){

            buildSceneWithTex( Tday, day, false );

            textures.loadTexture( "src/3d/textures/3_depart/car_retour_spritesheet.png", function( Tnight ){

                buildSceneWithTex( Tnight, night, true );
                
                if( cb ) cb();
                
            });
        });
    }


    var uvs = {
        town:{x:0,y:0,w:1196,h:368},
        sun:{x:1650,y:501,w:160,h:160},
        mountain1:{x:0,y:360,w:1335,h:342},
        mountain2:{x:0,y:735,w:1170,h:245},
        mountain3:{x:1155,y:0,w:845,h:120},
        mountain4:{x:1155,y:190,w:845,h:165},
        cloud1:{x:220,y:1560,w:570,h:160},
        cloud2:{x:870,y:1700,w:260,h:100},
        cloud3:{x:1110,y:1880,w:170,h:50},
        trails:{x:0,y:1180,w:2048,h:120},
        sky:{x:0,y:2016,w:30,h:30},
        size: {w:2048,h:2048}
    };

    function buildSceneWithTex( texture, parent ,flip ){
        
        var material = materials.bitmap.clone();
        material.uniforms.texture.value = texture;
        material.transparent = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        var sw = uvs.size.w;
        var sh = uvs.size.h;

        var sky = new THREE.Mesh( getPlaneBufferGeometry(uvs.sky.x / sw, uvs.sky.y / sw , uvs.sky.w / sw, uvs.sky.h / sh ), material);
        sky.scale.set( 2048, 2048, 1);
        sky.position.set( 300, 250, -1600);
        parent.add(sky);

        var sun = new THREE.Mesh( getPlaneBufferGeometry( uvs.sun.x / sw, uvs.sun.y / sh , uvs.sun.w / sw, uvs.sun.h / sh ), material );
        sun.position.set( 300, 250, -1550);
        sun.scale.set( uvs.sun.w, uvs.sun.h, 1.0 );
        parent.add(sun);


        var trails = new THREE.Mesh( getPlaneBufferGeometry( uvs.trails.x / sw, uvs.trails.y / sh , uvs.trails.w / sw, uvs.trails.h / sh ), material );
        trails.position.set(0, 140, -1490);
        trails.scale.set( uvs.trails.w*0.7, uvs.trails.h*0.7, 1.0 );
        parent.add(trails);
      

        var cloud1 = new THREE.Mesh( getPlaneBufferGeometry( uvs.cloud1.x / sw, uvs.cloud1.y / sh , uvs.cloud1.w / sw, uvs.cloud1.h / sh ), material );
        cloud1.position.set(700, 200, -1490);
        cloud1.scale.set( uvs.cloud1.w, uvs.cloud1.h, 1.0 );
        parent.add(cloud1);

        var cloud2 = new THREE.Mesh( getPlaneBufferGeometry( uvs.cloud2.x / sw, uvs.cloud2.y / sh , uvs.cloud2.w / sw, uvs.cloud2.h / sh ), material );
        cloud2.position.set(700, 260, -1390);
        cloud2.scale.set( uvs.cloud2.w, uvs.cloud2.h, 1.0 );
        parent.add(cloud2);

        var cloud3 = new THREE.Mesh( getPlaneBufferGeometry( uvs.cloud3.x / sw, uvs.cloud3.y / sh , uvs.cloud3.w / sw, uvs.cloud3.h / sh ), material );
        cloud3.position.set(1400, 270, -1380);
        cloud3.scale.set( uvs.cloud3.w, uvs.cloud3.h, 1.0 );
        parent.add(cloud3);

        var town = new THREE.Mesh( getPlaneBufferGeometry( uvs.town.x / sw, uvs.town.y / sh , uvs.town.w / sw, uvs.town.h / sh ), material );
        town.position.set( 0, 0, -1370);
        if( flip ) town.position.x = 1370;
        town.scale.set( uvs.town.w, uvs.town.h, 1.0 );
        parent.add(town);

        var town2 = new THREE.Mesh( getPlaneBufferGeometry( uvs.town.x / sw, uvs.town.y / sh , uvs.town.w / sw, uvs.town.h / sh ), material );
        town2.position.set( 2200, 0, -1470);
        town2.scale.set( uvs.town.w, uvs.town.h, 1.0 );
        parent.add(town2);

        var town3 = new THREE.Mesh( getPlaneBufferGeometry( uvs.town.x / sw, uvs.town.y / sh , uvs.town.w / sw, uvs.town.h / sh ), material );
        town3.position.set( 3000, 0, -1570);
        town3.scale.set( uvs.town.w, uvs.town.h, 1.0 );
        parent.add(town3);

        var mountain1 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain1.x / sw, uvs.mountain1.y / sh , uvs.mountain1.w / sw, uvs.mountain1.h / sh ), material );
        mountain1.position.set( 600, 0, -1360);
        mountain1.scale.set( uvs.mountain1.w, uvs.mountain1.h, 1.0 );
        parent.add(mountain1);

        var mountain2 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain2.x / sw, uvs.mountain2.y / sh , uvs.mountain2.w / sw, uvs.mountain2.h / sh ), material );
        mountain2.position.set( 1100, 0, -1350);
        mountain2.scale.set( uvs.mountain2.w, uvs.mountain2.h, 1.0 );
        parent.add(mountain2);

        var mountain3 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain3.x / sw, uvs.mountain3.y / sh , uvs.mountain3.w / sw, uvs.mountain3.h / sh ), material );
        mountain3.position.set( 1900, 0, -1340);
        mountain3.scale.set( uvs.mountain3.w, uvs.mountain3.h, 1.0 );
        parent.add(mountain3);

        var mountain4 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain4.x / sw, uvs.mountain4.y / sh , uvs.mountain4.w / sw, uvs.mountain4.h / sh ), material );
        mountain4.position.set( 3600, 0, -1330);
        mountain4.scale.set( uvs.mountain4.w, uvs.mountain4.h, 1.0 );
        parent.add(mountain4);

        var mountain5 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain1.x / sw, uvs.mountain1.y / sh , uvs.mountain1.w / sw, uvs.mountain1.h / sh ), material );
        mountain5.position.set( 3600, 0, -1360);
        mountain5.scale.set( uvs.mountain1.w, uvs.mountain1.h, 1.0 );
        parent.add(mountain5);

        var mountain6 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain2.x / sw, uvs.mountain2.y / sh , uvs.mountain2.w / sw, uvs.mountain2.h / sh ), material );
        mountain6.position.set( 4100, 0, -1350);
        mountain6.scale.set( uvs.mountain2.w, uvs.mountain2.h, 1.0 );
        parent.add(mountain6);

        var mountain7 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain3.x / sw, uvs.mountain3.y / sh , uvs.mountain3.w / sw, uvs.mountain3.h / sh ), material );
        mountain7.position.set( 5100, 0, -1340);
        mountain7.scale.set( uvs.mountain3.w, uvs.mountain3.h, 1.0 );
        parent.add(mountain7);

        var mountain8 = new THREE.Mesh( getPlaneBufferGeometry( uvs.mountain4.x / sw, uvs.mountain4.y / sh , uvs.mountain4.w / sw, uvs.mountain4.h / sh ), material );
        mountain8.position.set( 6600, 0, -1330);
        mountain8.scale.set( uvs.mountain4.w, uvs.mountain4.h, 1.0 );
        parent.add(mountain8);

        //stores references
        parent.sky = sky;
        parent.trails = trails;
        parent.sun = sun;
        parent.cloud1 = cloud1;
        parent.cloud2 = cloud2;
        parent.cloud3 = cloud3;
        parent.town = town;
        parent.town2 = town2;
        parent.town3 = town3;
        parent.mountain1 = mountain1;
        parent.mountain2 = mountain2;
        parent.mountain3 = mountain3;
        parent.mountain4 = mountain4;
        parent.mountain5 = mountain5;
        parent.mountain6 = mountain6;
        parent.mountain7 = mountain7;
        parent.mountain8 = mountain8;

    }
    
    
    
    
    
    var _p = Model.prototype = Object.create( THREE.Object3D.prototype );
    _p.constructor = Model;

    _p.init = function(){};
    
    _p.flip = function ( dir ) {

        day.visible = dir > 0;
        night.visible = dir < 0;
    };

    _p.update = function( time )
    {

        var g = this.scale.x > 0 ? day : night;

        g.town.position.x       -= 1 * time + 0.3;
        g.town2.position.x       -= 1.1 * time + 0.3;
        g.town3.position.x       -= 1.2 * time + 0.3;
        g.mountain1.position.x  -= 1.4 * time + 0.6;
        g.mountain5.position.x  -= 1.4 * time + 0.6;
        g.mountain2.position.x  -= 2 * time + 1;
        g.mountain6.position.x  -= 2 * time + 1;
        g.mountain3.position.x  -= 2 * time + 1.4;
        g.mountain7.position.x  -= 2 * time + 1.4;
        g.mountain4.position.x  -= 2 * time + 2;
        g.mountain8.position.x  -= 2 * time + 2;
        g.cloud1.position.x     -= 0.4 * time + 0.6;
        g.cloud2.position.x     -= 0.4 * time + 1;
        g.cloud3.position.x     -= 0.5 * time + 1;
        g.sun.position.x     -= 0.1 * time + 0.1;
        //g.trails.position.x     -= 0.1 * time + 0.1;
        // g.trails.material.uniforms.alpha.value -= 0.1;
        // g.trails.material.uniforms.alpha.needsUpdate = true;

    };

    return Model;

}();
var Road = function(){

    var road;
    function Model( parent, cb ){

        var scope = this;
        textures.loadTexture( "src/3d/textures/animation/road.png", function(t){

            models.generic.call( scope, scope, Model, [], parent, null );


            var w = 1024;
            var h = 2048;

            var mat = materials.bitmap.clone();
            mat.uniforms.texture.value = t;
            mat.transparent = true;
            var ground = new THREE.Mesh( getPlaneBufferGeometry(2/w, 2/h,1/w, 1/h ), mat );
            ground.position.y = -.2;
            ground.scale.x = 1024;
            ground.scale.y = 1024;
            ground.rotation.x = PI / 2;
            ground.rotation.z = PI / 2;
            scope.add( ground );
            scope.ground = ground;
            mat.transparent = true;


            var sca = .2;
            mat = materials.bitmap.clone();
            mat.uniforms.texture.value = t;
            mat.transparent = true;

            road = new THREE.Mesh( getPlaneBufferGeometry(2/w,0,360 / w, 1 ), mat );
            road.position.y = -.1;
            road.scale.x = 370  * sca;
            road.scale.y = 2048 * sca;
            road.rotation.x = PI / 2;
            road.rotation.z = PI / 2;
            scope.add( road );
            scope.road = road;

            sca = .2;
            mat = materials.bitmap.clone();
            mat.uniforms.texture.value = t;
            mat.transparent = true;

            var shadow = new THREE.Mesh( getPlaneBufferGeometry(370/w,0,(510-370)/ w, 233/h ), mat );
            shadow.position.x = 1;
            shadow.position.y = 0;
            shadow.scale.x = ( 510-370 ) * sca;
            shadow.scale.y = 200 * sca;
            shadow.rotation.x = PI / 2;
            shadow.rotation.z = PI / 2;
            scope.add( shadow );
            scope.shadow = shadow;

            parent.add( scope );

            if( cb )cb();
        })
    }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;


    _p.flip = function( dir )
    {
        if( this.road ){

            this.road.material.uniforms.deltaUv.value.x   = dir < 0 ? 0.5 : 0;
            this.shadow.material.uniforms.deltaUv.value.x = dir < 0 ? 0.5 : 0;
            this.ground.material.uniforms.deltaUv.value.x = dir < 0 ? 0.5 : 0;
        }
    };

    _p.update = function( speed )
    {
        if( this.road ){

            this.road.material.uniforms.deltaUv.value.y -= speed;
        }
    };

    return Model;

}();
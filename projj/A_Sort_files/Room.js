var Room = function(){
    var assets = [
        { model: 'src/3d/models/2_bag/handle.js',     texture: 'src/3d/textures/6_room/bag_room.jpg'  },
        { model: 'src/3d/models/2_bag/bag.js',        texture: 'src/3d/textures/6_room/bag_room.jpg'     },
        { model: 'src/3d/models/6_room/room.js',    texture: 'src/3d/textures/6_room/room.jpg'      }
    ];

    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;

    _p.init = function()
    {

        Object.defineProperties( this,{
            handle:     {get: function() { return this.children[0] || models.dummy; } },
            body:       {get:function () { return this.children[1] || models.dummy; }},
            room:       {get: function() { return this.children[2] || models.dummy; } }
        });

        var s = .45;
        this.handle.scale.multiplyScalar( s );
        this.body.scale.multiplyScalar( s );

        this.handle.rotation.y = this.body.rotation.y = -30.318 * RAD;

        var o =  new THREE.Vector3(0.27, -3.034, 0 );
        this.handle.position.set(o.x, o.z, -o.y );
        this.body.position.set(o.x, o.z, -o.y );


        this.room.material = getMaterial('src/3d/textures/6_room/room.jpg');

        this.body.material = getMaterial('src/3d/textures/6_room/bag_room.jpg');
        this.body.material.uniforms.scaleUv.value.y = .5;
        this.body.material.uniforms.deltaUv.value.y = -.5;

        this.handle.material = getMaterial('src/3d/textures/6_room/bag_room.jpg');
        this.handle.material.uniforms.scaleUv.value.y = .5;


    };
    function getMaterial(url){
        var t = textures.getTexture( url );
        var mat = materials.blend.clone();
        mat.uniforms.texture.value = t;
        mat.uniforms.frameCount.value = 2;
        mat.uniforms.scaleUv.value.x = .5;
        return mat;
    }

    return Model;

}();

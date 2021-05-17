var Bag = function(){

    var assets = [
        { model: 'src/3d/models/2_bag/handle.js',     texture: 'src/3d/textures/2_bag/handle.jpg'  },
        { model: 'src/3d/models/2_bag/bag.js',        texture: 'src/3d/textures/2_bag/bag.jpg'          },
        { model: 'src/3d/models/2_bag/bag_top.js',    texture: 'src/3d/textures/animation/bag_top.png'          }
    ];

    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;

    _p.init = function(){

        Object.defineProperties( this,{
            handle:     {get: function() { return this.children[0] || models.dummy; } },
            body:       { get:function () { return this.children[1] || models.dummy; }},
            bag_top:    {get: function() { return this.children[2] || models.dummy; } }
        });

        var blendMat = materials.blend.clone();
        blendMat.uniforms.texture.value = textures.getTexture( 'src/3d/textures/animation/bag_top.png' );
        blendMat.uniforms.frameCount.value = 5;

        this.bag_top.material = blendMat;
        this.bag_top.material.transparent = true;
        this.bag_top.material.uniforms.transition.value = 1;

    };

    return Model;

}();
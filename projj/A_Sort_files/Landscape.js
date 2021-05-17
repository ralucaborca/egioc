var Landscape = function(){

    var assets = [
        { model: 'src/3d/models/4_paysage/floor.js',            texture: 'src/3d/textures/4_paysage/floor.jpg' },
        { model: 'src/3d/models/4_paysage/garde_corps.js',      texture: 'src/3d/textures/4_paysage/fence.jpg' }
    ];
    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;

    _p.init = function()
    {
        Object.defineProperties( this,{
            floor: { get:function () { return this.children[0] || models.dummy; }},
            fence: { get:function () { return this.children[1] || models.dummy; }}
        });

        this.floor.material.uniforms.scaleUv.value.x = .5;

    };

    _p.flip = function( dir )
    {
        this.floor.material.uniforms.deltaUv.value.x = dir < 0 ? .5 : 0;
    };

    return Model;

}();
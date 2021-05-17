var Beach = function()
{
    var assets = [
        { model: 'src/3d/models/5_beach/beach.js',          texture: 'src/3d/textures/5_beach/floor.jpg' },
        { model: 'src/3d/models/5_beach/parasol.js',        texture: 'src/3d/textures/5_beach/parasols.jpg' }

    ];
    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;

    _p.init = function()
    {
        
        Object.defineProperties( this,{
            floor: { get:function () { return this.children[0] || models.dummy; }},
            parasols: { get:function () { return this.children[1] || models.dummy; }}
        });
    };

    return Model;
}();
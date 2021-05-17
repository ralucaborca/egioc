var Jumelles = function(){

    var assets = [
        { model: 'src/3d/models/2_bag/jumelle.js',     texture: 'src/3d/textures/2_bag/jumelle.jpg'      }
    ];

    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;


    return Model;

}();
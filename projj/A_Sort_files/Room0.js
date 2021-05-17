var Room0 = function(){

    var assets = [
        { model: 'src/3d/models/2_bag/bed.js',        texture: 'src/3d/textures/2_bag/bed.jpg'         },
        { model: 'src/3d/models/2_bag/shirt.js',      texture: 'src/3d/textures/2_bag/shirt.jpg'       },
        { model: 'src/3d/models/2_bag/floor.js',      texture: 'src/3d/textures/2_bag/floor.jpg'       }
    ];

    function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
    var _p = Model.prototype = Object.create( models.generic.prototype );
    _p.constructor = Model;


    return Model;

}();
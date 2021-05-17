
/*
 //template
 var Model = function(){

     var assets = [
     { model: 'src/3d/models/3_depart/car_body.js',         texture: 'src/3d/textures/3_depart/1024_Mini_Austin_body_UV.jpg'     },
     { model: 'src/3d/models/3_depart/car_wheels_back.js',  texture: 'src/3d/textures/3_depart/1024_Mini_Austin_wheels_UV.jpg'   },
     [...]
     ];

     function Model( parent, cb ){ models.generic.call( this, this, Model, assets, parent, cb ); }
     var _p = Model.prototype = Object.create( models.generic.prototype );
     _p.constructor = Model;

     [...] specific methods for this mesh

     return Model;
 }();
 //*/


var models = function( exports ){

    var bl = new THREE.BinaryLoader();
    exports.scene = new THREE.Scene();
    exports.camera = new THREE.PerspectiveCamera(30,1,1,100);
    exports.rtt = new THREE.WebGLRenderTarget(32,32);
    exports.load = function( scope, assets, cb )
    {
        if( assets == null || assets.length == 0 ){
            if( cb )cb();
            return;
        }
        bl.load( assets[0].model, function(g){

            g.name = assets[0].model;
            scope.geometries.push( g );
            textures.loadTexture( assets[0].texture, function( t )
            {

                var material = materials.bitmap.clone();
                material.uniforms.texture.value = t;
                scope.materials.push( material );

                assets.shift();
                if( assets.length > 0 )
                {
                    exports.load( scope, assets, cb );
                }
                else
                {
                    if( cb )cb();
                }
            });
        });
    };

    exports.generic = function()
    {

        var f = function( fc, Class, assets, parent, cb )
        {
            THREE.Object3D.call( fc );

            Class.loaded        = Class.loaded || false;
            Class.loading       = Class.loading || false;
            Class.geometries    = Class.geometries || [];
            Class.materials     = Class.materials  || [];
            Class.instances     = Class.instances  || [];

            if( !Class.loaded && !Class.loading )
            {
                Class.loading = true;
                var scope = fc;
                exports.load( Class, assets, function()
                {
                    Class.loaded = true;
                    Class.loading = false;
                    populate( scope, Class );
                    parent.add(scope);
                    Class.instances.forEach(function(c)
                    {
                        populate(c, Class);
                        c.parent.add( c );
                        c.brightness(.5 );
                        c.init();
                        if( c.cb ) c.cb( c );
                    });
                    scope.init();
                    if( cb )cb( scope );
                    scope.onLoadComplete();
                } );
                return;
            }
            else if( Class.loading )
            {
                console.warn( 'this model is being loaded, can\'t instantiate now' );
                fc.parent = parent;
                fc.cb = cb;
                Class.instances.push( fc );
                return;
            }
            else
            {

                populate( this, Class );
                parent.add( fc );
                fc.init();
                if( cb )cb( fc );
            }
        };

        function populate( scope, Class )
        {
            for( var i = 0; i < Class.geometries.length; i++ )
            {
                var mat = Class.materials[ i ].clone();
                mat.uniforms.texture.value = Class.materials[ i ].uniforms.texture.value;
                var mesh = new THREE.Mesh( Class.geometries[i], mat );
                mesh.name = Class.geometries[i].name;
                scope.add( mesh );
            }

            exports.scene.add( scope );
            stage3d.render( exports.scene, exports.camera, exports.rtt );
            exports.scene.remove( scope );

        }

        function relocate()
        {
            var count = this.children.length;
            var groups = [];
            var meshes = [];
            for( var i = 0; i < count; i++ )
            {
                var m = this.children[i];
                meshes.push(m);
                var g = relocateMesh( m );
                g.name = m.name;
                groups.push(g);
            }
            for( i = 0; i < count; i++ ) {

                m = meshes[i];
                g = groups[i];
                this.remove(m);
                g.add(m);
                this.add(g);
            }
        }

        function relocateMesh( m )
        {
            var c = new THREE.Vector3();
            m.geometry.vertices.forEach(function(v){c.add(v);});
            c.multiplyScalar( 1 / m.geometry.vertices.length );
            m.position.sub( c );

            var g = new THREE.Group();
            g.position.x = c.x;
            g.position.y = c.y;
            g.position.z = c.z;
            g.origin = g.position.clone();
            return g;
        }

        function brightness( brightness )
        {
            if( this.children.length == 0 )return;
            for( var i  =0; i < this.children.length; i++ )
            {
                var m = this.children[i];
                //si le mesh a ete relocated, le mesh est le premier enfant d'un group
                if( m.type == "Group" )m = m.children[0];
                m.material.uniforms.brightness.value = brightness;
            }
        }

        function contrast( contrast )
        {
            if( this.children.length == 0 )return;
            for( var i  =0; i < this.children.length; i++ )
            {
                var m = this.children[i];
                //si le mesh a ete relocated, le mesh est le premier enfant d'un group
                if( m.type == "Group" )m = m.children[0];
                m.material.uniforms.contrast.value = contrast;
            }
        }

        function saturation( saturation )
        {
            if( this.children.length == 0 )return;
            for( var i  =0; i < this.children.length; i++ )
            {
                var m = this.children[i];
                //si le mesh a ete relocated, le mesh est le premier enfant d'un group
                if( m.type == "Group" )m = m.children[0];
                m.material.uniforms.saturation.value = saturation;
            }
        }

        function alpha( alpha )
        {
            if( this.children.length == 0 )return;
            for( var i  =0; i < this.children.length; i++ )
            {
                var m = this.children[i];
                //si le mesh a ete relocated, le mesh est le premier enfant d'un group
                if( m.type == "Group" )m = m.children[0];
                m.material.uniforms.alpha.value = alpha;
            }
        }

        var _p = f.prototype = Object.create( THREE.Object3D.prototype );
        _p.constructor = f;
        _p.init = function()
        {
            //console.log( "init" )
        };
        _p.onLoadComplete = function(){};
        _p.relocate = relocate;
        _p.brightness = brightness;
        _p.contrast = contrast;
        _p.saturation = saturation;
        _p.alpha = alpha;
        return f;
    }();


    exports.dummy = new THREE.Object3D();
    exports.dummy.origin = new THREE.Vector3();

    return exports;
}( {} );
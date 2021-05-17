var Scene = function()
{

    var bl = new THREE.BinaryLoader();
    function Scene(){

        THREE.Scene.call( this );

        this.origin = new THREE.Vector3();
        this.target = new THREE.Vector3();
        this.camera = new THREE.PerspectiveCamera(stage3d.fov, stage3d.aspectRatio, stage3d.near, stage3d.far );

        this.group = new THREE.Group();
        this.add( this.group );

        this.loaded = false;
        this.time = 0;
        this.brightness = 1;
        this.meshes = [];
        this.assets = [];

    }

    function init( cb )
    {
        this.load( this.assets, cb );
    }

    function load( assets, cb )
    {
        if( assets.length === 0 )
        {
            this.onLoadComplete();
            if( cb )cb();
            return;
        }

        var scope = this;
        bl.load( assets[0].model, function(g){

            textures.loadTexture( assets[0].texture, function( t )
            {

                var material = materials.bitmap.clone();
                material.uniforms.texture.value = t;

                var mesh = new THREE.Mesh( g, material );
                scope.meshes.push( mesh );
                scope.group.add( mesh );

                //silent render to upload meshes & textures to GPU
                stage3d.render( scope, scope.camera, Scene.rtt );

                assets.shift();
                if( assets.length > 0 )
                {
                    scope.load( assets, cb );
                }
                else
                {
                    scope.onLoadComplete();
                    if( cb )cb();
                }
            });
        });
    }


    //called when everything is loaded
    function onLoadComplete()
    {
        this.loaded = true;
    }

    //updates camera aspect ratio
    function updateAspectRatio(){

        this.camera.aspect = stage3d.aspectRatio;
        this.camera.updateProjectionMatrix();
    }

    //sets the animation time
    function setTime( t ){

        this.time = t;

    }

    //do something with mouse
    function update( mouse )
    {
        if( !this.loaded )return;

        this.camera.lookAt( this.group.position );

        if( mouse )
        {

            this.group.rotation.x = ( -(mouse.y+0.5) * RAD * 5 );
            this.group.rotation.y += ( ( mouse.x * RAD * 30 ) - this.group.rotation.y ) * 0.025;

            var t = Date.now() * 0.001;
            this.group.rotation.x -= Math.cos( t * 0.25 ) * 0.005;
            this.group.rotation.y += Math.sin( t * 0.5 ) * 0.001;

        }
    }

    function relocateMesh( id )
    {
        var c = new THREE.Vector3();

        var m = this.meshes[id];
        m.geometry.vertices.forEach(function(v){
            c.add(v);
        });
        c.multiplyScalar( 1 / m.geometry.vertices.length );
        m.position.sub( c );

        console.log(id, c.x, c.y, c.z);

        var g = new THREE.Group();
        g.add( m );

        g.position.x = c.x;
        g.position.y = c.y;
        g.position.z = c.z;

        this.meshes[ id ] = g;
        this.add( g );
    }

    //fait la version 'retour' de depart et paysage
    function isFlipped()
    {
        return this.scale.x == -1;
    }

    function flip()
    {
        this.scale.x *= -1;

        //direction retour
        var brigthness = 1;
        if( this.scale.x == -1 ) brigthness = 0.5;
        this.brightness = brigthness;
        this.meshes.forEach( function( o )
        {
            var m = o;

            //si le mesh a ete relocated, le mesh est le premier enfant d'un group
            if( o.type == "Group" )m = o.children[0];

            m.material.uniforms.brightness.value = brigthness;

        });

    }

    var _p = Scene.prototype = Object.create( THREE.Scene.prototype );
    _p.constructor = Scene;

    _p.init = init;
    _p.load = load;
    _p.onLoadComplete = onLoadComplete;
    _p.updateAspectRatio = updateAspectRatio;
    _p.setTime = setTime;
    _p.update = update;


    _p.relocateMesh = relocateMesh;
    _p.isFlipped = isFlipped;
    _p.flip = flip;

    Scene.rtt = new THREE.WebGLRenderTarget(32,32);
    return Scene;

}();

var stage3d = function( exports )
{

    exports.renderer = null;
    exports.domElement = null;

    exports.resolution = new THREE.Vector2();
    exports.fov = 30;
    exports.near = 1;
    exports.far = 100000;

    function init( width, height )
    {
        exports.resolution.x = width;
        exports.resolution.y = height;
        exports.aspectRatio = width/height;

        exports.renderer = new THREE.WebGLRenderer(
        {
            alpha: true,
            transparent: true,
            stencil: false,
            antialias: true
        });

        exports.renderer.sortObjects = true;

        exports.renderer.setSize( width, height );
        exports.domElement = exports.renderer.domElement;

        document.body.appendChild( exports.domElement );

    }

    function resize( width, height ){

        exports.renderer.setSize(width, height);
        exports.resolution.x = width;
        exports.resolution.y = height;
        exports.aspectRatio = width/height;

    }

    function render( scene, camera, rtt ){

        if( rtt ) {
            exports.renderer.render( scene, camera, rtt, true );
        }else{
            exports.renderer.render( scene, camera );
        }
    }

    exports.init                    = init;
    exports.resize                  = resize;
    exports.render                  = render;
    return exports;

}({});

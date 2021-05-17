var Clock = function()
{

    var mat, time;
    function Clock( parent ){

        var hour = new Image();
        hour.src= "src/3d/textures/6_room/clock.png";

        THREE.Object3D.call( this );

        var w = 256;
        var h = 64;
        var canvas = document.createElement("canvas");

        canvas.width = w;
        canvas.height = h;

        hour.onload = function(){
            var ctx = canvas.getContext( "2d" );

            ctx.fillRect(0,0,w,h);

            //ctx.drawImage(hour, 0, 0, w,h);
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc( w/4, h / 4, 5, 0, PI2 );
            ctx.fill();

            ctx.beginPath();
            ctx.arc( w/4, h / 4 * 3, 5, 0, PI2 );
            ctx.fill();
        }
        


        var texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
        mat = materials.bitmap.clone();
        mat.transparent = true;
        mat.uniforms.texture.value = texture;
        mat.uniforms.scaleUv.value.x = .5;
        mat.uniforms.deltaUv.value.x = .5;

        var v1 = new THREE.Vector3(  -1.959, 3.976, 2.376 );
        var v2 = new THREE.Vector3(  -1.959, 4.328, 2.376 );
        var v3 = new THREE.Vector3(  -1.959, 4.328, 3.390 );
        var v0 = new THREE.Vector3(  -1.959, 3.976, 3.390 );

        var geom = new THREE.BufferGeometry();
        geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([
            v0.x, v0.y, v0.z,//v0
            v1.x, v1.y, v1.z,//v1
            v2.x, v2.y, v2.z,//v2

            v0.x, v0.y, v0.z,//v0
            v2.x, v2.y, v2.z,//v2
            v3.x, v3.y, v3.z //v3
        ]), 3 ) );

        var uv0 = new THREE.Vector2( 0, 0 );
        var uv1 = new THREE.Vector2( 1, 0 );
        var uv2 = new THREE.Vector2( 1, 1 );
        var uv3 = new THREE.Vector2( 0, 1 );

        geom.addAttribute( 'uv', new THREE.BufferAttribute(  new Float32Array([
            uv0.x, 1 - uv0.y,
            uv1.x, 1 - uv1.y,
            uv2.x, 1 - uv2.y,
            uv0.x, 1 - uv0.y,
            uv2.x, 1 - uv2.y,
            uv3.x, 1 - uv3.y
        ]), 2 ) );

        var m = new THREE.Mesh( geom, mat );
        //m.rotateX(-PI / 2 );
        this.add( m );
        parent.add( this );

        time = Date.now();
    }

    function update( ratio ){

        if( parseInt( ( Date.now() *.001 ) * 2 ) % 2 == 0 ) {
            mat.uniforms.deltaUv.value.x = .5;
        }else{
            mat.uniforms.deltaUv.value.x = 0;
        }
        mat.uniforms.brightness.value = 1;
        mat.uniforms.saturation.value = 1;
    }

    var _p = Clock.prototype = Object.create( THREE.Object3D.prototype );
    _p.constructor = Clock;
    _p.update = update;
    return Clock;

}();
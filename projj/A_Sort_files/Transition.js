var Transition = function()
{

    function Transition()
    {

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1);

        this.material = new THREE.ShaderMaterial({

            uniforms:
            {
                texture0 : { type: "t", value : null },
                texture1 : { type: "t", value : null },
                gradient : { type: "t", value : null },
                resolution : { type: "v2", value : stage3d.resolution },
                offset : { type: "v2", value : new THREE.Vector2(.5,.5) },
                p0 : { type: "v2", value : new THREE.Vector2(.5,.5) },
                p1 : { type: "v2", value : new THREE.Vector2(.5,.5) },
                angle : { type: "f", value : PI / 4 },
                brightness : { type: "f", value : 1 },
                transition : { type: "f", value : 0 },
                alphaThreshold : { type: "f", value :0.01 }
            },
            vertexShader: "void main() {gl_Position =  vec4( position, 1.0 );}",//ShaderLoader.get( "transition_vs" ),
            fragmentShader: ShaderLoader.get( "transition_fs" ),
            transparent:true

        });

        var geom = new THREE.BufferGeometry();
        geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1, -1, 0, 1, 1, 0, -1, 1, 0]), 3 ) );
        var mesh = new THREE.Mesh( geom, this.material );
        this.scene.add( mesh );

    }

    function setTime( t, flash )
    {


        this.material.uniforms.brightness.value = Boolean( flash ) ? 1 : 0;
        this.material.uniforms.transition.value = t;
        this.material.uniforms.resolution.value.x = stage3d.resolution.x;
        this.material.uniforms.resolution.value.y = stage3d.resolution.y;

        uiRatios = Alfred.uiRatios;

        this.material.uniforms.angle.value = Math.atan2( uiRatios.ly1 - uiRatios.ly0, uiRatios.lx1 - uiRatios.lx0 );
        this.material.uniforms.offset.value.x = lerp(.5, uiRatios.lx0, uiRatios.lx1 );
        this.material.uniforms.offset.value.y = 1 - lerp(.5, uiRatios.ly0, uiRatios.ly1 );
        this.material.uniforms.p0.value.x = uiRatios.lx0;
        this.material.uniforms.p0.value.y = 1.-uiRatios.ly0;
        this.material.uniforms.p1.value.x = uiRatios.lx1;
        this.material.uniforms.p1.value.y = 1.- uiRatios.ly1;

    }

    function setTextures( t0, t1 )
    {
        this.material.uniforms.texture0.value = t0;
        this.material.uniforms.texture1.value = t1;
    }

    var _p = Transition.prototype;
    _p.constructor = Transition;

    _p.setTime = setTime;
    _p.setTextures = setTextures;

    return Transition;

}();
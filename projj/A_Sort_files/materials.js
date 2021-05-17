var materials = function( exports ){

    exports.init = function() {


        exports.default = new THREE.MeshBasicMaterial({color: 0x808080, transparent:true, side:THREE.DoubleSide });

        exports.bitmap = new THREE.ShaderMaterial(
        {
            uniforms: {

                texture: {type: "t", value: null},
                brightness: {type: "f", value: 1},
                saturation: {type: "f", value: 1},
                contrast: {type: "f", value: 1},
                alpha: {type: "f", value: 1},
                scaleUv: {type: "v2", value: new THREE.Vector2(1,1)},
                deltaUv: {type: "v2", value: new THREE.Vector2(0,0)},
                resolution: {type: "v2", value: stage3d.resolution },
                radius: {type: "f", value: 0. },
                color: {type: "v3", value: new THREE.Vector3(0.22265625, 0.19921875,0.30078125 ) }

            },
            vertexShader: ShaderLoader.get("bitmap_vs"),
            fragmentShader: ShaderLoader.get("bitmap_fs"),

            side:THREE.DoubleSide,
            transparent: false,
            depthWrite: true,
            depthTest: true
        });

        exports.blend = new THREE.ShaderMaterial(
            {
                uniforms: {

                    texture: {type: "t", value: null},
                    scaleUv : {type: "v2", value: new THREE.Vector2(1,1) },
                    deltaUv : {type: "v2", value: new THREE.Vector2(0,0) },
                    frameCount : {type: "f", value: 4 },
                    transition : {type: "f", value: 0 }
                },
                vertexShader: ShaderLoader.get("blend_vs"),
                fragmentShader: ShaderLoader.get("blend_fs"),
                side:THREE.DoubleSide,
                transparent: true
            });
        /*
        exports.background = new THREE.ShaderMaterial(
        {
            uniforms: {

                texture: {type: "t", value: null},
                brightness: {type: "f", value: 1},
                saturation: {type: "f", value: 1},
                contrast: {type: "f", value: 1},
                alpha: {type: "f", value: 1},
                deltaUv: {type: "v2", value: stage3d.resolution }

            },
            vertexShader: ShaderLoader.get("background_vs"),
            fragmentShader: ShaderLoader.get("background_fs"),

            side:THREE.DoubleSide,
            transparent: false,
            depthWrite: true,
            depthTest: true
        });
        //*/
    };

    return exports;
}({});

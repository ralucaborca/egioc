var textures = function(exports)
{
    var tl = new THREE.TextureLoader();
    var cl = new THREE.CubeTextureLoader();

    exports.loadTexture = function( url, cb ){

        url = formatUrl( url );

        if( exports[ url ]  )
        {
            if( cb )cb( exports[url] );
            return exports[url];
        }
        exports[ url ] = null;
        tl.load( url, function(texture){

            exports[ url ] = texture;
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.needsUpdate = true;
            if( cb )cb( exports[url] );
        });
    };

    function formatUrl( url )
    {
        if( window.isIpad
        && url.lastIndexOf( "animation" ) == -1 ){
            //console.log( "url ", url );
            var bits = url.split('/');
            var file = bits[ bits.length - 1 ];
            bits.pop();
            bits.push( "half", file );
            url = bits.join('/');
            //console.log( "->", url )
        }
        return url;
    }

    exports.getTexture = function(url)
    {
        return exports[ formatUrl( url ) ];
    }


    /**
     var path = "img/cubemap/cube03_";
     var format = '.png';
     var urls = [
     path + '0' + format, path + '1' + format,
     path + '2' + format, path + '3' + format,
     path + '4' + format, path + '5' + format
     ];
     scope.setCubemap( "cubemap", urls );
     */

  
    exports.loadCubeTexture = function( name, urls, cb ){

        if( exports[ name ]  )
        {
            if( cb )cb( exports[name] );
            return exports[name];
        }
        exports[ name ] = null;
        cl.load( urls, function(texture){

            exports[ name ] = texture;

            texture.needsUpdate = true;
            if( cb )cb( exports[name] );

        });
    };

    exports.getCSSuvs = function( rules, textureSize ){
        var allRules = rules.split( '} ' );

        var uvs = [];
        allRules.forEach( function (r ){

            var values = r.match( /top:.*[0-9]*px;/i )[0].replace( /\s/, '').split( ";");

            var left = values.filter(function(s){return s.lastIndexOf("left")!=-1;})[0];

            var uv = {
                name: r.match(/.*\{/)[0].replace( /\s/, ''),
                size : textureSize,
                x: 0,
                y: 0,
                w: parseFloat( values[2].match( /[0-9]+/i ) ),
                h: parseFloat( values[3].match( /[0-9]+/i ) )   };

            //actual size
            //uv.width = uv.w;
            //uv.height = uv.h;

            var offsets = r.match( /background:.+;/i )[0].match( /[\-0-9]+/g );

            uv.x -= parseFloat( offsets[ 1 ] );
            uv.y -= parseFloat( offsets[ 2 ] );


            uv.name = uv.name.substr( 1, uv.name.length - 2 );
            uvs.push( uv );
            console.log( "{name:"+uv.name+", size:1024, x:"+uv.x+", y:"+ uv.y +", w:"+ uv.w +", h:"+ uv.h +"}," );
            //console.log( r, uv, offsets );

        });
        //console.log( uvs)
        return uvs;
        //*/
    };


    return exports;


}({});
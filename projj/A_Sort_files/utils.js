
//raf: https://github.com/cagosta/requestAnimationFrame/blob/master/app/requestAnimationFrame.js
(function(global) {(function() {if (global.requestAnimationFrame) {return;} if (global.webkitRequestAnimationFrame) {global.requestAnimationFrame = global[ 'webkitRequestAnimationFrame' ]; global.cancelAnimationFrame = global[ 'webkitCancelAnimationFrame' ] || global[ 'webkitCancelRequestAnimationFrame' ];} var lastTime = 0; global.requestAnimationFrame = function(callback) {var currTime = new Date().getTime(); var timeToCall = Math.max(0, 16 - (currTime - lastTime)); var id = global.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall); lastTime = currTime + timeToCall; return id;}; global.cancelAnimationFrame = function(id) {clearTimeout(id);};})(); if (typeof define === 'function') {define(function() {return global.requestAnimationFrame;});}})(window);

function lerp ( t, a, b ){ return a + t * ( b - a ); }
function norm( t, a, b ){return ( t - a ) / ( b - a );}
function map( t, a0, b0, a1, b1 ){ return lerp( norm( t, a0, b0 ), a1, b1 );}

var PI = Math.PI;
var PI2 = 2 * PI;
var RAD = PI / 180;

//query string
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var DEBUG = location.search.lastIndexOf("dev") != -1;// != null || getParameterByName("debug") !=null;
var SCENE = parseInt( getParameterByName("id") || getParameterByName("scene") );
SCENE = isNaN(SCENE)?0:SCENE;

function getDistance( a,b )
{
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt( dx*dx+dy*dy );
}
function getAngle( a,b )
{
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.atan2( dy, dx );
}
///////////////////////////

//returns a unit square plane with uvs described by x,y,w,h

function getPlaneBufferGeometry( x, y, w, h  )
{

    var v0 = new THREE.Vector3( -0.5,  0.5, 0 );
    var v1 = new THREE.Vector3(  0.5,  0.5, 0 );
    var v2 = new THREE.Vector3(  0.5, -0.5, 0 );
    var v3 = new THREE.Vector3( -0.5, -0.5, 0 );

    var geom = new THREE.BufferGeometry();
    geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([
        v0.x, v0.y, v0.z,//v0
        v1.x, v1.y, v1.z,//v1
        v2.x, v2.y, v2.z,//v2
        v0.x, v0.y, v0.z,//v0
        v2.x, v2.y, v2.z,//v2
        v3.x, v3.y, v3.z //v3
    ]), 3 ) );

    var uv0 = new THREE.Vector2( x, y );
    var uv1 = new THREE.Vector2( x+w, y );
    var uv2 = new THREE.Vector2( x+w, y+h );
    var uv3 = new THREE.Vector2( x, y+h );

    geom.addAttribute( 'uv', new THREE.BufferAttribute(  new Float32Array([
        uv0.x, 1 - uv0.y,
        uv1.x, 1 - uv1.y,
        uv2.x, 1 - uv2.y,
        uv0.x, 1 - uv0.y,
        uv2.x, 1 - uv2.y,
        uv3.x, 1 - uv3.y
    ]), 2 ) );

    return geom;
}


function scale(x,min,max,nuMin,nuMax){
    var nuX = nuMin - nuMax;
    nuX *= (x-min);
    nuX /= (max - min);
    nuX += nuMax;
    return nuX;
    
}

///////////////////////////
//DAT GUI
var gui = function(exports)
{
    exports.items = [];
    exports.init = function()
    {
        if( exports.GUI == null ) exports.GUI = new dat.GUI();
    };
    exports.add = function( name, obj, params, min, max )
    {
        if( exports.GUI == null )exports.init();
        if( obj == null )return;

        var f = exports.GUI.addFolder( name );

        params.forEach( function( p )
        {
            var delta = Math.abs( obj[p] ) * 10;
            if( delta == 0 )delta = 100;
            f.add( obj, p, min||-delta, max||delta).step(.01).onChange( function(v){ obj[p]=v; } );
        });
        f.open();
        exports.items.push( f );
        return f;
    };
    exports.clear = function()
    {
        if( exports.GUI ){
            exports.GUI.destroy();
            exports.GUI = null;
        }
    };
    return exports;
}({});
var Alfred = function( exports )
{

    var scene0, rtTexture0,
        scene1, rtTexture1;

    var tweening = false;
    var scenes;
    var transition;
    var _id = 0;
    var sceneCount = 9;

    exports.flag = true;

    exports.init = function( id, w,h, cb ){

        stage3d.init(w,h);
        materials.init();


        exports.last = {x:0,y:0};
        exports.mouse = {x:0,y:0};
        exports.screen = {x:0,y:0};

        transition = new Transition();
        rtTexture0 = new THREE.WebGLRenderTarget(stage3d.resolution.x, stage3d.resolution.y, {transparent:true, minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, antialias:true } );
        rtTexture1 = new THREE.WebGLRenderTarget(stage3d.resolution.x, stage3d.resolution.y, {transparent:true, minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, antialias:true } );

        //init all scenes
        scenes = [

            new S1_desk(),
            new S2_bag(),
            new S3_depart(),
            new S4_paysage(),
            new S5_jumelles(),
            new S6_beach(),
            new S7_room()

        ];
        exports.scenes = scenes;


        //load first scene
        _id = id || 0;

        exports.getSceneById( _id, true ).init( function()
        {
            exports.setSceneIndex( _id );

            stage3d.render( scene0, scene0.camera, rtTexture0 );
            stage3d.render( scene0, scene0.camera, rtTexture1 );

            if( cb )cb();

            //preload next
            exports.getSceneById( _id + 1 ).init();

        } );


    };


    //TODO temp
    exports.getSceneById = function( id, flip )
    {
        id %= sceneCount;

        var s;
        if( id < 2 )
        {
            s = exports.scenes[ id ];
        }
        else if( id == 2 )
        {
            s = exports.scenes[ 2 ];
            if( s.isFlipped() && Boolean( flip ) )s.flip();
        }
        else if( id == 3 )
        {
            s = exports.scenes[ 3 ];
            if( s.isFlipped() && Boolean( flip ) )s.flip();
        }
        else if( id == 4 )
        {
            s  = exports.scenes[ 4 ];
        }
        else if( id == 5 ) {

            s  = exports.scenes[ 5 ];
        }
        else if( id == 6 )
        {
            s = exports.scenes[ 3 ];
            if( !s.isFlipped() && Boolean( flip ) )s.flip();
        }
        else if( id == 7 )
        {
            s = exports.scenes[ 2 ];
            if( !s.isFlipped() && Boolean( flip ) )s.flip();
        }
        else if( id == 8 )
        {
            s = exports.scenes[ 6 ];
        }

        return s;
    };

    exports.setSceneIndex = function(id){

        gui.clear();
        scene0 = exports.getSceneById( id,false );
        scene0.setTime(0);
        return scene0;
    };

    exports.setSceneTime = function( t ){
        scene0.setTime( t );
    };

    exports.nextScene = function( duration, cb ){

        window.audioAPI.stopLoop('popup');
        window.audioAPI.stopAll();

        if(_id==0)window.audioAPI.goTo(1);
        if(_id==1)window.audioAPI.goTo(2);
        if(_id==2)window.audioAPI.goTo(3);
        if(_id==3)window.audioAPI.goTo(4);
        if(_id==4)window.audioAPI.goTo(5);
        if(_id==5)window.audioAPI.goTo(6);
        if(_id==6 && this.flag)window.audioAPI.goTo(7);
        if(_id==6 && !this.flag)window.audioAPI.goTo(8);
        if(_id==7)window.audioAPI.goTo(9);
        if(_id==8)window.audioAPI.goTo(10);

        if(_id == 8){
            if(this.flag){
                Nav.open('end');
                Nav.appearTextEnd();
                return;
            }
            else{
                this.flag = true;
            }
        }
        if(_id == 1 || _id == 6 & !this.flag){
            window.audioAPI.playLoop('moteur');
        }
        else{
            window.audioAPI.stopLoop('moteur');
        }
        if(_id == 3){
            Nav.flash(0,3000);
            //setTimeout(function(){Nav.open('jumelles')},100);
            
        }
        else{
            //Nav.close('jumelles');
        }
        if(_id == 6){
            if(this.flag){
                
                Nav.openPostcard();
                return;
            }
            else{
                this.flag = true;
            }
        }

        if( tweening )return;
        tweening = true;

        exports.uiRatios = UI.ratios[ _id ];

        _id++;
        _id %= sceneCount;
        // console.log(_id);
        // if(_id == 0 || _id == 1 || _id == 2 || _id == 3 || _id == 4 || _id == 5){
        //         window.audioAPI.goTo(_id);
        // }
        

        setTimeout(function(){

            scene0.setTime(1);
            scene1 = exports.getSceneById( _id % sceneCount, true );
            scene1.setTime(0);

            //preload next
            if( !exports.getSceneById( ( _id + 1 ) % sceneCount, false ).loaded ){
                
                exports.getSceneById( ( _id + 1 ) % sceneCount, false ).init();
            }

            exports.time = 0;
            TweenMax.to( exports, duration || 2.5,
            {
                time : 1,
                onUpdate:function()
                {
                    UI.ratio = 0;
                    exports.transition( exports.time, _id );
                },
                onComplete : function()
                {
                    UI.ratio = 0;
                    scene0 = scene1;
                    tweening = false;
                    exports.update();
                    if( cb )cb( _id );
                }

            } );

        },100);
        


    };

    

    exports.resize = function( width, height )
    {
        stage3d.resize(width, height);

        rtTexture0.setSize(stage3d.resolution.x, stage3d.resolution.y );
        rtTexture1.setSize(stage3d.resolution.x, stage3d.resolution.y );

        scenes.forEach( function( s ){ s.updateAspectRatio(); } );

    };

    exports.transition = function( t )
    {

        //if( _id == 3 || _id == 8 )//car -> offsreen
        //{
        //    scene0.time += exports.time;
        //}
        scene0.update(exports.mouse);
        stage3d.render( scene0, scene0.camera, rtTexture0 );

        scene1.update(exports.mouse);
        stage3d.render( scene1, scene1.camera, rtTexture1 );

        transition.setTextures( rtTexture0, rtTexture1 );

        //TODO décider si on garde
        //var flash = _id == 4;
        var flash = false;
        transition.setTime( t, flash );

        stage3d.render( transition.scene, transition.camera );

    };

    exports.update = function(){

        if( tweening )return;

        if( !scene0.loaded )return;

        var render = scene0.update( exports.mouse );
        if( render ) stage3d.render( scene0, scene0.camera );

    };

    return exports;

}({});
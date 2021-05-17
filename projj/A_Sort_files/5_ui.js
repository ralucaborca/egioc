//a priori c'est une classe statique ...
var UI = function( exports ){

    var goalReached;
    var paper, size;

    var line,
        lineStart   = {x:0, y:0, ratioX:0, ratioY:0},
        lineEnd     = {x:0, y:0, ratioX:0, ratioY:0};

    var start, goal, cursor, ratioRadius;
    var currentId;

    /*
    stocke les ratios pour chaque scene:

        lx0 : ratio de la taille écran en X du début de la ligne
        ly0 : ratio de la taille écran en Y du début de la ligne

        lx1 : ratio de la taille écran en X de la fin de la ligne
        ly1 : ratio de la taille écran en Y de la fin de la ligne

        s: ratio de start le long de la ligne
        g: ratio de goal le long de la ligne

    */
    var ratios = [

        {   lx0: 0.33, ly0:0, lx1: 0.50, ly1:1, s:0.25, g:0.75 },//desk
        {   lx0: 0, ly0:1, lx1: 0.80, ly1:0, s:0.25, g:0.75 },//bag
        {   lx0: 0, ly0:0.90, lx1: 1, ly1:0.40, s:0.25, g:0.75 },//depart
        {   lx0: 0.85, ly0:0.60, lx1: 0.30, ly1:0, s:0.05, g:0.75},//paysage
        {   lx0: 0.90, ly0:0, lx1: 0.50, ly1:1, s:0.25, g:0.75},//jumelles
        {   lx0: 0, ly0:0.80, lx1: 1, ly1:0.60, s:0.25, g:0.75 },//beach
        {   lx0: 0.25, ly0:1, lx1: 0.40, ly1:0, s:0.25, g:0.75},//paysage retour
        {   lx0: 1, ly0:0.60, lx1: 0, ly1:0.85, s:0.25, g:0.75},//voiture retour
        {   lx0: 0.75, ly0:0, lx1: 0.55, ly1:1, s:0.25, g:0.75 },//chambre

    ];

    var instructions = {
        start:'DRAG\nTHIS',
        goal:'DROP\nHERE'
    }

    exports.init = function( w,h, onGoalReached) {

        paper = Raphael(0, 0, w, h);
        size = {w: w, h: h};
        goalReached = onGoalReached;

        //rend disponible pour la transition
        exports.ratios = ratios;

    };

    exports.resize = function(w,h){

        if(paper)paper.setSize(w,h);
        if(paper)paper.clear();
        size.w = w;
        size.h = h;
        reset();
    };

    exports.setScene = function( id )
    {
        id = id || 0;
        id %= ratios.length;
        currentId = id;
        //remove listeners (in case...)
        if( cursor ){
            cursor.undrag();
            cursor.unhover();
        }

        lineStart.ratioX = ratios[ id].lx0;
        lineStart.ratioY = ratios[ id].ly0;

        lineEnd.ratioX = ratios[ id].lx1;
        lineEnd.ratioY = ratios[ id].ly1;

        start   = {ratio:ratios[id].s, radius: 0 };
        cursor  = {ratio:ratios[id].s, radius: 40 };
        goal    = {ratio:ratios[id].g, radius: 8 };

        reset();
    };


   


    /////////////////////////////////////////
    //private
    /////////////////////////////////////////

    ///utils
    function reset()
    {


        //variable normalisée entre start et goal
        exports.ratio = 0;

        paper.clear();

        //compute & draw line
        lineStart.x    = parseInt( lineStart.ratioX * size.w );
        lineStart.y    = parseInt( lineStart.ratioY * size.h );

        lineEnd.x      = parseInt( lineEnd.ratioX * size.w );
        lineEnd.y      = parseInt( lineEnd.ratioY * size.h );

        var lengthLine = Math.sqrt(Math.pow(lineStart.x - lineEnd.x,2) + Math.pow(lineStart.y - lineEnd.y,2));
        ratioRadius = (70 * 0.75)/lengthLine;

        line = paper.path(" M"+ getPosAlongPath(start.ratio+ratioRadius).x+","+getPosAlongPath(start.ratio+ratioRadius).y + " L" + lineEnd.x+","+lineEnd.y).attr({
            'stroke-width':'3',
            'stroke':"white",
            'stroke-dasharray': '. ',
            'stroke-linecap': 'round'
        });

        //compute & draw points
        goal   = drawCircle( goal, {'fill':'white','stroke':'transparent'} );
        text = drawText(cursor,instructions.start,{'fill':'white','font-weight':'600'});
        start  = drawCircle( start,{'fill':'white','stroke':'transparent'});
        cursor = drawCircle( cursor, {'fill':'white','fill-opacity':0,'stroke':'white','stroke-width':4});
        

     // $('path').attr('clip-path','url(#cut-off-bottom)');

        cursor.drag( move, drag, up );

        cursor.hover( function(){
            this.attr( {cursor: "pointer"} );
        } );

        cursor.unhover( function(){
            this.attr( {cursor: ""} );
        } );

    }

    function drawText (pos,text,attr) {
        

        return paper.text(getPosAlongPath(pos.ratio).x,getPosAlongPath(pos.ratio).y,text).attr(attr);

    }

    function redrawLine (x,y){
        var nuRatio = scale(exports.ratio,0,1,ratios[currentId].s,ratios[currentId].g);
        
        //nuRatio = 0.75 - nuRatio + 0.25;
        //console.log(nuRatio);
         
        var _transformedPath = Raphael.transformPath(" M"+ x +","+ y + " L" + lineEnd.x+","+lineEnd.y);
        line.animate({path:_transformedPath},0);
    }

    /// la copie des paramètres ratio et radius ... moué...
    function drawCircle( circle,attr) {

        var ratio = circle.ratio;
        var radius = circle.radius;
        var pos = getPosAlongPath( circle.ratio );
        circle = paper.circle(pos.x,pos.y, circle.radius ).attr(attr);
        circle.ratio = ratio;
        circle.radius = radius;
        circle.x = pos.x;
        circle.y = pos.y;
        return circle;

    }

    function getPosAlongPath(ratio){

        return {x : lerp( ratio, lineStart.x, lineEnd.x ),
                y : lerp( ratio, lineStart.y, lineEnd.y ) };

    }

    function project( p, a, b, asSegment )
    {

        var A = p.x - a.x;
        var B = p.y - a.y;
        var C = b.x - a.x;
        var D = b.y - a.y;

        var dot = A * C + B * D;
        var len = C * C + D * D;
        var t = dot / len;

        if( Boolean( asSegment ) )
        {
            if( t < 0 ) return a;
            if( t > 1 ) return b;
        }
        return {x:a.x + t * C, y:a.y + t * D };

    }
    function distance(a,b)
    {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return (dx*dx+dy*dy);
    }

    function checkDestination(){

        if(exports.ratio >= 1){
            text.attr('text',instructions.goal);
            goal.animate({'r':cursor.radius*0.85},150);
            goal.animate({'fill':'black'},150);
        }
        else{
            text.attr('text',instructions.start);
            goal.animate({'r':goal.radius},150);
            goal.animate({'fill':'white'},150);
        }
    }

    //interaction handlers: http://stackoverflow.com/questions/4224359/making-paths-and-images-dragable-in-raphael-js
    function drag(x,y) {
        exports.isDragging = true;
        this.ox = x;// => this.attr('cx');
        this.oy = y;// => this.attr('cy');
        this.animate({"stroke-width": 5,'r':cursor.radius*0.85}, 150);
         redrawLine(lerp( exports.ratio+ratioRadius, start.x, goal.x ),lerp( exports.ratio+ratioRadius, start.y, goal.y ));
    }

    function move(dx, dy) {

        var tmp = {
            x : this.ox + dx,
            y : this.oy + dy
        };
        var pp = project( tmp, start, goal, true );
        this.attr( { cx:pp.x, cy:pp.y } );
        text.attr( { x:pp.x, y:pp.y } )
        checkDestination();
        redrawLine(pp.x,pp.y);
        exports.ratio = distance( pp, start ) / distance( start, goal );//norm( pp.x, start.x, goal.x );

        
    }
    function up() {
        exports.isDragging = false;
        this.animate({"stroke-width": 4,'r':cursor.radius}, 150);
        if( exports.ratio < 1 )
        {
            TweenMax.to( exports, .15, { ratio : 0, onUpdate: function(){

                cursor.attr( {
                    cx:lerp( exports.ratio, start.x, goal.x ),
                    cy:lerp( exports.ratio, start.y, goal.y )
                } );
                text.attr( {
                    x:lerp( exports.ratio, start.x, goal.x ),
                    y:lerp( exports.ratio, start.y, goal.y )
                } )
                var nuRatio = 1 - scale(exports.ratio,0,1,ratios[currentId].s,ratios[currentId].g);
                redrawLine(getPosAlongPath(nuRatio+ratioRadius).x,getPosAlongPath(nuRatio+ratioRadius).y);
           
            },
            onComplete:function(){

            }
            } );
        }
        else
        {
            cursor.undrag();
            cursor.unhover();

//            paper.clear();
            cursor.animate( {r:0}, 500,function(){
                line.animate( { "stroke-opacity": 0.0 }, 500,function(){
                    if( goalReached )
                    {
                        
                        goalReached();
                    }
                });
            });
            goal.animate({r:0},500);
            text.animate({'transform':'0s 0 0'},500);
            
            


        }
    }



    return exports;
}({});

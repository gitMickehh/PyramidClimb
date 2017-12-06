
var x =0 ;
var y =0 ;

var lastX=0;

var row =200;

var max  ;
var min ;

function generateLevel () {
    
    
   max =(game.world.width) - (wallWidthToScale) - (214*gameScale * 2) ;
   min = wallWidthToScale + ((214 * gameScale) / 2);
    
     game.time.events.repeat(Phaser.Timer.SECOND * 3, 40, createFuel, this);
     game.time.events.repeat(Phaser.Timer.SECOND * 4, 40, createSheild, this);
     game.time.events.repeat(Phaser.Timer.SECOND * 1, 40, createEnemy ,this);
    

       }

function generateX(){
    //console.log(game.world.x);
   // x=0;
    x =Math.floor(Math.random() * max) + min;
   
    
    if(Math.abs(x-lastX)<200 && lastX+200>max){
       x-=200;
       if (x<min){
           x+=(min-x);
           }
       }
    
     else if(Math.abs(x-lastX)<200 && lastX-200<100){
       x+=200;
       if (x>max){
           x-=(x-max);
           }
       }
    lastX=x;
    return x;
}

function generateY (){
    
    row +=100;
    y=row;
    
   
    return y;
}



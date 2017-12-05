console.log("main.js is running");

var game = new Phaser.Game(800, 750, Phaser.AUTO, 'game-div', {
    preload: preload,
    create: create,
    update: update
});

var random;

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('wall', 'assets/wallPH.png');
    game.load.image('enm1', 'assets/enemyPH.png');
    game.load.image('fuel', 'assets/FuelPH.png');
    game.load.image('shield', 'assets/NIMage.png');
    game.load.image('player', 'assets/playerPH.png');
    game.load.image('playerSeat', 'assets/FirstLevelSeat.png');

    //font
    game.load.bitmapFont('fonti', 'assets/desyrel.png', 'assets/desyrel.xml');

    //audio
    game.load.audio('torn', 'assets/audio/TORN - Groove.mp3');

    //physics
    //game.load.physics("sprite_physics", "assets/json/sprite_physics.json");
    var seed = Date.now();
    random = new Phaser.RandomDataGenerator([seed]);
}

//audio
var music;

//level mods
var startGame = false;
var speedOfLevel = 0; //change to (5)     when startGame is true when the player makes the first click
var constSpeed = 6;                 //constant speed to change in code
var gameScale = 0.3;
var wallWidthToScale = 214 * gameScale;
var wallHeightToScale = 1371 * gameScale;

//game objects
var repeatingPlatforms;
var enemies;
var items;
//var horizontalPlatforms;
var pSeat;
var seatIsHere = true;

//rope
var ropeBitmapData;
var clickedWall;

//player
var player; //player object
var ropeCounter = 6; //number of ropes the player starts with
var shieldOn = false; //a boolean that flags if the shield is on or off

var winLevel = false; //a boolean that flags if the player has won
var score = 0; //player starting score

//text
var scareTXT;
var ropeTXT;

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1000;
    game.add.sprite(0, 0, 'sky');

    //The platforms group contains the ground and the 2 ledges we can jump on
    repeatingPlatforms = game.add.group();
    game.physics.p2.enable(repeatingPlatforms, false);
    
    createOpWalls(-wallHeightToScale);
    createOpWalls(0);
    createOpWalls(wallHeightToScale);
    createOpWalls(wallHeightToScale * 2);

    //enabling p2 the rope
    game.physics.p2.enable(clickedWall, true);

    //createPlayer
    createPlayer(400);

    //createSeat
    createSeat();

    //enemy creation
    enemies = game.add.group();
    //enemies.enableBody = true;
    game.physics.p2.enable(enemies, false);
    
    //items creation
    items = game.add.group();
    //items.enableBody = true;
    game.physics.p2.enable(items, false);

    //leveldesign
    //generateLevel();
    createEnemy(300, 420);
    createEnemy(120, 100);
    createEnemy(450, 0);
    createEnemy(340, 600);
    createEnemy(160, -80);
    createEnemy(160, 1300);

    createFuel(250, 790);
    createSheild(120, 860);
    createSheild(120, 960);

    //creating the rope
    createRope(player.body.x, player.body.y);

    //player interactions
    
    game.physics.p2.setImpactEvents(true);
    
    //audio
    music = game.add.audio('torn');
    music.play();

    //text
    scareTXT = game.add.bitmapText(wallWidthToScale + 20, 30, 'fonti', 'Score '+score, 50);
    ropeTXT = game.add.bitmapText(game.world.width - wallWidthToScale-200, 20,'fonti','Ropes '+ropeCounter, 50);
}

function update() {
    
    //for intro
    if (seatIsHere) {
        updateSeat();
    }
    
    propagateWalls();
    updateEnemies();
    updateItems();
    drawRope();
    
    

}

//collision check and score and rope systems

function hitEnemy(body1, body2)
{
    console.log("hit enemy");
    
    if(shieldOn){
        console.log("you get a chance");
        shieldOn = !shieldOn;
}    else
        console.log("you lose");
}

function hitShield(body1, body2)
{
    console.log("hit Shield");
    shieldOn = true;

    //body1.removeCollisionGroup();
    body1.clearShapes();
    var ind = items.getChildIndex(body1.sprite);
    console.log(body1 + ", " + ind);
    items.children.splice(ind,1);

}

function hitFuel(body1, body2)
{
    console.log("hit Fuel");
    ropeCounter += 5;
 
    ropeTXT.text = "Ropes " + ropeCounter;   
    console.log("ropes " + ropeCounter);
        
    //body1.removeCollisionGroup();
    body1.clearShapes();
    var ind = items.getChildIndex(body1.sprite);
    items.children.splice(ind,1);
    
    
}
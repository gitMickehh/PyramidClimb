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
    game.load.audio('hitWall', 'assets/audio/hitWall.mp3');
    game.load.audio('drawLine', 'assets/audio/LineDraw.mp3');
    game.load.audio('collectItem', 'assets/audio/itemCollect.mp3');

    //physics
    //game.load.physics("sprite_physics", "assets/json/sprite_physics.json");
    var seed = Date.now();
    random = new Phaser.RandomDataGenerator([seed]);
}

//audio
var music;
var soundHitWall;
var soundDrawLine;
var soundCollect;

//world bounds?
//var customBounds;
//use a collider at the edge of the screen at the bottom for triggering you lose.
//var invisibleLand;

//level mods
var startGame = false;
var speedOfLevel = 0; //change to (5)     when startGame is true when the player makes the first click
var constSpeed = 6; //constant speed to change in code
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
var ropeCounter = 10; //number of ropes the player starts with
var shieldOn = false; //a boolean that flags if the shield is on or off

var loseFlag = false; //a boolean that flags if the player has won
var score = 0; //player starting score


//pause
var pause;
var pauseFlag = false;

//text
var scareTXT;
var ropeTXT;
var youLoseTXT;
var pauseTXT;



function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1000;
    game.add.sprite(0, 0, 'sky');

    //phaser bounds
    var bounds = new Phaser.Rectangle(-30, 0, game.world.width + 30, game.world.height + 65);
    
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
    generateLevel();
//    createEnemy(300, 420);
//    createEnemy(120, 100);
//    createEnemy(450, 0);
//    createEnemy(340, 600);
//    createEnemy(160, -80);
//    createEnemy(160, 1300);
//    createFuel(250, 790);
//    createSheild(120, 860);
//    createSheild(120, 960);

    //creating the rope
    createRope(player.body.x, player.body.y);

    //player interactions / events
    game.physics.p2.setImpactEvents(true);

    //audio
    music = game.add.audio('torn');
    music.play();

    //sound effects
    soundHitWall = game.add.audio('hitWall');
    soundDrawLine = game.add.audio('drawLine');
    soundCollect = game.add.audio('collectItem');

    //text
    scoreTXT = game.add.bitmapText(wallWidthToScale + 20, 30, 'fonti', 'Score ' + score, 50);
    ropeTXT = game.add.bitmapText(game.world.width - wallWidthToScale - 200, 20, 'fonti', 'Ropes ' + ropeCounter, 50);
    
    //invisible wall
    //	Create our bitmapData which we'll use as a Sprite texture
	var bmd = game.add.bitmapData(game.world.width,2);

	//	Fill it
    var grd = bmd.context.createLinearGradient(0, 0, 0, 32);

    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    bmd.context.fillStyle = grd;
    bmd.context.fillRect(0, 0, 800, 800);

    //Put the bitmapData into the cache
    game.cache.addBitmapData('blueShade', bmd);
    
    //This one is just for reference (next to the instructions text)
    createLand();
    
    //pause
    pause = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    pause.onDown.add(PAUSE, this);
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

    if (!loseFlag) {
        updateScore();
    }


}

//collision check and score and rope systems

function hitEnemy(body1, body2) {
    console.log("hit enemy");

    if (shieldOn) {
        console.log("you get a chance");
        shieldOn = !shieldOn;
    } else {
        console.log("you lose");
        loseFlag = true;
        speedOfLevel = 0;
        youLoseTXT = game.add.bitmapText(game.world.width / 2, game.world.height / 2, "fonti", "You lose!", 100);
        youLoseTXT.anchor.x = 0.5
        youLoseTXT.anchor.y = 0.5
    }
}

function hitShield(body1, body2) {
    console.log("hit Shield");
    shieldOn = true;

    //body1.removeCollisionGroup();
    body1.clearShapes();
    var ind = items.getChildIndex(body1.sprite);
    console.log(body1 + ", " + ind);
    items.children.splice(ind, 1);

    soundCollect.play();
}

function hitFuel(body1, body2) {
    console.log("hit Fuel");
    ropeCounter += 5;

    ropeTXT.text = "Ropes " + ropeCounter;
    console.log("ropes " + ropeCounter);

    //body1.removeCollisionGroup();
    body1.clearShapes();
    var ind = items.getChildIndex(body1.sprite);
    items.children.splice(ind, 1);

    soundCollect.play();
}

function hitWall(body1, body2) {

    soundHitWall.play();
}


function updateScore() {
    score += speedOfLevel / 5;

    score = Math.round(score);
    //text update
    scoreTXT.text = "Score " + score;
}

//pause function
function PAUSE () {
    
    if(game.paused)
    {
        pauseTXT.text="";
        game.paused = false;
        pauseFlag = false;
    }
    else{
        game.paused = true;
        pauseTXT = game.add.bitmapText(game.world.width / 2, game.world.height / 2,'fonti','Press ESC to continue', 60);
        pauseTXT.anchor.x = 0.5;
        pauseTXT.anchor.y = 0.5;
        pauseFlag = true;
    }
}

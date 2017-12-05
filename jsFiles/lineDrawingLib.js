var rope;
var ropeAnchorX;
var ropeAnchorY;
var line;

var firstRopeFlag = false;

function changeRope(sprite, pointer) {

    if(!startGame)
        {
            speedOfLevel = constSpeed;
        }
    if (ropeCounter <= 0) {
        console.log("out of ropes");

        //play a sound
    } else {

        ropeCounter--;
        firstRopeFlag = true;
        clickedWall = sprite;

        
        
        //Remove last spring
        game.physics.p2.removeSpring(rope);
        //console.log("clicked wall " + clickedWall);

        //Create new spring at pointer x and y
        rope = game.physics.p2.createSpring(clickedWall, player, 80, 15, 6, [-pointer.x, -pointer.y]);
        ropeAnchorX = pointer.x;
        ropeAnchorY = pointer.y

        //play a sound

    } //end else
}

function createRope(x, y) {

    //debugger;
    // Add bitmap data to draw the rope
    ropeBitmapData = game.add.bitmapData(game.world.width, game.world.height);

    ropeBitmapData.ctx.beginPath();
    ropeBitmapData.ctx.lineWidth = "4";
    ropeBitmapData.ctx.strokeStyle = "#000000";
    ropeBitmapData.ctx.stroke();



    // Create a new sprite using the bitmap data
    line = game.add.sprite(0, 0, ropeBitmapData);

    // Keep track of where the rope is anchored
    ropeAnchorX = (player.body.x);
    ropeAnchorY = (clickedWall.y + wallHeightToScale);

    // Create a spring between the player and block to act as the rope
    rope = game.physics.p2.createSpring(
        clickedWall, // sprite 1
        player, // sprite 2
        100, // length of the rope
        10, // stiffness
        3, // damping
        [-(clickedWall.x + 500), -(clickedWall.world.y + clickedWall.height)]
    );

    // Draw a line from the player to the block to visually represent the spring
    line = new Phaser.Line(player.x, player.y,
        (clickedWall.world.x + 500), (clickedWall.world.y + clickedWall.height));

    game.physics.p2.removeSpring(rope);
}

function drawRope() {


    if (firstRopeFlag) {
        ropeAnchorY += speedOfLevel;
        ropeBitmapData.clear();
        if (ropeAnchorY >= game.world.height) {
            game.physics.p2.removeSpring(rope);
            firstRopeFlag = false;
        } else {

            // Change the bitmap data to reflect the new rope position
            ropeBitmapData.ctx.beginPath();
            ropeBitmapData.ctx.beginPath();
            ropeBitmapData.ctx.moveTo(player.x, player.y);
            ropeBitmapData.ctx.lineTo(ropeAnchorX, ropeAnchorY);
            ropeBitmapData.ctx.lineWidth = 4;
            ropeBitmapData.ctx.stroke();
            ropeBitmapData.ctx.closePath();
            ropeBitmapData.render();
            
            //text update
            ropeTXT.text = "Ropes " + ropeCounter;
        }
    }
}

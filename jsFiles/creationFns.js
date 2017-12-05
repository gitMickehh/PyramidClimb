//creating objects

//create player
function createPlayer(x) {
    player = game.add.sprite(x, 300, 'player');
    player.scale.setTo(gameScale, gameScale);

    //error causing
    game.physics.p2.enable(player, false);
    //player.body.collideWorldBounds = false;
    
    //player.body.clearShapes();
    //player.body.loadPolygon("sprite_physics", "player");

}

//creates enemy at specific X and afterLoop is when the enemy shows up after n of loops. 0 means at the top when the game starts.
function createEnemy(x, negativeY) {
    var enemy = enemies.create(x, -negativeY, 'enm1');
    enemy.scale.setTo(gameScale, gameScale);
    //enemy.body.immovable = true;

    game.physics.p2.enable(enemy, false);
    enemy.body.static = true;

    enemy.body.createBodyCallback(player, hitEnemy, this);
}

//creates shield at X and Y
function createSheild(x, negativeY) {
    
    var item = items.create(x, -negativeY, 'shield');
    item.scale.setTo(gameScale, gameScale);
    //item.body.immovable = true;    
    game.physics.p2.enable(item, false);
    item.body.setCircle(30);
    item.body.static = true;

    item.body.createBodyCallback(player, hitShield, this);

}

//creates shield at X and Y
function createFuel(x, negativeY) {
    
    var item = items.create(x, -negativeY, 'fuel');
    item.scale.setTo(gameScale, gameScale);
    //item.body.immovable = true;
    game.physics.p2.enable(item, false);
    item.body.setCircle(30);
    item.body.static = true;

    item.body.createBodyCallback(player, hitFuel, this);

}

function createSeat() {
    pSeat = game.add.sprite(400, 600, 'playerSeat');
    pSeat.scale.setTo(gameScale, gameScale);
    pSeat.anchor.setTo(0.5, 0.5);

    game.physics.p2.enable(pSeat, false);
    pSeat.body.static = true;
}

//create opposite walls only give the value of Y and it does the rest
function createOpWalls(y) {
    var walls = repeatingPlatforms.create(0 + wallWidthToScale / 2, y, 'wall');
    walls.scale.setTo(gameScale, gameScale);

    game.physics.p2.enable(walls, false);
    //walls.anchor.setTo(0,0);
    walls.body.static = true;


    //walls.body.immovable = true;


    clickedWall = walls;

    var walls2 = repeatingPlatforms.create(game.world.width - wallWidthToScale + wallWidthToScale / 2, y, 'wall');
    walls2.scale.setTo(gameScale, gameScale);

    game.physics.p2.enable(walls2, false);

    //walls2.anchor.setTo(0,0);
    walls2.body.static = true;

    //walls2.body.immovable = true;

    walls.inputEnabled = true;
    walls.events.onInputDown.add(changeRope, this);
    walls2.inputEnabled = true;
    walls2.events.onInputDown.add(changeRope, this);
    

    //walls.body.createBodyCallback(player, hitWall, this);
    //walls2.body.createBodyCallback(player, hitWall, this);
}

//updating the objects
function updateEnemies() {
    for (let i = 0; i < enemies.children.length; i++) {
        if (enemies.children[i].body.y >= game.world.height) {
            //destroy child
            console.log("destroy enemy " + i);
            enemies.children[i].body.destroy();
            enemies.children.splice(i, 1);
        } else {
            //console.log("yup");
            enemies.children[i].body.y += speedOfLevel;

        }
    }
}

function updateItems() {
    for (let i = 0; i < items.children.length; i++) {
        if (items.children[i].body.y >= game.world.height) {
            //destroy child
            console.log("destroy item " + i);
            items.children[i].body.destroy();
            items.children.splice(i, 1);
        } else {
            //console.log("yup");
            items.children[i].body.y += speedOfLevel;

        }
    }
}

function propagateWalls() {

    var oneBefore = 8; //index of the one
    for (let j = 0; j < 8; j += 2) {

        repeatingPlatforms.children[j].body.static = true;
        repeatingPlatforms.children[j + 1].body.static = true;

        if (repeatingPlatforms.children[j].body.y - wallHeightToScale / 2 >= game.world.height) {
            //ask about the Y of the one after you
            if (j == 6) {
                oneBefore = 0;
            } else if (j == 0) {
                oneBefore = 2;
            } else {
                oneBefore = j + 2;
            }

            repeatingPlatforms.children[j].body.y = (-wallHeightToScale + repeatingPlatforms.children[oneBefore].body.y);
            repeatingPlatforms.children[j + 1].body.y = (-wallHeightToScale + repeatingPlatforms.children[oneBefore].body.y);

            console.log("changed y of " + j + ", " + j + 1 + " to " + (-wallHeightToScale + repeatingPlatforms.children[oneBefore].body.y));

        } else {
            repeatingPlatforms.children[j].body.y += speedOfLevel;
            repeatingPlatforms.children[j + 1].body.y += speedOfLevel;
        }
    } //end of for loop
}

function updateSeat() {

    if (pSeat.y - (pSeat.height / 2) >= game.world.height) {
        //destroy child
        console.log("destroy seat");
        pSeat.destroy();
        seatIsHere = false;
    } else {
        pSeat.body.y += speedOfLevel;
    }
}

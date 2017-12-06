let x = 0;
let y = 0;

let lastX = 0;
let row = 200;

function generateLevel() {



    game.time.events.repeat(Phaser.Timer.SECOND * 3, 40, createFuel, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 4, 40, createSheild, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 1, 40, createEnemy, this);


}

function generateX() {
    //max 580
    //min 80
    
    x = 0;
    x = Math.floor(Math.random() * 580) + 80;

    if (Math.abs(x - lastX) < 200 && lastX + 200 > 580) {
        x -= 200;
        if (x < 80) {
            x += (80 - x);
        }
    } else if (Math.abs(x - lastX) < 200 && lastX - 200 < 100) {
        x += 200;
        if (x > 580) {
            x -= (x - 580);
        }
    }
    lastX = x;
    return x;
}

function generateY() {

    row += 100;
    y = row;


    return y;
}

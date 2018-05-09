// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    speed > 0 ? this.sprite = 'images/enemy-bug.png' : this.sprite = 'images/enemy-bug-flip.png';

    // Set the initial location of the enemies;
    this.x = x;
    this.y = y;

    // Set the speed of the enemies;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Update enemies location and check if it is going out of canvas.
    if (this.speed > 0) {
        this.x > 505 ? this.x = -101 : this.x += (dt * this.speed);
    } else {
        this.x < -101 ? this.x = 505 : this.x += (dt * this.speed);
    }

    // Check enemies location with player location.
    let checkY = player.y === this.y + 7;
    let checkX = player.x < this.x + 65 && player.x + 65 > this.x;

    // Check if the enemies colide with the player.
    if (checkY && checkX) {
        player.die();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(x, y) {
    // Player's drawing image.
    this.sprite = 'images/char-boy.png';

    // Initial player's location
    this.x = x;
    this.y = y;

    // Player's lives.
    this.lives = 3;

    // Player's score.
    this.score = 0;
}

Player.prototype.update = function() {
    this.updateScore(1);
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(allowedKeyes) {
    switch (allowedKeyes) {
        case 'up':
            this.y < 0 ? this.y = this.y : this.y -= 83;
            break;
        case 'down':
            this.y > 400 ? this.y = this.y : this.y += 83;
            break;
        case 'right':
            this.x > 400 ? this.x = this.x : this.x += 101;
            break;
        case 'left':
            this.x < 100 ? this.x = this.x : this.x -= 101;
            break;
    }
}

// A function to run when the player comes in collision with enemies.
Player.prototype.die = function() {
    // Check player's lives.
    if (this.lives > 0) {
        // Reduce player's lives.
        this.lives--;

        // Return player to starting position.
        this.x = 202;
        this.y = 321;
    } else {
        // Reset the game.
        // reset();
    }
}

// Update player's score based on his location.
Player.prototype.updateScore = function(amount) {
    let timer;
    // If player gets to the water.
    if (this.y === -11) {
        // Increase player's score.
        this.score += amount;

        // Return player to starting position after 0.1 seconds.
        timer = setTimeout(() => {
            this.x = 202;
            this.y = 321;

            clearTimeout(timer);
        }, 100);

        // Increase player's horizontal position to avoid score bug increase.
        this.y++;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [];

// Create 3 new enemies in each row.
(function() {
    let enemyY = -18,
        startingX = 0,
        speed = 101;
    for (let x = 3; x > 0; x--) {
        let newEnemy = new Enemy(startingX, enemyY += 83, (Math.random() * (4-1) + 1) * speed);

        switch (x) {
            case 3:
                startingX = 504;
                speed *= -1;
                break;
            case 2:
                startingX = 0;
                speed *= -1;
        }

        allEnemies.push(newEnemy);
    }
})();

player = new Player(202, 321);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

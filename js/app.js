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

// Change the enemies speed and their direction.
Enemy.prototype.changeSpeed = function() {
    // Get a random number to change the enemies direction.
    let changeDir = Math.floor(Math.random() * (3-1) + 1);

    // If the random number was 1 the enemies have the same direction.
    // Else their direction will change to negative.
    // Also increase the enemies speed by 10%.
    changeDir === 1 ? this.speed *= 1.10 : this.speed *= -1.10;

    // Check if the enemies need to change their sprite.
    this.speed > 0 ? this.sprite = 'images/enemy-bug.png' : this.sprite = 'images/enemy-bug-flip.png';
}

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

    // Player's lives and score.
    this.lives = 3;
    this.score = 0;

    // Score amount to be added when getting to the water.
    this.amount = 10;

    // Check if the player is active.
    this.isActive = false;

    // Check if player died in order to make a red screen effect.
    this.hasDied = false;
}

Player.prototype.update = function() {
    this.updateScore();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Draw a red screen when player dies.
    if (this.hasDied) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(0, 50, 505, 535);
        ctx.restore();
        // Clear the red screen after 50ms.
        setTimeout(() => this.hasDied = false, 50);
    }
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
    // Reduce player's lives.
    this.lives--;
    // Update scoreboard.
    scoreboard.update();

    // Return player to starting position.
    this.x = 202;
    this.y = 321;

    // Set hasDied to true in order to draw a red screen.
    this.hasDied = true;

    if (this.lives === 0) {
        // Make player unable to move.
        this.isActive = false;

        // Show the game over screen.
        dialog.type = 'gameOver';
        dialog.isActive = true;
    }
}

// Update player's score based on his location.
// Also change the enemies speed and direction when the score gets high enough.
Player.prototype.updateScore = function() {
    let timer;
    // If player gets to the water.
    if (this.y === -11) {
        // Check when score get higher and increase the amount.
        if (this.score > this.amount * 4) {
            this.amount += Math.floor(this.amount / 2);

            // Change enemies speed and direction.
            allEnemies.forEach(enemy => enemy.changeSpeed());
        }

        // Increase player's score.
        this.score += this.amount;

        // Stop player's movement
        this.isActive = false;

        // Return player to starting position after 0.1 seconds.
        timer = setTimeout(() => {
            this.x = 202;
            this.y = 321;

            this.isActive = true;
            clearTimeout(timer);
        }, 100);

        // Increase player's horizontal position to avoid score bug increase.
        this.y++;

        // Update scoreboard.
        scoreboard.update();
    }
}

// This is a function to make the player start playing.
Player.prototype.start = function() {
    // If player has no more lives then reset player's stat before starting.
    if (this.lives <= 0) {
        this.lives = 3;
        this.score = 0;
        this.amount = 10;

        // Update the scoreboard.
        scoreboard.update();
        // Change enemies speed to the normal mode.
        allEnemies.forEach(function(enemy) {
            enemy.speed = (Math.random() * (2-1) + 1) * 101;
            // Change enemies sprite.
            enemy.speed > 0 ? enemy.sprite = 'images/enemy-bug.png' : enemy.sprite = 'images/enemy-bug-flip.png';
        });
    }

    // Make the player start playing.
    this.isActive = true;
    // Set player's sprite to the selected one.
    this.sprite = dialog.sprite;
}

// Create a scoreboard object to handle on screen info and buttons.
const Scoreboard = function() {
    // Get player's score.
    this.score = player.score.toString();
    // Create player's lives into emoji.
    this.lives = '💖💖💖';
    this.livesSymbol = '💖'
}

Scoreboard.prototype.update = function() {
    // Clear on screen lives.
    this.lives = '';
    // Add lives symbol on screen based on player's lives.
    for (let k = player.lives; k > 0; k--) {
        this.lives += this.livesSymbol;
    }

    // Update score on screen.
    this.score = player.score.toString();
}

Scoreboard.prototype.render = function() {
    // Set font to display the score into text.
    ctx.font = 'bold 25px courier';
    ctx.textAlign = 'start';
    ctx.fillText(`Score: ${this.score}`, 0, 40);

    // Align lives emoji to the right and display them.
    ctx.textAlign = 'right';
    ctx.fillText(this.lives, 505, 575);
}

/* Create a dialog constractor to handle the pop-up dialog
 * window when it displays on the beginning and the game-over
 * screen.
 */
const Dialog = function(type) {
    // Make the dialog active.
    this.isActive = true;

    // Set the screen type: starting or gameOver.
    this.type = type;

    // Set dialog's background and location.
    this.background = 'images/background.png';
    this.x = 0;
    this.y = 0;

    // Set current player sprite.
    this.sprite = player.sprite;

    // An array with all player's sprites.
    this.allSprites = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];

    // Create an index for all sprites in order to loop through them.
    this.index = 0;

    // Set arrows and button sprites.
    this.rightArrow = 'images/right-arrow.png';
    this.leftArrow = 'images/left-arrow.png';
    this.button = 'images/button.png';
    this.button_menu = 'images/button.png';

    // Set arrows and button location.
    this.r_arrow_x = 315;
    this.l_arrow_x = 150;
    this.arrow_y = 300;

    this.btn_x = 175;
    this.btn_y = 400;

    // Set buttons text and text location.
    this.btn_text = 'Start';
    this.btn_text_y = this.btn_y + 25;

    // Set text locaction in center of canvas.
    this.text_x = 252;
}

Dialog.prototype.render = function() {
    // Draw dialog background.
    ctx.drawImage(Resources.get(this.background), this.x, this.y);
    // Draw all text in center aligment.
    ctx.textAlign = 'center';

    // Check which is the type of dialog.
    switch (this.type) {
        case 'starting':
            // Draw header text.
            ctx.font = 'bold 25px courier';
            ctx.fillText('Classic Arcade Game: Frogger', this.text_x, 120);
            ctx.fillText('Please choose your character:', this.text_x, 155);

            // Draw player selector.
            ctx.drawImage(Resources.get('images/Selector.png'), this.x + 202, 208);
            ctx.drawImage(Resources.get(this.sprite), this.x + 202, 208);
            // Draw arrows.
            ctx.drawImage(Resources.get(this.rightArrow), this.r_arrow_x, this.arrow_y);
            ctx.drawImage(Resources.get(this.leftArrow), this.l_arrow_x, this.arrow_y);
            // Set button's text to start.
            this.btn_text = 'Start';
            break;
        case 'gameOver':
            // Draw game-over title.
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.font = 'bold 70px courier';
            ctx.fillText('Game Over', this.text_x, 252);
            ctx.restore();

            // Draw score accomplished.
            ctx.fillText(`Score: ${scoreboard.score}`, this.text_x, 287);
            // Set button text to restart.
            this.btn_text = 'Restart';
            // Draw a main menu button.
            ctx.drawImage(Resources.get(this.button_menu), this.btn_x, this.btn_y + 50);
            // Draw main menu button's text.
            ctx.fillText('Menu', this.text_x, this.btn_text_y + 50);
            break;
    }

    // Draw action button.
    ctx.drawImage(Resources.get(this.button), this.btn_x, this.btn_y);
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillText(this.btn_text, this.text_x, this.btn_text_y);
    ctx.restore();
}

// Handle input function for the dialog to handle the mouse and keyboard clicks.
Dialog.prototype.handleInput = function(keyType, mousePos) {
    // Check if mouse is over a button.
    let mouseOver = this.getButtonPressed(mousePos);

    // Check if a key was pressed or the mouse.
    switch (keyType) {
        case 'right':
            // Change player selection sprite.
            this.index < this.allSprites.length - 1 ? this.index++ : this.index = 0;
            this.sprite = this.allSprites[this.index];
            // Change arrow sprite to give focus.
            this.rightArrow = 'images/right-arrow-hover.png';
            setTimeout(() => this.rightArrow = 'images/right-arrow.png', 100);
            break;
        case 'left':
            // Change player selection sprite.
            this.index === 0 ? this.index = this.allSprites.length - 1 : this.index--;
            this.sprite = this.allSprites[this.index];
            // Change arrow sprite to give focus.
            this.leftArrow = 'images/left-arrow-hover.png';
            setTimeout(() => this.leftArrow = 'images/left-arrow.png', 100);
            break;
        case 'enter':
            // Close the dialog and start the game.
            this.isActive = false;
            player.start();
            break;
        case 'move':
            // Check witch button was hovered by the mouse.
            switch (mouseOver) {
                case 'menuBtn':
                    this.button_menu = 'images/button-hover.png';
                    break;
                case 'actionBtn':
                    this.button = 'images/button-hover.png';
                    break;
                case 'leftArr':
                    this.leftArrow = 'images/left-arrow-hover.png';
                    break;
                case 'rightArr':
                    this.rightArrow = 'images/right-arrow-hover.png';
                    break;
                default:
                    this.rightArrow = 'images/right-arrow.png';
                    this.leftArrow = 'images/left-arrow.png';
                    this.button = 'images/button.png';
                    this.button_menu = 'images/button.png';
            }
            break;
        case 'click':
            // Check witch button was pressed with the mouse.
            switch (mouseOver) {
                case 'actionBtn':
                    // Close the dialog and start the game.
                    this.isActive = false;
                    player.start();
                    // Set the buttons sprite to default.
                    this.button = 'images/button.png';
                    break;
                case 'menuBtn' :
                    // Change the dialog screen to starting screen.
                    this.type = 'starting';
                    break;
                case 'leftArr':
                    // Change player selection sprite.
                    this.index === 0 ? this.index = this.allSprites.length - 1 : this.index--;
                    this.sprite = this.allSprites[this.index];
                    break;
                case 'rightArr':
                    // Change player selection sprite.
                    this.index < this.allSprites.length - 1 ? this.index++ : this.index = 0;
                    this.sprite = this.allSprites[this.index];
            }
            break;
    }
}

// Check what button is pressed on the dialog.
Dialog.prototype.getButtonPressed = function(mousePos) {
    // Check if mouse is over the action button.
    let actionBtn = checkCollisions(mousePos, this.btn_x, this.btn_y, 138, 33);
    let menuBtn = checkCollisions(mousePos, this.btn_x, this.btn_y + 50, 138, 33);

    // Check if mouse is over the arrows.
    let leftArrowBtn = checkCollisions(mousePos, this.l_arrow_x, this.arrow_y, 31, 31);
    let rightArrowBtn = checkCollisions(mousePos, this.r_arrow_x, this.arrow_y, 31, 31);

    // Return a string with what button was in collision with the mouse.
    return actionBtn ? 'actionBtn' : menuBtn ? 'menuBtn' : leftArrowBtn ? 'leftArr' : rightArrowBtn ? 'rightArr' : undefined;
}

// Check if two objects have collided.
function checkCollisions(obj1, obj2_x, obj2_y, max_x = 0, max_y = 0) {
    // Check if the horizontal axis is the same.
    let checkY = obj1.y - 2 > obj2_y && obj1.y < obj2_y + max_y;

    // Check if the vertical axis is the same.
    let checkX = obj1.x - 2 > obj2_x && obj1.x < obj2_x + max_x;
    return checkX && checkY;
}

// Create getMousePos function to get the mouse location in order to make
// clickable buttons.
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor(evt.clientX - rect.left),
        y: evt.clientY - rect.top
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
        let newEnemy = new Enemy(startingX, enemyY += 83, (Math.random() * (3-1) + 1) * speed);

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

const player = new Player(202, 321);

const scoreboard = new Scoreboard();

const dialog = new Dialog('starting');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    // Check if player is allowed to move.
    if (player.isActive) {
        e.preventDefault();
        player.handleInput(allowedKeys[e.keyCode]);
    }

    // Check if dialog is active in order to handle keyboard shortcuts.
    if (dialog.isActive)
        dialog.handleInput(allowedKeys[e.keyCode], {});
});

// This listens for mousemove over the canvas to change the
// buttons background.
canvas.addEventListener('mousemove', function(e) {
    // Store mouse location.
    const mousePos = getMousePos(canvas, e);

    if (dialog.isActive)
        dialog.handleInput('move', mousePos);
});

// This listens for mouseclicks on the canvas buttons.
canvas.addEventListener('click', function(e) {
    // Store mouse location.
    const mousePos = getMousePos(canvas, e);

    if (dialog.isActive)
        dialog.handleInput('click', mousePos);
});

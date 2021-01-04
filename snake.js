const SCREENWIDTH = 800; // screen width
const SCREENHEIGHT = 600; // screen height
const snakeWidth = 16; // widthe of snake sprite
const snakeHeight = 16; // height of snake sprite
const OFFSET_X = snakeWidth / 2; // half of the sprite width to move, since (0,0) is the center of the sprite
const OFFSET_Y = snakeHeight / 2;
const GRID_X = SCREENWIDTH / snakeWidth; // grid value lines for sprite
const GRID_Y = SCREENHEIGHT / snakeHeight;
const movespeed = 16; // pixels moved per frame
const gamespeed = 100; // milliseconds between frames
let keySpace, keyLeft, keyRight, keyUp, keyDown;
let movement = 'right';
let gameTimer;

let cell, red;
let randoms;
let points = 0;

function SnakeBody() {
    this.head = null;
    this.size = 1;
}
function BodyCell(x, y) {
    this.x = x;
    this.y = y;
    this.next = null;
}

let snake = new SnakeBody();
snake.head = new BodyCell(OFFSET_X, OFFSET_Y);





class Snake extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.spritesheet('cell', 'assets/cell-debug-16.png', {
            frameWidth: snakeWidth,
            frameHeight: snakeHeight
        });
        this.load.spritesheet('red', 'assets/red-16.png', {
            frameWidth: snakeWidth,
            frameHeight: snakeHeight
        });
    }
    create() {
        this.cameras.main.setBackgroundColor(0x333333);

        cell = this.add.sprite(OFFSET_X, OFFSET_Y, 'cell'); // top left

        red = this.add.sprite(0, 0, 'red');
        this.SetRandomPos(red);


        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // console.log(cell.x)

        gameTimer = this.time.addEvent({ delay: gamespeed, callback: this.move, callbackScope: this, repeat: -1 });

    } // end create()

    update() {
        snake.head.x = cell.x;
        snake.head.y = cell.y;
        // console.log(snake.head.x === cell.x && snake.head.y === cell.y);


        if (cell.x > 800 || cell.x < 0 || cell.y > 600 || cell.y < 0) {
            cell.x = OFFSET_X;
            cell.y = OFFSET_Y;
            movement = 'right';
        }
        // console.log((cell.y + 8) % 16 === 0);
        // console.log(SCREENWIDTH % (cell.x + 8) === 0);

        if (keyRight.isDown && movement != 'left' && (cell.y + 8) % 16 === 0) {
            movement = 'right';
        }
        else if (keyUp.isDown && movement != 'down' && (cell.x + 8) % 16 === 0) {
            movement = 'up';
        }
        else if (keyLeft.isDown && movement != 'right' && (cell.y + 8) % 16 === 0) {
            movement = 'left';
        }
        else if (keyDown.isDown && movement != 'up' && (cell.x + 8) % 16 === 0) {
            movement = 'down';
        }

        if (cell.x === red.x && cell.y === red.y) {
            this.Collect();
        }

        // if (keySpace.isDown) {
        //     gameTimer.paused = !gameTimer.paused;
        //     console.log('paused: ' + gameTimer.paused);
        // }



    } // end update()

    move() {
        if (movement === 'right') {
            cell.x += movespeed;
        }
        else if (movement === 'up') {
            cell.y -= movespeed;
        }
        if (movement === 'left') {
            cell.x -= movespeed;
        }
        else if (movement === 'down') {
            cell.y += movespeed;
        }
    }

    SetRandomPos(item) {
        /*
            in a 16 snake and 800 screen :
            random: between 0 (inclusive) and 1 (exlusive).
            multiply: now between 0 and 50 (# of times the sprite can fit in the screen dimension)
            floor -> 0 and 49.
            multiply by 16 -> 0 and 784.
            offset -> 8 and 792
        */
        let randoms = [];
        let randomX = Math.floor(Math.random() * GRID_X) * snakeWidth + OFFSET_X; // random x in the grid of the game
        let randomY = Math.floor(Math.random() * GRID_Y) * snakeHeight + OFFSET_Y; // random y in the grid of the game
        randoms.push(randomX); // x is [0]
        randoms.push(randomY); // y is [1]
        item.x = randoms[0];
        item.y = randoms[1];
        // return randoms;
    } // end SetRandomPos()

    Collect() {
        points++;
        this.SetRandomPos(red);
        let temp = snake.head; // temp at head
        while (temp.next != null) { // go to tail
            temp = temp.next;
        }
        switch (movement) {
            case 'right':
                temp.x = temp.x - snakeWidth;
                break;
            case 'up':
                temp.y = temp.y + snakeHeight;
                break;
            case 'left':
                temp.x = temp.x + snakeWidth;
                break;
            case 'down':
                temp.y = temp.y - snakeHeight;
                break;
        }
        this.add.sprite(temp.x, temp.y, 'cell');

    }

} // end Snake scene class


const config = {
    type: Phaser.AUTO,
    width: SCREENWIDTH,
    height: SCREENHEIGHT,
    pixelArt: true,
    scene: [Snake]
};

const game = new Phaser.Game(config);
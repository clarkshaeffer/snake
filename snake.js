const SCREENWIDTH = 800; // screen width
const SCREENHEIGHT = 600; // screen height
const snakeWidth = 16; // widthe of snake sprite
const snakeHeight = 16; // height of snake sprite
const OFFSET_X = snakeWidth / 2; // half of the sprite width to move, since (0,0) is the center of the sprite
const OFFSET_Y = snakeHeight / 2;
const GRID_X = SCREENWIDTH / snakeWidth; // grid value lines for sprite
const GRID_Y = SCREENHEIGHT / snakeHeight;
const movespeed = 16; // pixels moved per frame
const gamespeed = 100; // milliseconds between frames of player movement
let keySpace, keyLeft, keyRight, keyUp, keyDown;
let movement = 'right';
let gameTimer;

let cell, red;
let randoms;
let points = 0;

function SnakeBody() {
    this.head = null;
    this.tail = null;
}
function BodyCell(x, y) {
    this.x = x;
    this.y = y;
    this.next = null;
    this.prev = null;
}

let snake;




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
        snake = new SnakeBody();
        snake.head = new BodyCell(OFFSET_X, OFFSET_Y);
        snake.tail = new BodyCell(OFFSET_X - snakeWidth, OFFSET_Y);
        snake.head.next = snake.tail;
        snake.tail.prev = snake.head;
        // snake.tail = snake.head;
        console.log('head:');
        console.log(snake.head);
        console.log('tail:');
        console.log(snake.tail);
        let len = this.GetSnakeLength(snake);


        this.cameras.main.setBackgroundColor(0x333333);

        cell = this.add.sprite(OFFSET_X, OFFSET_Y, 'cell'); // top left

        red = this.add.sprite(0, 0, 'red');
        this.SetRandomPos(red);


        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        gameTimer = this.time.addEvent({ delay: gamespeed, callback: this.move, callbackScope: this, repeat: -1 });

    } // end create()

    update() {
        /*
        Constant (not every frame): move(), called with the gameTimer in the create function.
        Every frame: 
                OutOfBoundsCheck(): check out of bounds
                MovementCheck(): check keyboard input to change movement direction
        */

        // snake.head.x = cell.x;
        // snake.head.y = cell.y;
        // console.log(snake.head.x === cell.x && snake.head.y === cell.y);

        this.OutOfBoundsCheck();
        this.MovementCheck();

        if (cell.x === red.x && cell.y === red.y) {
            this.Collect();
        }

    } // end update()

    OutOfBoundsCheck() {
        if (cell.x > 800 || cell.x < 0 || cell.y > 600 || cell.y < 0) {
            cell.x = OFFSET_X;
            cell.y = OFFSET_Y;
            movement = 'right';
        }
    }

    MovementCheck() {
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
    }

    move() {
        // let temp = snake.tail; // start at tail
        // while (temp.prev != null) { // go to head (while going to head)
        //     temp.x = temp.prev.x; // position is that of its previous cell
        //     temp.y = temp.prev.y;
        //     temp = temp.prev;
        //     console.log('hi');
        // }


        if (movement === 'right') {
            cell.x += movespeed;
            snake.head.x += movespeed;
        }
        else if (movement === 'up') {
            cell.y -= movespeed;
            snake.head.y -= movespeed;
        }
        if (movement === 'left') {
            cell.x -= movespeed;
            snake.head.x -= movespeed;
        }
        else if (movement === 'down') {
            cell.y += movespeed;
            snake.head.y += movespeed;
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


        // let temp = snake.head; // temp at head
        // while (temp.next != null) { // go to tail
        //     temp = temp.next;
        // }
        // temp.prev = temp;
        // temp = temp.next; // go to null behind tail

        // make new tail:
        // start at tail. it's the tail's next, and the tail is its previous. then it becomes the tail.
        //
        let temp = snake.tail;
        snake.tail.next = temp;
        temp.prev = snake.tail;
        snake.tail = temp;
        console.log(temp);
        console.log(snake.tail);
        /*
        BodyCell {x: 1016, y: 344, next: BodyCell, prev: BodyCell}
        BodyCell {x: 1016, y: 344, next: BodyCell, prev: BodyCell}

        */


        // switch (movement) {
        //     case 'right':
        //         temp.x = temp.x - snakeWidth;
        //         break;
        //     case 'up':
        //         temp.y = temp.y + snakeHeight;
        //         break;
        //     case 'left':
        //         temp.x = temp.x + snakeWidth;
        //         break;
        //     case 'down':
        //         temp.y = temp.y - snakeHeight;
        //         break;
        // }

        // this.add.sprite(temp.x, temp.y, 'cell'); // create new sprite at tail
    }

    GetSnakeLength(sn) {
        let len = 0;
        let temp = sn.head;
        while (temp.next != null) {
            temp = temp.next;
            len++;
        }

        return len;
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
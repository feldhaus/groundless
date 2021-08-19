var game;

// main game options
var gameOptions = {
    gameWidth: 1000,
    gameHeight: 800,
    tileSize: 100
};

// current level
var levelNumber = 0;

var isPlayerMoving = false;

// when the window finishes loading...
window.onload = function () {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
    game.state.add('TheGame', TheGame);
    game.state.start('TheGame');
};

var TheGame = function () {};

TheGame.prototype = {
    
    rows: 0,
    cols: 0,

    // preloading assets
    preload: function () {
        game.load.spritesheet('tiles', 'assets/images/tilesheet.png', 128, 128);
    },

    // when the game starts
    create: function () {
        // set game scale
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        // create level
        this.createLevel();

        isPlayerMoving = false;
        
        // define inputs (touch and keyboard)
        game.input.onUp.add(this.endSwipe, this);

        var keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keyUp.onDown.add(this.moveUp, this);
        var keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keyDown.onDown.add(this.moveDown, this);
        var keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keyLeft.onDown.add(this.moveLeft, this);
        var keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keyRight.onDown.add(this.moveRight, this);
        var keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        keySpace.onDown.add(this.automata, this);
    },

    // function to create a level
    createLevel: function () {
        // get level parameters
        var currentLevel = levels[levelNumber];
        this.cols = currentLevel.level[0].length;
        this.rows = currentLevel.level.length;
        
        // create tile array and tile group
        this.tilesArray = [];
        this.tileGroup = game.add.group();
        this.tileGroup.x = (game.width - gameOptions.tileSize * this.cols) / 2;
        this.tileGroup.y = (game.height -  gameOptions.tileSize * this.rows) / 2;
        
        // add tiles
        for (var i = 0; i < this.rows; i++) {
            this.tilesArray[i] = [];
            for (var j = 0; j < this.cols; j++) {
                if (currentLevel.level[i][j] !== 0) {
                    this.addTile(i, j, currentLevel.level[i][j]);
                }
            }
        }
        
        // add player
        this.playerPosition = new Phaser.Point(0, 0);
        currentLevel.playerPos.clone(this.playerPosition);
        var tilePos = this.getTilePosition(currentLevel.playerPos.y, currentLevel.playerPos.x);
        this.player = game.add.sprite(tilePos.x, tilePos.y, 'tiles');
        this.player.width = gameOptions.tileSize;
        this.player.height = gameOptions.tileSize;
        this.player.frame = 65;
        this.player.anchor.set(0.5);
        this.tileGroup.add(this.player);
        
        // get and set the final tile
        this.finalPosition = new Phaser.Point(0, 0);
        var finalTile;
        if (currentLevel.finalPos) {
            currentLevel.finalPos.clone(this.finalPosition);
            finalTile = this.getTile(this.finalPosition.y, this.finalPosition.x);
            this.firstMove = false;
        } else {
            currentLevel.playerPos.clone(this.finalPosition);
            finalTile = this.getTile(this.playerPosition.y, this.playerPosition.x);
            this.firstMove = true;
        }
        finalTile.frame = 90;
        finalTile.tileValue = 9;
        
        // show message
        if (currentLevel.message) {
            var style = { font: "28px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.height - 20, currentLevel.message, style);
            text.anchor.set(0.5, 1);
            text.alpha = 0.0;
            game.add.tween(text).to( { alpha: 1 }, 2000, "Linear", true);
        }
	},

    // function add a tile at "row" row, "col" column with "val" value
    addTile: function (row, col, val) {
        var tilePos = this.getTilePosition(row, col);
        var theTile = game.add.sprite(tilePos.x, tilePos.y, 'tiles');
        if (val === 2) {
            theTile.tint = 0xffff88;
        }
        theTile.anchor.set(0.5);
        theTile.tileValue = val;
        theTile.width = gameOptions.tileSize;
        theTile.height = gameOptions.tileSize;
        theTile.frame = 102;
        theTile.falling = false;
        theTile.tilePosition = new Phaser.Point(col, row);
        this.tilesArray[row][col] = theTile;
        this.tileGroup.add(theTile);
        
        var txt = game.add.text(tilePos.x, tilePos.y, col + ',' + row);
        this.tileGroup.add(txt);
    },
    
    // return tile position
    getTilePosition: function (row, col) {
        return {
            x: col * gameOptions.tileSize + gameOptions.tileSize / 2,
            y: row * gameOptions.tileSize + gameOptions.tileSize / 2
        };
    },
    
    // return a tile
    getTile: function (row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return null;
        }
        return this.tilesArray[row][col];
    },
     
    // end checking for swipes
    endSwipe: function (event) {
        var swipeTime = event.timeUp - event.timeDown;
        var swipeDistance = Phaser.Point.subtract(event.position, event.positionDown);
        var swipeMagnitude = swipeDistance.getMagnitude();
        var swipeNormal = Phaser.Point.normalize(swipeDistance);
        if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.x) > 0.8 || Math.abs(swipeNormal.y) > 0.8)) {
            if (swipeNormal.y < -0.8) {
                this.moveUp();
            } else if (swipeNormal.y > 0.8) {
                this.moveDown();
            } else if (swipeNormal.x < -0.8) {
                this.moveLeft();
            } else if (swipeNormal.x > 0.8) {
                this.moveRight();
            }
        }
    },
    
    // move player to up
    moveUp: function () {
        this.handleMovement(new Phaser.Point(0, -1));
        this.player.frame = 68;
    },
    
    // move player to down
    moveDown: function () {
        this.handleMovement(new Phaser.Point(0, 1));
        this.player.frame = 65;
    },
    
    // move player to left
    moveLeft: function () {
        this.handleMovement(new Phaser.Point(-1, 0));
        this.player.frame = 94;
    },
    
    // move player to right
    moveRight: function () {
        this.handleMovement(new Phaser.Point(1, 0));
        this.player.frame = 91;
    },

    // handling swipes
    handleMovement: function (position) {
        if (isPlayerMoving) return;
        isPlayerMoving = true;

        var tile = this.getTile(this.playerPosition.y, this.playerPosition.x);
        
        if (this.firstMove) {
            this.firstMove = false;
        } else if (tile) {
            switch (tile.tileValue) {
                case 1:
                    tile.falling = true;
                    var tween = game.add.tween(tile).to({
                        alpha: 0,
                        width: gameOptions.tileSize / 4,
                        height: gameOptions.tileSize / 4,
                        angle: game.rnd.integerInRange(-15, 15)
                    }, 500, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function(target){
                        this.tilesArray[target.tilePosition.y][target.tilePosition.x] = null;
                        target.destroy();
                    }, this);
                    break;
                case 2:
                    tile.tileValue = 1;
                    tile.tint = 0xffffff;
                    break;
            }
        }
        
        this.playerPosition.add(position.x, position.y);
        tile = this.getTile(this.playerPosition.y, this.playerPosition.x);
        
        var playerTween = game.add.tween(this.player).to({
            x: this.playerPosition.x * gameOptions.tileSize + gameOptions.tileSize / 2,
            y: this.playerPosition.y * gameOptions.tileSize + gameOptions.tileSize / 2
        }, 100, Phaser.Easing.Linear.None, true);
        
        playerTween.onComplete.add(function(){
            if (tile == null || tile.falling) {
                this.levelRestart();
            } else {
                if (tile.tileValue == 9) {
                    if (this.isLevelComplete()) {
                        if (levelNumber < levels.length-1) {
                            levelNumber ++;
                            this.levelRestart();
                        } else {
                            alert('Ok! You completed the game!');
                        }
                    } else {
                        var tween = game.add.tween(tile).to({
                            alpha: 0,
                        }, 100, Phaser.Easing.Linear.None, true);
                        this.levelRestart();
                    }
                } else {
                    isPlayerMoving = false;
                }
            }     
        }, this)  
    },

    // function to check if the level is completed
    isLevelComplete: function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var tile = this.tilesArray[i][j];
                if (tile != null && !tile.falling && tile.tileValue != 9) {
                    return false;
                }
            }
        }
        return true;     
    },

    // routine to start when the level is failed
    levelRestart: function () { 
        var tween = game.add.tween(this.player).to({
            alpha: 0,
            width: gameOptions.tileSize / 4,
            height: gameOptions.tileSize / 4
        }, 500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function() {
            game.state.start('TheGame');
        }, this);
    },
    
    // convert the tile array to a single array grid
    convertToGrid: function(array) {
        var grid = [];
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (array[i] != null && array[i][j] != null && array[i][j].tileValue > 0 && array[i][j].tileValue < 9) {
                    grid.push(array[i][j].tileValue);
                } else {
                    grid.push(0);
                }
            }
        }
        return grid;
    },
    
    // "automatically" resolve the problem
    automata: function () {
        // remove other inputs
        game.input.keyboard.removeKey(Phaser.Keyboard.UP);
        game.input.keyboard.removeKey(Phaser.Keyboard.DOWN);
        game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
        game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
        game.input.keyboard.removeKey(Phaser.Keyboard.SPACE);
        
        // convert variables
        var grid = this.convertToGrid(this.tilesArray);
        var startPosition = new Phaser.Point(0, 0);
        this.finalPosition.clone(startPosition);
        
        // make the search
        var path = AI.ast(grid, this.playerPosition, startPosition, {cols:this.cols, rows:this.rows});
        console.log(path);
        
        // move the character
        if (path) {
            for (var i = 0; i < path.length; i++) {
                if (path[i] == 'up') {
                    setTimeout(this.moveUp.bind(this), 200 * i);
                } else if (path[i] == 'down') {
                    setTimeout(this.moveDown.bind(this), 200 * i);
                } else if (path[i] == 'left') {
                    setTimeout(this.moveLeft.bind(this), 200 * i);
                } else if (path[i] == 'right') {
                    setTimeout(this.moveRight.bind(this), 200 * i);
                }
            }
        } else {
            alert('I\'m sorry, Dude. I\'m afraid I can\'t do that!');
        }
    }
}
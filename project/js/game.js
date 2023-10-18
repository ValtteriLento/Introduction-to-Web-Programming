let game;

const gameOptions = {
    playerSpeed: 200
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 860,
            height: 620
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 500
                }
            }
        },
        scene: [MainMenu, PlayGame, GameOver]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class MainMenu extends Phaser.Scene {

    constructor() {
        super("MainMenu")
    }

    preload() {
        this.load.image("grassland", "assets/Grassland_BG_(288 x 208).png")
        this.load.spritesheet("terrain", "assets/Terrain (16x16).png", {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet("kiwi", "assets/Fruits/Kiwi.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("pineapple", "assets/Fruits/Pineapple.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("collected", "assets/Fruits/Collected.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("player", "assets/Ninja Frog/Idle (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerJump", "assets/Ninja Frog/Jump (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerFall", "assets/Ninja Frog/Fall (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerRun", "assets/Ninja Frog/Run (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.audio("jump", "assets/sfx/Jump.wav")
        this.load.audio("pickUp", "assets/sfx/PickUp.wav")
    }

    create() {
        this.add.image(game.config.width / 2, game.config.height / 2, "grassland").setScale(3)

        this.add.text(game.config.width / 2, game.config.height / 3, "Main Menu", {
            fontSize: 48,
            fill: "#660000"
        }).setOrigin(0.5)

        this.add.text(game.config.width / 2, game.config.height / 2, "Press SPACE to play", {
            fontSize: 32,
            fill: "#006600"
        }).setOrigin(0.5)

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("PlayGame")
        })

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player", {start: 0, end: 10}),
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: "jump",
            frames: [{key: "playerJump", frame: 0}],
            frameRate: 20
        })

        this.anims.create({
            key: "fall",
            frames: [{key: "playerFall", frame: 0}],
            frameRate: 20
        })

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("playerRun", {start: 0, end: 5}),
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: "kiwi",
            frames: this.anims.generateFrameNumbers("kiwi", {start: 0, end: 16}),
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: "pineapple",
            frames: this.anims.generateFrameNumbers("pineapple", {start: 0, end: 16}),
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: "collected",
            frames: this.anims.generateFrameNumbers("collected", {start: 0, end: 5}),
            frameRate: 10
        })
    }
}

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
        this.score = 0;
    }

    create() {
        this.add.image(game.config.width / 2, game.config.height / 2, "grassland").setScale(3)

        this.terrain = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.fruits = this.physics.add.group()

        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(200, 800)
            const y = 200 + (20 * i)

            this.terrain.create(x, y, "terrain", 188)
            this.terrain.create(x + 16, y, "terrain", 189)
            this.terrain.create(x + 32, y, "terrain", 189)
            this.terrain.create(x + 48, y, "terrain", 189)
            this.terrain.create(x + 64, y, "terrain", 190)
        }

        this.terrain.create(68, game.config.height / 2 - 16, "terrain", 210)
        this.terrain.create(68, game.config.height / 2, "terrain", 188)
        this.terrain.create(84, game.config.height / 2, "terrain", 189)
        this.terrain.create(100, game.config.height / 2, "terrain", 189)
        this.terrain.create(116, game.config.height / 2, "terrain", 189)
        this.terrain.create(132, game.config.height / 2, "terrain", 190)

        this.player = this.physics.add.sprite(88, 280, "player")
        this.physics.add.collider(this.player, this.terrain)

        this.physics.add.collider(this.fruits, this.terrain)
        this.physics.add.overlap(this.player, this.fruits, this.collectFruit, null, this)

        this.scoreText = this.add.text(32, 10, "0", {fontSize: "30px", fill: "#000000"})

        this.cursors = this.input.keyboard.createCursorKeys()

        this.triggerTimer = this.time.addEvent({
            callback: this.addTerrain,
            callbackScope: this,
            delay: 1200,
            loop: true
        })

    }

    addTerrain() {
        const x = 800
        const y = Phaser.Math.Between(200, 500)

        this.terrain.create(x, y, "terrain", 188)
        this.terrain.create(x + 16, y, "terrain", 189)
        this.terrain.create(x + 32, y, "terrain", 189)
        this.terrain.create(x + 48, y, "terrain", 189)
        this.terrain.create(x + 64, y, "terrain", 190)
        this.terrain.setVelocityX(-gameOptions.playerSpeed / 5)

        if (Phaser.Math.Between(0, 1)) {
            this.fruits.create(Phaser.Math.Between(200, game.config.width), 0, "kiwi").anims.play("kiwi", true)
            this.fruits.create(Phaser.Math.Between(200, game.config.width), 0, "pineapple").anims.play("pineapple", true)
            this.fruits.setVelocityX(-gameOptions.playerSpeed / 5)
        }
    }

    collectFruit(player, fruit) {
        fruit.anims.play("collected", true)
        this.score += 1;
        this.scoreText.setText(this.score)
        fruit.disableBody(true, true)
        this.sound.play("pickUp")
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -gameOptions.playerSpeed
            this.player.setFlipX(true)
            this.player.anims.play("run", true)
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = gameOptions.playerSpeed
            this.player.setFlipX(false)
            this.player.anims.play("run", true)
        } else if (this.player.body.touching.down) {
            this.player.body.velocity.x = -gameOptions.playerSpeed / 5
            this.player.anims.play("idle", true)
        } else {
            this.player.body.velocity.x = 0;
            this.player.anims.play("idle", true)
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -500 / 1.6
            this.sound.play("jump")
        }

        if (this.player.body.velocity.y < 0) {
            this.player.anims.play("jump", true)
        } else if (this.player.body.velocity.y > 0 && !this.player.body.touching.down) {
            this.player.anims.play("fall", true)
        }

        if (this.player.y > game.config.height || this.player.x < 0) {
            this.scene.start("GameOver")
        }
    }
}

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver")
    }

    create() {
        this.add.image(game.config.width / 2, game.config.height / 2, "grassland").setScale(3)

        this.add.text(game.config.width / 2, game.config.height / 3, "Game Over", {
            fontSize: 48,
            fill: "#ff0000"
        }).setOrigin(0.5)

        this.add.text(game.config.width / 2, game.config.height / 2, "Press SPACE to play again", {
            fontSize: 32,
            fill: "#006600"
        }).setOrigin(0.5)

        this.add.text(game.config.width / 2, game.config.height / 1.75, "or ESC to go to Main Menu", {
            fontSize: 32,
            fill: "#006600"
        }).setOrigin(0.5)

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("PlayGame")
        })

        this.input.keyboard.once("keydown-ESC", () => {
            this.scene.start("MainMenu")
        })
    }
}
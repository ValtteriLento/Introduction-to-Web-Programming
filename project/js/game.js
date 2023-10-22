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

// Main menu where assets are preloaded and animations are created
class MainMenu extends Phaser.Scene {

    constructor() {
        super("MainMenu")
    }

    preload() {
        this.load.image("grassland", "assets/Backgrounds/Grassland_BG_(288 x 208).png")
        this.load.image("autumn", "assets/Backgrounds/Autumn_BG_(288 x 208).png")
        this.load.spritesheet("terrain", "assets/Terrain (16x16).png", {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet("kiwi", "assets/Fruits/Kiwi.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("pineapple", "assets/Fruits/Pineapple.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("player", "assets/Ninja Frog/Idle (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerJump", "assets/Ninja Frog/Jump (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerFall", "assets/Ninja Frog/Fall (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerRun", "assets/Ninja Frog/Run (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerHit", "assets/Ninja Frog/Hit (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.image("spikeHead", "assets/Traps/Spike Head/Idle.png")
        this.load.spritesheet("spikeHeadHit", "assets/Traps/Spike Head/Bottom Hit (54x52).png", {frameWidth: 54, frameHeight: 52})
        this.load.image("fanOff", "assets/Traps/Fan/Off.png")
        this.load.spritesheet("fanOn", "assets/Traps/Fan/On (24x8).png", {frameWidth: 24, frameHeight: 8})
        this.load.audio("jump", "assets/sfx/Retro Jump Classic 08.wav")
        this.load.audio("pickUp", "assets/sfx/Retro PickUp 18.wav")
        this.load.audio("hit", "assets/sfx/Retro Negative Short 23.wav")
        this.load.audio("music", "assets/sfx/Retro Music Loop - PV8 - NES Style 01.wav")
    }

    create() {
        this.add.image(game.config.width / 2, game.config.height / 2, "grassland").setScale(3)

        this.add.text(game.config.width / 2, game.config.height / 3, "Infinite Runner", {
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
            key: "hit",
            frames: this.anims.generateFrameNumbers("playerHit", {start: 0, end: 6}),
            frameRate: 20
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
            key: "spikeHeadHit",
            frames: this.anims.generateFrameNumbers("spikeHeadHit", {start: 2, end: 3}),
            frameRate: 20
        })

        this.anims.create({
            key: "fanOn",
            frames: this.anims.generateFrameNumbers("fanOn", {start: 0, end: 3}),
            frameRate: 20,
            repeat: 4
        })
    }
}

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
    }

    init() {
        this.score = 0;
    }

    create() {
        this.add.image(game.config.width / 2, game.config.height / 2, "grassland").setScale(3)

        this.sound.play("music")

        this.terrain = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.heads = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.fans = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.fruits = this.physics.add.group()

        // Generates starting terrains
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(200, 800)
            const y = 200 + (20 * i)

            this.terrain.create(x, y, "terrain", 6)
            this.terrain.create(x + 16, y, "terrain", 7)
            this.terrain.create(x + 32, y, "terrain", 7)
            this.terrain.create(x + 48, y, "terrain", 7)
            this.terrain.create(x + 64, y, "terrain", 8)
        }

        // Starting terrain for player
        this.terrain.create(52, game.config.height / 2 - 16, "terrain", 6)
        this.terrain.create(68, game.config.height / 2 - 16, "terrain", 8)
        this.terrain.create(52, game.config.height / 2, "terrain", 28)
        this.terrain.create(68, game.config.height / 2, "terrain", 30)
        this.terrain.create(84, game.config.height / 2, "terrain", 7)
        this.terrain.create(100, game.config.height / 2, "terrain", 7)
        this.terrain.create(116, game.config.height / 2, "terrain", 7)
        this.terrain.create(132, game.config.height / 2, "terrain", 8)

        this.player = this.physics.add.sprite(88, 280, "player")
        this.physics.add.collider(this.player, this.terrain)

        this.physics.add.collider(this.fruits, this.terrain)
        this.physics.add.overlap(this.player, this.fruits, this.collectFruit, null, this)

        this.physics.add.collider(this.heads, this.terrain)
        this.physics.add.overlap(this.player, this.heads, this.playerHit, null, this)

        this.physics.add.overlap(this.player, this.fans, this.fanOn, null, this)

        this.scoreText = this.add.text(32, 10, "0", {fontSize: "30px", fill: "#000000"})

        this.cursors = this.input.keyboard.createCursorKeys()

        this.triggerTimer = this.time.addEvent({
            callback: this.addTerrain,
            callbackScope: this,
            delay: 1200,
            loop: true
        })

    }

    // Adds new terrain, enemies and collectibles infinitely
    addTerrain() {
        const x = 860
        const y = Phaser.Math.Between(200, 600)

        this.terrain.create(x, y, "terrain", 6)
        this.terrain.create(x + 16, y, "terrain", 7)
        this.terrain.create(x + 32, y, "terrain", 7)
        this.terrain.create(x + 48, y, "terrain", 7)
        this.terrain.create(x + 64, y, "terrain", 8)
        this.terrain.setVelocityX(-gameOptions.playerSpeed / 5)

        if (Phaser.Math.Between(0, 1) == 1) {
            this.fruits.create(Phaser.Math.Between(200, game.config.width), 0, "kiwi").anims.play("kiwi", true)
            this.fruits.setVelocityX(-gameOptions.playerSpeed / 5)
        }

        if (Phaser.Math.Between(0, 2) == 1) {
            this.fruits.create(Phaser.Math.Between(200, game.config.width), 0, "pineapple").anims.play("pineapple", true)
            this.fruits.setVelocityX(-gameOptions.playerSpeed / 5)
        }

        if (Phaser.Math.Between(0, 3) == 1) {
            this.heads.create(Phaser.Math.Between(200, game.config.width), 0, "spikeHead")
            this.heads.setVelocityX(-gameOptions.playerSpeed / 5)
        }

        if (Phaser.Math.Between(0, 3) == 1) {
            this.fans.create(Phaser.Math.Between(x, x + 64), y - 12, "fanOff")
            this.fans.setVelocityX(-gameOptions.playerSpeed / 5)
        }
    }

    // Fruits give different amount of score
    collectFruit(player, fruit) {
        if (fruit.texture.key == "kiwi") {
            this.score += 10
        } else if (fruit.texture.key == "pineapple") {
            this.score += 20
        }
        this.scoreText.setText(this.score)
        fruit.disableBody(true, true)
        this.sound.play("pickUp")
    }

    playerHit(player, trap) {
        player.anims.play("hit", true)
        this.sound.play("hit")
        player.body.checkCollision.down = false
    }

    fanOn(player, fan) {
        fan.anims.play("fanOn", true)
        player.body.velocity.y = -400
    }

    update() {
        // These are disabled when player is hit
        if (this.player.body.checkCollision.down) {
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -gameOptions.playerSpeed
                this.player.setFlipX(true)
                this.player.anims.play("run", true)
            }
            else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = gameOptions.playerSpeed
                this.player.setFlipX(false)
                this.player.anims.play("run", true)
            // Creates illusion of player standing still when on moving platform
            } else if (this.player.body.touching.down) {
                this.player.body.velocity.x = -gameOptions.playerSpeed / 5
                this.player.anims.play("idle", true)
            } else {
                this.player.body.velocity.x = 0;
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
        }

        this.heads.getChildren().forEach(head => {
            if (head.body.touching.down) {
                head.anims.play("spikeHeadHit", true)
                head.setVelocityY(-200)
            } else if (head.y <= 0) {
                head.setVelocityY(200)
            }
        })

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

        this.add.text(game.config.width / 2, game.config.height / 5, "Game Over", {
            fontSize: 48,
            fill: "#660000"
        }).setOrigin(0.5)

        this.add.text(game.config.width / 2, game.config.height / 3, "Your score: " + this.scene.get("PlayGame").score, {
            fontSize: 32,
            fill: "#006600"
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
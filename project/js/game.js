let game;

const gameOptions = {
    playerGravity: 800,
    playerSpeed: 300
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 1000
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 800
                }
            }
        },
        scene: PlayGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
        this.score = 0;
    }

    preload() {
        this.load.image("background", "assets/Green.png")
        this.load.spritesheet("terrain", "assets/Terrain (16x16).png", {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet("kiwi", "assets/Fruits/Kiwi.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("collected", "assets/Fruits/Collected.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("player", "assets/Ninja Frog/Idle (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerJump", "assets/Ninja Frog/Jump (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerFall", "assets/Ninja Frog/Fall (32x32).png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("playerRun", "assets/Ninja Frog/Run (32x32).png", {frameWidth: 32, frameHeight: 32})
    }

    create() {
        let x = 80;
        let y = 80;

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 5; j++) {
                this.add.image(x, y, "background").setScale(2.5)
                x += 160
            }
            x = 80
            y += 160
        }

        this.terrain = this.physics.add.staticGroup()

        this.kiwis = this.physics.add.group()

        this.anims.create({
            key: "kiwi",
            frames: this.anims.generateFrameNumbers("kiwi", {start: 0, end: 16}),
            frameRate: 10,
            repeat: -1
        })

        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(50, 750)
            const y = 50 * i

            this.terrain.create(x, y, "terrain", 188)
            this.terrain.create(x + 16, y, "terrain", 189)
            this.terrain.create(x + 32, y, "terrain", 189)
            this.terrain.create(x + 48, y, "terrain", 189)
            this.terrain.create(x + 64, y, "terrain", 190)
            this.kiwis.create(x + 32, y - 32, "kiwi").anims.play("kiwi", true)
        }

        this.terrain.create(368, 600, "terrain", 188)
        this.terrain.create(384, 600, "terrain", 189)
        this.terrain.create(400, 600, "terrain", 189)
        this.terrain.create(416, 600, "terrain", 189)
        this.terrain.create(432, 600, "terrain", 190)

        this.player = this.physics.add.sprite(400, 560, "player")
        this.physics.add.collider(this.player, this.terrain)

        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        this.physics.add.collider(this.kiwis, this.terrain)
        this.physics.add.overlap(this.player, this.kiwis, this.collectFruit, null, this);

        this.scoreText = this.add.text(32, 3, "0", {fontSize: "30px", fill: "#ffffff"});

        this.cursors = this.input.keyboard.createCursorKeys()

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player", {start: 0, end: 10}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "jump",
            frames: [{key: "playerJump", frame: 0}],
            frameRate: 10
        })

        this.anims.create({
            key: "fall",
            frames: [{key: "playerFall", frame: 0}],
            frameRate: 10
        })

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("playerRun", {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "collected",
            frames: this.anims.generateFrameNumbers("collected", {start: 0, end: 5}),
            frameRate: 10
        })
    }

    collectFruit(player, fruit) {
        fruit.anims.play("collected", true).disableBody(true, true)
        this.score += 1;
        this.scoreText.setText(this.score);
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
        }
        else {
            this.player.body.velocity.x = 0;
            this.player.anims.play("idle", true)
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -800 / 1.6
        }

        if (this.player.body.velocity.y < 0) {
            this.player.anims.play("jump", true)
        } else if (this.player.body.velocity.y > 0) {
            this.player.anims.play("fall", true)
        }

        if (this.player.y > game.config.height) {
            this.scene.start("PlayGame");
        }
    }
}
// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let gameOver = false;
let score = 0;
let wave = 1;
let lives = 3;

// Player
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 40,
    speed: 7,
    dx: 0
};

// Arrays
let enemies = [];
let bullets = [];
let enemyBullets = [];

// Keyboard
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        e.preventDefault();
        if (gameRunning) shootBullet();
    }
    if (e.key === 'r' || e.key === 'R') {
        location.reload();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Enemy Class
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 40;
        this.height = 40;
        this.speed = type === 1 ? 1 : type === 2 ? 3 : 2;
        this.shootTimer = Math.random() * 100 + 50;
    }

    update() {
        this.x += this.speed;
        this.shootTimer--;

        if (this.shootTimer <= 0) {
            shootEnemyBullet(this.x + this.width / 2, this.y + this.height);
            this.shootTimer = Math.random() * 100 + 50;
        }

        if (this.x + this.width > canvas.width || this.x < 0) {
            this.speed *= -1;
        }
    }

    draw() {
        ctx.save();
        ctx.fillStyle = '#ff00ff';
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 10;

        if (this.type === 1) {
            // 1950s Dad with Pipe
            drawDad(this.x, this.y);
        } else if (this.type === 2) {
            // Boy with Propeller Beanie
            drawBoy(this.x, this.y);
        } else {
            // Red-haired Housewife
            drawHousewife(this.x, this.y);
        }

        ctx.restore();
    }
}

function drawDad(x, y) {
    // Head
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(x + 20, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(x + 15, y + 20, 10, 12);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 17, y + 8, 2, 2);
    ctx.fillRect(x + 23, y + 8, 2, 2);

    // Pipe
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 25, y + 12, 3, 0, Math.PI);
    ctx.stroke();
}

function drawBoy(x, y) {
    // Head
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(x + 20, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(x + 15, y + 20, 10, 12);

    // Propeller
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 20, y);
    ctx.lineTo(x + 20, y + 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 17, y + 2);
    ctx.lineTo(x + 23, y + 2);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 17, y + 8, 2, 2);
    ctx.fillRect(x + 23, y + 8, 2, 2);
}

function drawHousewife(x, y) {
    // Head
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(x + 20, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Red Hair
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(x + 20, y + 8, 9, 0, Math.PI);
    ctx.fill();

    // Body (dress)
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(x + 15, y + 20, 10, 12);

    // Hypnotic Eyes
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(x + 17, y + 9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 23, y + 9, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 17, y + 9, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 23, y + 9, 1, 0, Math.PI * 2);
    ctx.fill();
}

// Bullet Functions
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 8
    });
}

function shootEnemyBullet(x, y) {
    enemyBullets.push({
        x: x,
        y: y,
        width: 4,
        height: 10,
        speed: 4
    });
}

// Spawn Enemies
function spawnEnemies() {
    enemies = [];
    const enemyCount = 3 + wave;
    const spacing = canvas.width / (enemyCount + 1);

    for (let i = 0; i < enemyCount; i++) {
        const type = (i % 3) + 1;
        enemies.push(new Enemy(spacing * (i + 1), 30 + (Math.floor(i / 3) * 60), type));
    }
}

// Update Game
function update() {
    if (!gameRunning || gameOver) return;

    // Player movement
    player.dx = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.dx = -player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx = player.speed;

    player.x += player.dx;

    // Boundary check
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Update enemies
    enemies.forEach(enemy => enemy.update());

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Update enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
        }
    }

    // Collision detection - bullets hitting enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                score += enemies[j].type * 10;
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                break;
            }
        }
    }

    // Collision detection - enemy bullets hitting player
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (
            enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y
        ) {
            lives--;
            enemyBullets.splice(i, 1);

            if (lives <= 0) {
                endGame();
            }
        }
    }

    // Check if enemies reached bottom
    enemies.forEach(enemy => {
        if (enemy.y + enemy.height > canvas.height) {
            endGame();
        }
    });

    // Next wave
    if (enemies.length === 0) {
        wave++;
        spawnEnemies();
    }

    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('wave').textContent = wave;
    document.getElementById('lives').textContent = lives;
}

// Draw Game
function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }

    // Draw player
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player cannon
    ctx.fillRect(player.x + player.width / 2 - 2, player.y - 5, 4, 5);
    ctx.restore();

    // Draw bullets
    ctx.fillStyle = '#00ff00';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemy bullets
    ctx.fillStyle = '#ff0000';
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => enemy.draw());
}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start Game
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    gameRunning = true;
    gameOver = false;
    score = 0;
    wave = 1;
    lives = 3;
    spawnEnemies();
    gameLoop();
}

// End Game
function endGame() {
    gameRunning = false;
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalWave').textContent = wave;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}
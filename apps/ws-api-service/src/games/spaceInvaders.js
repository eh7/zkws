// Get the canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');

// Game variables
let score = 0;
let gameRunning = true;
let enemies = [];
let bullets = [];
let enemyDirection = 1;
let enemySpeed = 1;
let enemyMoveDown = false;

// Player
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 20,
    speed: 5,
    color: '#0f0'
};

// Create enemies
function createEnemies() {
    enemies = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
            enemies.push({
                x: col * 60 + 50,
                y: row * 40 + 30,
                width: 40,
                height: 30,
                color: '#f00'
            });
        }
    }
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = '#f00';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = '#ff0';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Update game state
function update() {
    if (!gameRunning) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Move bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 7;

        // Remove bullets that go off-screen
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            continue;
        }

        // Check for bullet-enemy collision
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
                break;
            }
        }
    }

    // Move enemies
    let moveDown = false;
    enemies.forEach(enemy => {
        enemy.x += enemySpeed * enemyDirection;

        // Change direction if an enemy hits the edge
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            moveDown = true;
        }
    });

    if (moveDown) {
        enemyDirection *= -1;
        enemies.forEach(enemy => {
            enemy.y += 20;
        });
    }

    // Check for enemy-player collision
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver();
        }
    });

    // Check if all enemies are defeated
    if (enemies.length === 0) {
        createEnemies();
        enemySpeed += 0.5;
    }

    // Check if enemies reached the bottom
    enemies.forEach(enemy => {
        if (enemy.y + enemy.height > canvas.height) {
            gameOver();
        }
    });

    // Draw everything
    drawPlayer();
    drawEnemies();
    drawBullets();

    // Continue the game loop
    requestAnimationFrame(update);
}

// Shoot bullet
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10
    });
}

// Game over
function gameOver() {
    gameRunning = false;
    gameOverElement.classList.remove('hidden');
}

// Restart game
function restart() {
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    gameOverElement.classList.add('hidden');
    player.x = canvas.width / 2 - 25;
    createEnemies();
    bullets = [];
    enemySpeed = 1;
    gameRunning = true;
    update();
}

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ' && gameRunning) {
        shoot();
    }

    if (e.key.toLowerCase() === 'r' && !gameRunning) {
        restart();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Start the game
createEnemies();
update();


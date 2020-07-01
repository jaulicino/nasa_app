class Bullet {
  constructor() {
    this.vx = [0]; // ship.cx - mx / 1000;
    this.vy = [0]; //ship.cy - my / 1000;
    this.x = [0]; //ship.x;
    this.y = [0]; //ship.y;
    this.width = [0];
    this.height = [0];
  }
  add(ship) {
    if (ship.coolDown <= 0) {
      for (var i = 0; i < 6; i++) {
        var dx = Math.cos(ship.ang - Math.PI / 2);
        var dy = Math.sin(ship.ang - Math.PI / 2);
        var hyp = Math.sqrt(dx * dx + dy * dy) / 25;
        dx /= hyp;
        dy /= hyp;
        this.vx.push(dx + ship.deltax);
        this.vy.push(dy + ship.deltay);
        this.x.push(ship.position.x + (dx * i) / 3.5);
        this.y.push(ship.position.y + (dy * i) / 3.5);
        this.width.push(6);
        this.height.push(6);
      }
      ship.coolDown = ship.baseCoolDown;
    }
  }
  update(dt, ship) {
    for (var i = 0; i < this.vx.length; i++) {
      var distx = this.x[i] - ship.position.x;
      var disty = this.y[i] - ship.position.y;
      this.x[i] += (this.vx[i] * dt) / 20;
      this.y[i] += (this.vy[i] * dt) / 20;
      if (Math.sqrt(distx * distx + disty * disty) > 2500) {
        this.vx.splice(i, 1); // ship.cx - mx / 1000;
        this.vy.splice(i, 1); //ship.cy - my / 1000;
        this.x.splice(i, 1); //ship.x;
        this.y.splice(i, 1); //ship.y;
        this.width.splice(i, 1);
        this.height.splice(i, 1);
      }
    }
  }
  drawBullets(context, ship) {
    for (var i = 0; i < this.vx.length; i++) {
      context.fillRect(
        this.x[i] - ship.position.x + ship.position.cx - this.width[i] / 2,
        this.y[i] - ship.position.y + ship.position.cy - this.height[i] / 2,
        this.width[i],
        this.height[i]
      );
    }
  }
}

 class EnemyShips {
  constructor() {
    this.vx = [];
    this.vy = [];
    this.x = [];
    this.y = [];
    this.ax = [];
    this.ay = [];
    this.width = [];
    this.height = [];
    this.ang = [];
    this.cimg = [];
    this.health = [];
    this.img = new Image();
    this.img.src =
      "./images/adff.png";
  }
  add(numShips, mW, mH) {
    for (var i = 0; i < numShips; i++) {
      this.vx.push(0);
      this.vy.push(0);
      this.x.push(Math.random() * mW);
      this.y.push(Math.random() * mH);
      this.ax.push(0);
      this.ay.push(0);
      this.width.push(50);
      this.height.push(50);
      this.ang.push(0);
      this.cimg.push(0);
      this.health.push(Math.random() * 500 + 150);
    }
  }
  drawShips(context, ship) {
    for (var i = 0; i < this.vx.length; i++) {
      context.drawImage(
        this.img,
        0,
        0,
        485,
        710,
        this.x[i] - ship.position.x + ship.position.cx - this.width[i] / 2,
        this.y[i] - ship.position.y + ship.position.cy - this.height[i] / 2,
        this.width[i],
        this.height[i]
      );
    }
  }
  update(deltaTime, ship, bullets) {
    for (var i = 0; i < this.vx.length; i++) {
      this.x[i] += (this.vx[i] * deltaTime) / 20;
      this.y[i] += (this.vy[i] * deltaTime) / 20;
      this.vx[i] += this.ax[i];
      this.vy[i] += this.ay[i];
      var hypv = Math.sqrt(this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i]);
      if (hypv > 2) {
        this.vx[i] /= hypv;
        this.vy[i] /= hypv;
        this.vx[i] *= 4;
        this.vy[i] *= 4;
      }
      var distx = ship.position.x - this.x[i];
      var disty = ship.position.y - this.y[i];
      if (Math.sqrt(distx * distx + disty * disty) < ship.width) {
        this.vx.splice(i, 1); // ship.cx - mx / 1000;
        this.vy.splice(i, 1); //ship.cy - my / 1000;
        this.x.splice(i, 1); //ship.x;yh
        this.y.splice(i, 1); //ship.y;
        this.ax.splice(i, 1); //ship.x;
        this.ay.splice(i, 1);
        this.width.splice(i, 1);
        this.height.splice(i, 1);
        this.ang.splice(i, 1);
        this.cimg.splice(i, 1);
        this.health.splice(i, 1);
        ship.health -= ((3 + Math.random() * 15) * ship.shield) / 100;
      } else if (Math.sqrt(distx * distx + disty * disty) < 3000) {
        var hyp = Math.sqrt(distx * distx + disty * disty) / 15;
        if (hyp > 0) {
          this.ax[i] = distx / hyp;
          this.ay[i] = disty / hyp;
        } else {
          this.ax[i] = 0 * distx;
          this.ay[i] = 0 * disty;
        }
      }
      if (this.cimg[i] > 25 || this.cimg[i] === 0) {
        this.cimg[i] = 11;
      } else this.cimg[i] += 4;
      for (var j = 0; j < bullets.x.length; j++) {
        var dx = bullets.x[j] - this.x[i];
        var dy = bullets.y[j] - this.y[i];
        if (Math.sqrt(dx * dx + dy * dy) < this.width[i]) {
          this.health[i] -= ship.blasterDamage * 3;
          if (this.health[i] <= 0) {
            ship.money += 10 + Math.floor(Math.random() * 35);
            this.vx.splice(i, 1); // ship.cx - mx / 1000;
            this.vy.splice(i, 1); //ship.cy - my / 1000;
            this.x.splice(i, 1); //ship.x;yh
            this.y.splice(i, 1); //ship.y;
            this.ax.splice(i, 1); //ship.x;
            this.ay.splice(i, 1);
            this.width.splice(i, 1);
            this.height.splice(i, 1);
            this.ang.splice(i, 1);
            this.cimg.splice(i, 1);
            this.health.splice(i, 1);
          }
        }
      }
    }
  }
  draw(context, ship) {
    for (var i = 0; i < this.vx.length; i++) {
      context.save();
      context.translate(
        this.x[i] - ship.position.x + ship.position.cx - this.width[i] / 2,
        this.y[i] - ship.position.y + ship.position.cy - this.height[i] / 2
      );
      if (this.vx[i] !== 0) {
        this.ang[i] =
          Math.acos(
            this.vx[i] /
              Math.sqrt(this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i])
          ) -
          Math.PI / 2;
      } else this.ang[i] = 0;
      if (this.vx[i] > 0 && this.vy[i] < 0) this.ang[i] *= -1;
      else if (this.vx[i] < 0 && this.vy[i] < 0) this.ang[i] *= -1;
      else if (this.vx[i] < 0 && this.vy[i] > 0) this.ang[i] -= Math.PI;
      else if (this.vx[i] > 0 && this.vy[i] > 0) this.ang[i] += Math.PI;

      context.translate(this.width[i] / 2, this.width[i] / 2);
      context.rotate(this.ang[i]);
      context.drawImage(
        this.img,
        345 * Math.floor(this.cimg[i] / 10),
        0,
        345,
        515,
        -this.width[i] / 2,
        -this.height[i] / 2,
        this.width[i],
        this.height[i]
      );
      context.restore();
    }
  }
  gravity(stars, numstars) {
    for (var j = 0; j < this.vx.length; j++) {
      for (var i = 0; i < numstars; i++) {
        var dx = stars.sx[i] - this.x[j];
        var dy = stars.sy[i] - this.y[j];

        var r = Math.sqrt(dx * dx + dy * dy);
        var force = (2e-4 * (stars.mass[i] * 1)) / r / r;
        if (r < 20) r = 20;
        dx /= Math.sqrt(r);
        dx *= force;
        dy /= Math.sqrt(r);
        dy *= force;
        if (dx > 100 || dy > 100) {
          dx /= 2;
          dy /= 2;
        }
        this.vx[j] += dx;
        this.vy[j] += dy;
        var distx = stars.sx[i] - this.x[j];
        var disty = stars.sy[i] - this.y[j];
        if (Math.sqrt(distx * distx + disty * disty) < stars.width[i] / 2) {
          this.vx.splice(j, 1); // ship.cx - mx / 1000;
          this.vy.splice(j, 1); //ship.cy - my / 1000;
          this.x.splice(j, 1); //ship.x;yh
          this.y.splice(j, 1); //ship.y;
          this.ax.splice(j, 1); //ship.x;
          this.ay.splice(j, 1);
          this.width.splice(j, 1);
          this.height.splice(j, 1);
          this.ang.splice(j, 1);
          this.cimg.splice(j, 1);
          this.health.splice(j, 1);
        }
      }
    }
  }
}

 class InputHandler {
  constructor(ship, player, bullets, enemyShips, store, gW, gH) {
    this.mx = 0;
    this.my = 0;

    document.addEventListener("mousemove", e => {
      this.mx = e.clientX;
      this.my = e.clientY;
    });
    document.addEventListener("mousedown", e => {
      this.mx = e.clientX;
      this.my = e.clientY;
      if (player.gameState === 2)
        store.buy(ship, this.mx, this.my, gW, gH, player);
    });
    document.addEventListener("keydown", event => {
      if (player.gameState === 3) {
        window.location.reload();
        player.gameState = 0;
      }
      switch (event.keyCode) {
        case 8:
          ship.baseCoolDown--;
          break;
        case 16:
          if (player.gameState === 1) player.gameState = 0;
          else player.gameState = 1;
          break;
        case 32:
          ship.shooting = !ship.shooting;
          bullets.add(this.mx, this.my, ship);
          break;
        case 87:
          //ship.adjustMouse(this.mx, this.my);
          ship.acc = true;
          break;
        case 83:
          //ship.adjustMouse(this.mx, this.my);
          if (player.gameState !== 2) player.gameState = 2;
          else player.gameState = 0;
          break;
        case 46:
          enemyShips.add(10, 10000, 10000);
          break;
        case 69:
          enemyShips.add(10, 10000, 10000);
          break;
        case 68:
          ship.moveRight();
          break;
        case 9:
          ship.deltax = 0;
          ship.deltay = 0;
          break;
        case 65:
          ship.moveLeft();
          break;
        default:
          break;
      }
      document.addEventListener("keyup", event => {
        switch (event.keyCode) {
          case 87:
            ship.acc = false;
            break;
          case 32:
            //ship.shooting = false;
            //bullets.add(this.mx, this.my, ship);
            break;
          default:
            break;
        }
      });
    });
  }
}

 class Player {
  constructor() {
    this.money = 100;
    this.gameState = 0;
  }
}

class Store {
  constructor() {
    this.img = new Image();
    this.img.src =
      "./images/store.png";
  }
  draw(ship, ctx, input, gW, gH) {
    ctx.drawImage(this.img, 0, 0, 1024, 770, 0, 0, gW, gH);
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "blue";
    if (
      Math.floor(input.my / (gH / 3)) === 2 &&
      Math.floor(input.mx / (gW / 3)) < 2
    );
    else {
      ctx.fillRect(
        (Math.floor(input.mx / (gW / 3)) * gW) / 3,
        (Math.floor(input.my / (gH / 3)) * gH) / 3,
        gW / 3,
        gH / 3
      );
    }
    ctx.font = (50 / 874) * gH + "px Cookie";
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#000";
    ctx.fillText(
      "$" + Math.floor(ship.money),
      (131 / 874) * gW,
      0.75 * gH,
      (245 / 873) * gW
    );
    ctx.fillText(
      Math.floor(ship.health),
      (131 / 874) * gW,
      (535 / 665) * gH,
      (245 / 873) * gW
    );
    ctx.fillText(
      Math.floor(ship.mass),
      (131 / 874) * gW,
      (575 / 665) * gH,
      (245 / 873) * gW
    );

    ctx.fillText(
      "" + Math.floor(ship.baseAccel),
      (500 / 874) * gW,
      0.75 * gH,
      (245 / 873) * gW
    );
    ctx.fillText(
      Math.floor(15 + ship.blasterDamage),
      (500 / 874) * gW,
      (535 / 665) * gH,
      (245 / 873) * gW
    );
    ctx.fillText(
      Math.floor(100 - ship.baseCoolDown),
      (500 / 874) * gW,
      (575 / 665) * gH,
      (245 / 873) * gW
    );

    ctx.globalAlpha = 1;
  }
  buy(ship, mx, my, gW, gH, player) {
    var x = Math.floor(mx / (gW / 3));
    var y = Math.floor(my / (gH / 3));
    var c = x + y * 3;
    switch (c) {
      case 0:
        if (ship.money >= 100 && ship.baseCoolDown > 2) {
          ship.money -= 100;
          ship.baseCoolDown -= 1;
        }
        break;
      case 1:
        if (ship.money >= 150) {
          ship.money -= 150;
          ship.shield *= 0.98;
        }
        break;
      case 2:
        if (ship.money >= 125) {
          ship.money -= 125;
          ship.blasterDamage += 15 / ship.blasterDamage;
        }
        break;
      case 3:
        if (ship.money >= 250) {
          ship.money -= 250;
          ship.baseAccel += 60 / ship.baseAccel;
        }
        break;
      case 4:
        if (ship.money >= 500) {
          ship.money -= 500;
          ship.mass -= 5000 / ship.mass;
        }
        break;
      case 5:
        if (ship.money >= 75) {
          ship.money -= 75;
          ship.health += 15;
        }
        break;
      case 8:
        player.gameState = 0;
        break;
      default:
        break;
    }
  }
}


 class Ship {
  constructor(gameWidth, gameHeight, mapWidth, mapHeight, eShips) {
    this.money = 1500;
    this.width = 80;
    this.height = 80;
    this.deltax = 0;
    this.deltay = 0;
    this.accelx = 0;
    this.accely = 0;
    this.coolDown = 10;
    this.baseCoolDown = 50;
    this.ang = 0;
    this.acc = false;
    this.shooting = false;
    this.cimg = 0;
    this.health = 350;
    this.mass = 1000;
    this.shield = 100;
    this.blasterDamage = 1;
    this.baseAccel = 30;
    var img = new Image(); // Create new img element
    img.src =
      "./images/asdf.png";
    this.image = img;
    this.position = {
      cx: gameWidth / 2,
      cy: gameHeight / 2,
      x: mapWidth / 2,
      y: mapHeight / 2
    };
  }
  draw(ctx, screenWidth, screenHeight) {
    ctx.save();
    ctx.translate(
      screenWidth / 2 - this.width / 2,
      screenHeight / 2 - this.height / 2
    );
    //this.ang = Math.atan(this.deltay / this.deltax);
    ctx.translate(this.width / 2, this.width / 2);
    ctx.rotate(this.ang);
    ctx.drawImage(
      this.image,
      342 * Math.floor(this.cimg / 10),
      0,
      342,
      450,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
  drawWide(ctx, mapWidth, mapHeight, gameWidth, gameHeight) {
    ctx.fillRect(
      (gameWidth * this.position.x) / mapWidth,
      (gameHeight * this.position.y) / mapHeight,
      10,
      10
    );
  }
  update(dt, bullets) {
    if (this.acc) {
      this.accel();
      if (this.cimg > 25 || this.cimg === 0) {
        this.cimg = 11;
      } else this.cimg += 4;
    } else this.cimg = 0;
    if (this.shooting) bullets.add(this);
    this.deltax += this.accelx / 5000;
    this.deltay += this.accely / 5000;
    var vh = Math.sqrt(this.deltax * this.deltax + this.deltay * this.deltay);
    if (vh > 1) {
      this.deltax /= vh / 1;
      this.deltay /= vh / 1;
    }
    if (dt > 0) {
      this.position.x += this.deltax * dt;
      this.position.y += this.deltay * dt;
    } else return;
    this.coolDown -= dt / 7;
  }
  moveLeft() {
    this.ang += 0.1745329251;
  }
  moveRight() {
    this.ang -= 0.1745329251;
  }
  adjustMouse(x, y) {
    this.accelx = x - this.position.cx;
    this.accely = y - this.position.cy;
    var hyp =
      Math.sqrt(this.accelx * this.accelx + this.accely * this.accely) / 200;
    this.accelx /= hyp;
    this.accely /= hyp;
    return;
  }
  accel() {
    this.accelx = this.baseAccel * Math.sin(this.ang) * (1000 / this.mass);
    this.accely = -this.baseAccel * Math.cos(this.ang);
  }
  gameOver(player) {
    player.gameState = 3;
  }
  gravity(stars, numstars, player, mW, mH) {
    this.accelx = 0;
    this.accely = 0;
    for (var i = 0; i < numstars; i++) {
      var dx = stars.sx[i] - this.position.x;
      var dy = stars.sy[i] - this.position.y;
      if (
        Math.sqrt(dx * dx + dy * dy) < stars.width[i] / 2 ||
        this.health <= 0
      ) {
        this.gameOver(player);
      }
      if (
        this.position.x > mW ||
        this.position.x + this.position.cx < 0 ||
        this.position.y > mH ||
        this.position.y + this.position.cy < 0
      ) {
        this.gameOver(player);
      }
      var r = Math.sqrt(dx * dx + dy * dy);
      var force = (1e-3 * (stars.mass[i] * 1)) / r / r;
      if (r < 20) r = 20;

      dx /= Math.sqrt(r);
      dx *= force;
      dy /= Math.sqrt(r);
      dy *= force;
      if (dx > 100 || dy > 100) {
        dx /= 2;
        dy /= 2;
      }
      this.accelx += dx;
      this.accely += dy;
    }
  }
}

 class Stars {
  constructor(mapWidth, mapHeight, numStars) {
    this.number = numStars;
    this.sx = [];
    this.sy = [];
    this.width = [];
    this.height = [];
    this.mass = [];
    for (var i = 0; i < numStars; i++) {
      this.sx.push(Math.random() * mapWidth);
      this.sy.push(Math.random() * mapHeight);
      this.width.push(Math.random() * 500 + 250);
      this.height.push(this.width[i]);
      this.mass.push(this.width[i] * this.height[i] * 500);
    }
    this.img = new Image();
    this.img.src =
      "https://i349.photobucket.com/albums/q384/jaulicino/paper%20planet_zpsxvuivyh3.png";
  }

  draw(ctx, ship, numstars) {
    for (var i = 0; i < numstars; i++) {
      ctx.drawImage(
        this.img,
        0,
        0,
        655,
        655,
        this.sx[i] - ship.position.x + ship.position.cx - this.width[i] / 2,
        this.sy[i] - ship.position.y + ship.position.cy - this.height[i] / 2,
        this.width[i],
        this.height[i]
      );
    }
  }
  drawWide(ctx, numstars, mapWidth, mapHeight, gameWidth, gameHeight) {
    for (var i = 0; i < numstars; i++) {
      ctx.fillRect(
        (gameWidth * this.sx[i]) / mapWidth,
        (gameHeight * this.sy[i]) / mapHeight,
        10,
        10
      );
    }
  }
}

class Background {
  constructor() {
    this.img = new Image();
    this.img.src =
      "./images/bground.png";
  }
  draw(ship, ctx, iW, iH, mW, mH) {
    for (var i = 0; i < mW / iW; i++) {
      for (var j = 0; j < mH / iH; j++) {
        ctx.drawImage(
          this.img,
          0,
          0,
          1023,
          598,
          i * iW - ship.position.x,
          j * iH - ship.position.y,
          iW,
          iH
        );
      }
    }
  }
}




const MAP_WIDTH = 10000;
const MAP_HEIGHT = 10000;
const GAME_WIDTH = screen.width - 50;
const GAME_HEIGHT = screen.height - 180;
const NUMSTARS = 9;
let canvas = document.getElementById("gameScreen");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let ctx = canvas.getContext("2d");
let enemyShips = new EnemyShips();

let ship = new Ship(GAME_WIDTH, GAME_HEIGHT, MAP_WIDTH, MAP_HEIGHT, enemyShips);
ship.draw(ctx);

let background = new Background();

let bullets = new Bullet();

let player = new Player();
let store = new Store();

let input = new InputHandler(
  ship,
  player,
  bullets,
  enemyShips,
  store,
  GAME_WIDTH,
  GAME_HEIGHT,
  MAP_WIDTH,
  MAP_HEIGHT
);

let stars = new Stars(MAP_WIDTH, MAP_HEIGHT, NUMSTARS);

ctx.fillStyle = "#000";
ctx.fillRect(20, 20, 100, 100);

let lastTime = 0;

function wide(deltaTime) {
  ctx.fillStyle = "#FF0";
  stars.draw(ctx, ship, NUMSTARS);
  ctx.fillStyle = "#fa0";
  bullets.drawBullets(ctx, ship, bullets);
  ctx.fillStyle = "#00F";
  ship.update(deltaTime, bullets);
  ship.draw(ctx, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = "#F00";
  enemyShips.update(deltaTime, ship, bullets);
  enemyShips.draw(ctx, ship);
  bullets.update(deltaTime, ship);
  ship.gravity(stars, NUMSTARS, player, MAP_WIDTH, MAP_HEIGHT);
  enemyShips.gravity(stars, NUMSTARS);
  ctx.fillStyle = "#FFF";
  ctx.fillText("$" + ship.money, 25, 25);
  ctx.fillText("Health: " + ship.health, 25, 50);
}
function map(deltaTime) {
  ctx.fillStyle = "#ff0";
  ship.update(deltaTime, bullets);
  stars.drawWide(ctx, NUMSTARS, MAP_WIDTH, MAP_HEIGHT, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = "#00F";
  ship.drawWide(ctx, MAP_WIDTH, MAP_HEIGHT, GAME_WIDTH, GAME_HEIGHT);
  ship.gravity(stars, NUMSTARS, player, MAP_WIDTH, MAP_HEIGHT);
  enemyShips.gravity(stars, NUMSTARS);
}

function gameLoop(timestamp) {
  ctx.font = (20 / 874) * GAME_HEIGHT + "px Cookie";
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = "#000";
  //ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  if (player.gameState !== 1) {
    if (Math.random() < 0.5) ctx.fillStyle = "#c00";
    else ctx.fillStyle = "#00c";
    ctx.fillRect(
      -ship.position.x - 1000,
      -ship.position.y - 1000,
      MAP_WIDTH + 2000,
      MAP_HEIGHT + 2000
    );
    background.draw(ship, ctx, 1023, 589, MAP_WIDTH, MAP_HEIGHT);
  } else ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = "#000";
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  if (player.gameState === 1) map(deltaTime);
  else if (player.gameState === 0) wide(deltaTime);
  else if (player.gameState === 2) {
    store.draw(ship, ctx, input, GAME_WIDTH, GAME_HEIGHT);
  } else if (player.gameState === 3) {
    ctx.font = "80px Cookie";
    ctx.fillText("GAME OVER", GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 30);
    ctx.font = "30px Cookie";
    ctx.fillText(
      "Press Any Key to Continue",
      GAME_WIDTH / 2 - 150,
      GAME_HEIGHT / 2 + 30
    );
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();

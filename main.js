const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

c.width = window.innerWidth - 4;

c.height = window.innerHeight - 4;

const up = document.getElementById("up");
const down = document.getElementById("down");
const left = document.getElementById("left");
const right = document.getElementById("right");
const bg = document.getElementById("bg");
const imgkey = document.getElementById("imgkey");
const slideImg = document.getElementById("slide");
const dartbullet = document.getElementById("dartbullet");

const imghomingbullet = document.getElementById("homingbullet");
const imgenemybullet = document.getElementById("bullet2");

const imgnitroboost = document.getElementById("nitroboost");
const shop = document.getElementById("bg3");
const bg4 = document.getElementById("bg4");
const life = document.getElementById("alivelife");
const lifeDead = document.getElementById("deadlife");
const hole1 = document.getElementById("hole1");
const hole2 = document.getElementById("hole2");
const imggun = document.getElementById("glock");
const imggunshoot = document.getElementById("glock shoot");
const imggun2 = document.getElementById("glock2");
const imggunshoot2 = document.getElementById("glock shoot2");
const imgshoes = document.getElementById("shoe");
const imghut = document.getElementById("hut");
const imggrenade = document.getElementById("grenade");
const imgpoison = document.getElementById("poison");
const deadplayer = document.getElementById("deadplayer");
const imgcage = document.getElementById("cage");
const imgmerchant = document.getElementById("merchant");
const imgwall = document.getElementById("wall");
const spritesheet = document.getElementById("spritesheetboss");
const imgbullet = document.getElementById("bulletsprite");
const spritesheet2 = document.getElementById("spritesheetboss2");
const imgcoins = document.getElementById("coins");
const imgcoin = document.getElementById("coin");
const deadboy = document.getElementById("deadenemy");
const imgtikitrophy = document.getElementById("tiki");

const dart = document.getElementById("dart");
const homingdart = document.getElementById("homingdart");


const bomber = document.getElementById("bomber");
const skelly = document.getElementById("skelly");
const atk = document.getElementById("skellyatk");
const golem = document.getElementById("golem");
const hog = document.getElementById("hog");
const hogatk = document.getElementById("hogatk");

var atkwave = document.getElementById("wave");

let fireballImg = document.getElementById("fireball");
const creak = new Audio("creak.mp3");
const cash = new Audio("cash.mp3");
const getscoin = new Audio("gets coins.mp3");
const getshurt2 = new Audio("gets hurt 2.mp3");
const getshurt = new Audio("gets hurt.mp3");
const nextlevelsound = new Audio("goes to next level.mp3");
const punchsound = new Audio("punches.mp3");
const tikisound = new Audio("tikitotem spawn in.mp3");
const music = new Audio("most terrible bass.mp3");

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
c.addEventListener("mousedown", mousedownHandler);
c.addEventListener("mouseup", mouseupHandler);
c.addEventListener("mousemove", mousemoveHandler);

function keydownHandler(event) {
  input[event.key.toLowerCase()] = true;
}

function keyupHandler(event) {
  input[event.key.toLowerCase()] = false;
}

function mousedownHandler(event) {
  mouse.down = true;
}

function mouseupHandler(event) {
  mouse.down = false;
}

function mousemoveHandler(event) {
  let rect = c.getBoundingClientRect();

  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
}

let timer = 1;
let sizemultiplier = 1;
let money = 0;
let level = 1;
let mouse = {};
let frameCount = 0;
let input = {};
let enemies = [];
let boxes = [];
let enemiesdefeated = 0;
let enemydifficulty = 1;
let enemiesperwave = 4;
let wave = 1;
let countdown = [];
let spawnfrequency = 150;
let areas = {};
let frameRate;

let animLoop = { maxFps: 50 };

let player = {
  turbobar: 200,
  turbo: 200,
  x: 170,
  y: 130,
  w: 90,
  h: 70,
  i: dart,
  animY: 0,
  animX: 0,
  gunI: imggun,
  gunI2: imggun2,
  speed: 5,
  alpha: 1,
  vx: 0,
  vy: 0,
  bCooldown: 0,
  gCooldown: 0,
  invincibility: 0,
  hp: Infinity,
  name: "player",
  area: "start",
  bSpeed: 12,
  gSpeed: 4,
  bReload: 50,
  gReload: 50 * 2,
  draw: function () {
    this.invincibility--;
    this.bCooldown--;
    this.gCooldown--;
    

    this.blink();
    this.shoot();
    this.throw();

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(dart, this.animX, this.animY, 125, 125, this.x, this.y, this.w, this.h);
    ctx.globalAlpha = 1;
    if (frameCount % 2 == 0){
      atkwave = document.getElementById("wave2");
    } else {
      atkwave = document.getElementById("wave");
  }
    ctx.save();
    const center = getCenter(this);
    ctx.translate(center.x, center.y);
    ctx.rotate(this.facing);
    if (input.shift && this.turbo > 0){
    ctx.drawImage(this.gunI, -200 / 2, -50 / 2, 200, 70);
    // ctx.rotate(3);
    ctx.drawImage(atkwave, -130 / 2, -129 / 2, 130, 129);
      this.bCooldown -= 10;
    } else {
    ctx.drawImage(this.gunI, -140 / 2, -32 / 2, 140, 32);
  }
    ctx.restore();
  },

  move: function () {
    if (!input.shift){
    this.turbo += 0.3;
    }
    if (this.turbo >= this.turbobar){
      this.turbo = this.turbobar
    }
    if (input.a) {
      this.vx = -player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else if (input.d) {
      this.vx = player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else {
      this.vx = 0;
    }

    if (input.w) {
      this.vy = -player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else if (input.s) {
      this.vy = player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else {
      this.vy = 0;
    }
    

    this.facing = angleTo(this, mouse).angle;
    this.animY = (Math.round((this.facing * 9) / Math.PI + 9) % 18) * 141;

    if (!input.a && !input.d && !input.w && !input.s) {
      this.vy = 0;
      this.animX = 0;
    }

    if ((input.a || input.d) && (input.w || input.s)) {
      const speed = Math.sqrt(this.speed ** 2 / 2);

      this.vx = Math.sign(this.vx) * speed;
      this.vy = Math.sign(this.vy) * speed;
    }
    if (input.shift && this.turbo > 0){
      this.turbo -= 2;
      this.x += this.vx * 1.8;
      this.y += this.vy * 1.8;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }
    if(this.turbo <= 0){
      this.turbo = 0
  }
  },

  blink: function () {
    if (this.invincibility == 0) {
      return (this.alpha = 1);
    } else if (this.invincibility > 0) {
      this.alpha = Math.abs(Math.sin(1.01 ** (340 - this.invincibility) / 1.01));
    }
  },

  shoot: function () {
    if (this.bCooldown <= 0 && mouse.down) {
      this.bCooldown = this.bReload;
      if (input.shift && this.turbo > 0){
      new Projectile(this, this.x + 60 * Math.cos(this.facing -  0.2), this.y + 60 * Math.sin(this.facing -  0.2), "bullet2", this.bSpeed + 10);
      } else{
        new Projectile(this, this.x + 60 * Math.cos(this.facing), this.y + 60 * Math.sin(this.facing), "bullet", this.bSpeed);
      }
      this.gunI = imggunshoot;
      this.gunI2 = imggunshoot2;
      // new Enemy(100, 100, 3)
    } else if (this.bCooldown <= this.bReload - this.bReload/13) player.gunI = imggun, player.gunI2 = imggun2;
  },
  throw: function () {
    if (this.gCooldown <= 0 && input.e) {
      this.gCooldown = this.gReload;
      new Projectile(this, this.x, this.y, "grenade", this.gSpeed);
    }
  },



  hurtCallback() {
    const owner = this.owner;

    if (owner.invincibility <= 0) {
      new Audio("hurt.mp3").play();
      owner.hp--;
      owner.invincibility = 150;
    }
  },

  moveAreas(newArea) {
    const thisArea = areas[this.area];

    removeFromArray(this, thisArea.col);
    removeFromArray(this, thisArea.hurt);

    areas[newArea].col.push(this);
    areas[newArea].hurt.push(this);

    this.area = newArea;
  },
};

let cage = {
  x: 200,
  y: 300,
  w: 100,
  h: 100,
  i: imgcage,
  name: "cage",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

let tikitrophy = {
  x: c.width / 2 - 150,
  y: 290,
  w: 100,
  h: 100,
  i: imgtikitrophy,
  name: "tikitrophy",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

let gunItem = {
  x: c.width / 2,
  y: 290,
  w: 100,
  h: 100,
  i: imggun,
  name: "gun",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

let shoes = {
  x: c.width / 2 + 150,
  y: 290,
  w: 100,
  h: 100,
  i: imgshoes,
  name: "shoes",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

// let key = {
//   x: c.width / 2 - 150,
//   y: 290,
//   w: 100,
//   h: 100,
//   i: imgkey,
//   name: "key",
//   draw: function () {
//     ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
//   },
// };
// hut.y
let hut = {
  x: c.width / 2 - 120,
  y: c.height / 7,
  w: 250,
  h: 250,
  i: imghut,
  name: "hut",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

let merchant = {
  x: c.width / 2 - 200,
  y: c.height / 15,
  w: 400,
  h: 200,
  i: imgmerchant,
  name: "hut",
  draw: function () {
    ctx.drawImage(this.i, getAnimX(2, 16, 200, 99), 0, 16, 16, this.x, this.y, this.w, this.h);
  },
};

let background = {
  i: bg,
  x: 0,
  y: 0,
  w: 1401,
  h: 1745,
  draw: function () {
    if (player.area == "start"){
    background.y += player.vy / 2;
    }

    ctx.drawImage(background.i, 0, (background.y / c.height) * (1745 / 2), this.w, this.h / 2, 0, 0, c.width, c.height);
  },
};

class Box {
  constructor(owner, cx, cy, cw, ch, callback, wallSize) {
    this.owner = owner;
    this.cx = cx;
    this.cy = cy;
    this.cw = cw;
    this.ch = ch;
    this.callback = callback;
    this.wallSize = wallSize;

    boxes.push(this);
  }

  getPos() {
    return {
      x: this.owner.x + this.owner.w * this.cx,
      y: this.owner.y + this.owner.h * this.cy,
      w: this.owner.w * this.cw,
      h: this.owner.h * this.ch,
    };
  }

  draw() {
    let pos = this.getPos();

    ctx.strokeRect(pos.x, pos.y, pos.w, pos.h);
  }
}
let explodewhen = 0;

class Projectile {
  constructor(attacker, x, y, type, speed) {
    this.x = x;
    this.y = y;
    this.angle = attacker.facing;
    this.speed = speed;
    this.name = "projectile";
    this.type = type;
    this.area = attacker.area;
    this.hit = 0;
    this.exploded = false
    this.attacker = attacker;
    new Audio("shoot.mp3").play();

    if (this.type == "bullet") {
      this.i = fireballImg;
      this.rowNum = 3;
      this.frameSpeed = 15;
      this.frameW = 240;
      this.frameH = 200;
      this.callback = this.bCallback;

      this.w = 50 * sizemultiplier;
      this.h = 50 * sizemultiplier;
      new Audio("shot.mp3").play();
    }

    if (this.type == "bullet2") {
      this.i = fireballImg;
      this.rowNum = 3;
      this.frameSpeed = 15;
      this.frameW = 240;
      this.frameH = 200;
      this.callback = this.bCallback;

      this.w = 60 * sizemultiplier;
      this.h = 60 * sizemultiplier;
      new Audio("shot.mp3").play();
    }

    if (this.type == "enemybullet") {
      this.i = fireballImg;
      this.rowNum = 3;
      this.frameSpeed = 15;
      this.frameW = 240;
      this.frameH = 200;
      // this.callback = this.ebCallback;

      this.w = 50 * sizemultiplier;
      this.h = 50 * sizemultiplier;
    }

    if (this.type == "grenade") {
      this.i = imggrenade;
      this.rowNum = 11;
      this.frameSpeed = 5.5;
      this.frameW = 122;
      this.frameH = 116;
      this.callback = this.gCallback;

      this.w = 50 * sizemultiplier;
      this.h = 50 * sizemultiplier;
    }

    this.hitbox = new Box(this, 0.2, 0.3, 0.6, 0.6, this.callback);
    this.colbox = new Box(this, 0.2, 0.3, 0.6, 0.6, this.callback);

    areas[this.area].col.push(this);
    areas[this.area].hit.push(this);
    this.getVelocity();
  }

  getVelocity() {
    this.vy = Math.sin(this.angle) * this.speed;
    this.vx = Math.cos(this.angle) * this.speed;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  gCallback(col) {
    if (!this.exploded){
      this.explodex = this.x
      this.explodey = this.y
      this.explodeownerx = this.owner.x
      this.explodeownery = this.owner.y
      this.owner.w = 400 * sizemultiplier;
      this.owner.h = 400 * sizemultiplier;
      this.x = this.explodex - 200 * sizemultiplier;
      this.y = this.explodey - 200 * sizemultiplier;
      this.owner.x = this.explodeownerx - 200 * sizemultiplier;
      this.owner.y = this.explodeownery - 200 * sizemultiplier;  
      explodewhen = frameCount;
    }
    this.exploded = true
    const thisP = col.owner;
    thisP.i = imgpoison;
    removeFromArray(thisP, areas[thisP.area].col);
    areas[thisP.area].draw.push(thisP);
    thisP.vx = 0;
    thisP.vy = 0;
    countdown.push(this);
    console.log(explodewhen);
  }
  countdown() {
    if (explodewhen + 20 <= frameCount) {
      this.x += 20;
      this.y += 20;
      this.h -= 40;
      this.w -= 40;
      if (this.w <= 0 || this.h <= 0){
        this.w = 0
        this.h = 0
      }
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.rotate(this.angle);
    ctx.drawImage(this.i, getAnimX(this.rowNum, this.frameSpeed, this.frameW), 0, this.frameW, this.frameH, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }
  bCallback(col, obst) {
    removeFromArray(col.owner, areas[col.owner.area].col);
    removeFromArray(col.owner, areas[col.owner.area].hit);
  }
  ebCallback(col, obst) {
    removeFromArray(col.owner, areas[col.owner.area].col);
    removeFromArray(col.owner, areas[col.owner.area].hit);
  }
}

class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 80;
    this.vx = 0;
    this.vy = 0;
    this.dead = false;
    this.speed = 1;
    this.bSpeed = 2;
    this.name = "enemy";
    this.area = "start";
    this.type = type;
    // this.launchedx = false;
    // this.launchedy = false;
    // this.launched = true;


    // type = Math.ceil(Math.random() * 5);
    this.target = player;
    this.colbox = new Box(this, 0.3, 0.2, 0.4, 0.5);
    this.hitbox = new Box(this, 0.3, 0.2, 0.4, 0.5);
    this.hurtbox = new Box(this, 0.3, 0.2, 0.4, 0.5, this.hurtCallback);

    if (this.type !== "8"){
    }
    areas[this.area].col.push(this);
    areas[this.area].hit.push(this);
    areas[this.area].hurt.push(this);

    enemies.push(this);
    // if (this.type == "1"){
    //   this.i = hog;
    //   this.rowNum = 8;
    //   this.frameSpeed = 5;
    //   this.frameW = 208;
    //   this.frameH = 219;

    //   this.w = 80;
    //   this.h = 80;
    // }
  }

  move() {
    const targetC = getCenter(this.target);
    const thisC = getCenter(this);

    if (this.type != "8" && this.type != "9" ) {
      let run = targetC.x - thisC.x;
      let rise = targetC.y - thisC.y;
      this.angle = Math.atan2(rise, run);

      if (run) this.vx = this.speed * Math.cos(this.angle); 
      if (rise) this.vy = this.speed * Math.sin(this.angle);
    } else {
      if (this.type != "9") {
        let run = targetC.x - thisC.x;
        let rise = targetC.y - thisC.y;
        this.angle = Math.atan2(rise, run);
        if (run && !this.launchedx) this.vx = this.speed * Math.cos(this.angle);  this.launchedx = true;
        if (rise && !this.launchedy) this.vy = this.speed * Math.sin(this.angle);  this.launchedy = true;
      } else if (frameCount % 7 == 0) {
        let run = targetC.x - thisC.x;
        let rise = targetC.y - thisC.y;
        this.angle = Math.atan2(rise, run);
        if (run) this.vx = this.speed * Math.cos(this.angle);
        if (rise) this.vy = this.speed * Math.sin(this.angle);
      }
    }
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    if (this.type == "4") {
      this.w = 90;
      this.h = 100;
      this.speed = 3.4;
      if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
      const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
      if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) < 150) {
        ctx.drawImage(hogatk, getAnimX(8, 4, 208), animY * 219, 208, 219, this.x, this.y, this.w, this.h);
      } else {
        ctx.drawImage(hog, getAnimX(8, 5, 208), animY * 219, 208, 219, this.x, this.y, this.w, this.h);
      }
    } else if (this.type == "3") {
      this.w = 60;
      this.h = 60;
      this.speed = 2.3;
      if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
      const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
      if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) < 150) {
        ctx.drawImage(atk, getAnimX(4, 2, 122), animY * 124, 122, 124, this.x, this.y, this.w, this.h);
      } else {
        ctx.drawImage(skelly, getAnimX(8, 7, 122), animY * 124, 122, 124, this.x, this.y, this.w, this.h);
      }
    } else if (this.type == "5") {
      this.speed = 1.1;
      this.w = 200;
      this.h = 133;
      if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
      const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
      ctx.drawImage(golem, getAnimX(12, 8, 200), animY * 149, 130, 160, this.x, this.y, this.w, this.h);
    } else if (this.type == "2") {
      this.w = 70;
      this.h = 70;
      // if ((Math.abs(this.x - Projectile.x) + Math.abs(this.y - Projectile.y)) < 100){
      //   this.target = Projectile;
      //   this.speed = -5;
      // } else
      if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) < 600) {
        this.speed = -5;
      } else if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) > 650) {
        this.speed = 5;
      } else {
        this.speed = 0;
      }
      const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
      if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
      ctx.drawImage(homingdart, getAnimX(8, 5, 129), animY * 141, 129, 141, this.x, this.y, this.w, this.h);
    } else if (this.type == "1") {
      this.w = 70;
      this.h = 70;
      // if ((Math.abs(this.x - Projectile.x) + Math.abs(this.y - Projectile.y)) < 100){
      //   this.target = Projectile;
      //   this.speed = -5;
      // } else
      if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) < 600) {
        this.speed = -5;
      } else if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) > 650) {
        this.speed = 5;
      } else {
        this.speed = 0;
      }
      const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
      if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
      ctx.drawImage(dart, getAnimX(8, 5, 129), animY * 141, 129, 141, this.x, this.y, this.w, this.h);
    } else if (this.type == "3") {
      this.speed = 2.1;
      this.w = 60;
      this.h = 60;
      const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
      if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
      ctx.drawImage(bomber, getAnimX(10, 8, 142), animY * 215, 142, 215, this.x, this.y, this.w, this.h);
    } else if (this.type == "6") {
      this.speed = 1.2;
      this.w = 150;
      this.h = 100;
      if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
      const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
      ctx.drawImage(golem, getAnimX(12, 8, 200), animY * 149, 130, 160, this.x, this.y, this.w, this.h);
    // bullets
    } else if (this.type == "8") {
      this.speed = 9.2;
      this.w = 50;
      this.h = 50; 
      const animY = Math.round((this.angle * 8) / Math.PI + 8) % 16;
      ctx.drawImage(imgenemybullet, getAnimX(1, 8, 121), animY * 117, 121, 117, this.x, this.y, this.w, this.h);
      this.launched = false;
      // console.log(this.launched)
      this.name = "projectile";
    } else if (this.type == "9") {
      this.speed = 9.2;
      this.w = 50;
      this.h = 50;
      const animY = Math.round((this.angle * 8) / Math.PI + 8) % 16;
      ctx.drawImage(imghomingbullet, getAnimX(1, 8, 121), animY * 117, 121, 117, this.x, this.y, this.w, this.h);
    }
    this.shoot();
  }

  shoot() {
    if (frameCount % 250 == 0 && this.type == "1") {
      const targetC = getCenter(this.target);
      const thisC = getCenter(this);
      let e = targetC.x - thisC.x;
      let e2 = targetC.y - thisC.y;
      let grun = 0
      let grun2 = 0
      if (e) grun = 30 * Math.cos(this.angle);
      if (e2) grun2 = 30 * Math.sin(this.angle);
      new Audio("shoot2.mp3").play();
      new Enemy(this.x + grun, this.y + grun2, "8");
    }
    if (frameCount % Math.ceil(Math.random * 250) == 0 && this.type == "2") {
      new Audio("shoot2.mp3").play();
      new Enemy(this.x, this.y, "9");
    }
  }

  hurtCallback() {
    if (this.owner.type == "5") {
      new Enemy(this.owner.x + 50, this.owner.y, "6");
      new Enemy(this.owner.x - 50, this.owner.y, "6");
    }
    new Enemy(this.x - 100, this.y);
    new Enemy(this.x + 100, this.y);
    const thisArea = areas[this.owner.area];
    removeFromArray(this.owner, thisArea.col);
    removeFromArray(this.owner, thisArea.hit);
    removeFromArray(this.owner, thisArea.hurt);
    if (this.owner.type !== "7"){
      money++;
      enemiesdefeated++;
    }
  }

  hitCallback(col, obst){
    removeFromArray(this.owner, thisArea.col);
  }

  moveAreas(newArea) {
    const thisArea = areas[this.area];

    removeFromArray(this, thisArea.col);
    removeFromArray(this, thisArea.hit);
    removeFromArray(this, thisArea.hurt);

    areas[newArea].col.push(this);
    areas[newArea].hit.push(this);
    areas[newArea].hurt.push(this);

    this.area = newArea;
  }
}

function checkCollision() {
  for (const area in areas) {
    const colArr = areas[area].col.map((x) => x.colbox || x);
    const obstArr = areas[area].obst.map((x) => x.colbox || x);
    const hitArr = areas[area].hit.map((x) => x.hitbox || x);
    const hurtArr = areas[area].hurt.map((x) => x.hurtbox || x);

    if (colArr.length && obstArr.length) {
      colAgainstObst();
    }

    if (hitArr.length && hurtArr.length) {
      hitAgainstHurt();
    }

    function colAgainstObst() {
      for (const col of colArr) {
        for (const obst of obstArr) {
          const colData = checkIfInside(col, obst);
          if (!colData.colliding) continue;
          // if (!inside) continue;
          if (col.callback) {
            col.callback(col, obst);
          } else if (obst.callback) {
            obst.callback(col, obst);
          } else {
            resolveCollision(col, obst, colData);
          }
        }
      }
    }

    function hitAgainstHurt() {
      for (const hit of hitArr) {
        for (const hurt of hurtArr) {
          const colData = checkIfInside(hit, hurt);
          const hitOwner = hit.owner.attacker || hit.owner;
          if (colData.colliding && hitOwner.name != hurt.owner.name) {
            hurt.callback(hit, hurt);
            if (hit.callback) hit.callback(hit, hurt);
            if (hitOwner.type == "7") {
              hurt.callback(hurt, hurt);
              if (hit.callback) hurt.callback(hurt, hurt);
            }
          }
        }
      }
    }
  }
}

function checkIfInside(box1, box2) {
  const pos1 = box1.getPos();
  const pos2 = box2.getPos();
  let colData;

  if (box2.wallSize) {
    const leftWall = checkWall("vertical", pos2.x, pos2.y);
    const rightWall = checkWall("vertical", pos2.x + pos2.w - box2.wallSize, pos2.y);
    const topWall = checkWall("horizontal", pos2.x + box2.wallSize, pos2.y);
    const bottomWall = checkWall("horizontal", pos2.x + box2.wallSize, pos2.y + pos2.h - box2.wallSize);

    colData = { colliding: leftWall || rightWall || topWall || bottomWall, left: leftWall, right: rightWall, top: topWall, bottom: bottomWall };
  } else {
    colData = { colliding: checkWall() };
  }

  function checkWall(orientation, wallX, wallY) {
    const dimensions = getDimensions(orientation, pos2, { x: wallX, y: wallY, size: box2.wallSize });
    const x = dimensions.x;
    const y = dimensions.y;
    const w = dimensions.w;
    const h = dimensions.h;

    const left = pos1.x + pos1.w > x ? true : false;
    const right = pos1.x < x + w ? true : false;
    const top = pos1.y + pos1.h > y ? true : false;
    const bottom = pos1.y < y + h ? true : false;

    ctx.strokeRect(x, y, w, h);

    return left && right && top && bottom;
  }

  return colData;
}

function resolveCollision(box1, box2, colData) {
  const pos1 = box1.getPos();
  const pos2 = box2.getPos();

  const dx = box1.owner.x - pos1.x;
  const dy = box1.owner.y - pos1.y;

  if (box2.wallSize) {
    if (colData.left) {
      goToClosest("vertical", pos2.x, pos2.y);
    }
    if (colData.right) {
      goToClosest("vertical", pos2.x + pos2.w - box2.wallSize, pos2.y);
    }
    if (colData.top) {
      goToClosest("horizontal", pos2.x + box2.wallSize, pos2.y);
    }
    if (colData.bottom) {
      goToClosest("horizontal", pos2.x + box2.wallSize, pos2.y + pos2.h - box2.wallSize);
    }
  } else {
    goToClosest();
  }

  function goToClosest(orientation, wallX, wallY) {
    const dimensions = getDimensions(orientation, pos2, { x: wallX, y: wallY, size: box2.wallSize });
    const x = dimensions.x;
    const y = dimensions.y;
    const w = dimensions.w;
    const h = dimensions.h;

    const side1 = Math.abs(pos1.x + pos1.w - x);
    const side2 = Math.abs(pos1.x - (x + w));
    const side3 = Math.abs(pos1.y + pos1.h - y);
    const side4 = Math.abs(pos1.y - (y + h));

    const closest = Math.min(side1, side2, side3, side4);

    if (side1 == closest) {
      goLeft(x);
    } else if (side2 == closest) {
      goRight(x + w);
    }
    if (side3 == closest) {
      goTop(y);
    } else if (side4 == closest) {
      goBottom(y + h);
    }

    function goLeft(x) {
      box1.owner.x = x - pos1.w + dx;
      box1.owner.vx = 0;
    }

    function goRight(x) {
      box1.owner.x = x + dx;
      box1.owner.vx = 0;
    }

    function goTop(y) {
      box1.owner.y = y - pos1.h + dy;
      box1.owner.vy = 0;
    }

    function goBottom(y) {
      box1.owner.y = y + dy;
      box1.owner.vy = 0;
    }
  }
}

function getDimensions(orientation, pos, wall) {
  if (orientation == "vertical") {
    x = wall.x;
    y = wall.y;
    w = wall.size;
    h = pos.h;
  } else if (orientation == "horizontal") {
    x = wall.x;
    y = wall.y;
    w = pos.w - 2 * wall.size;
    h = wall.size;
  } else {
    x = pos.x;
    y = pos.y;
    w = pos.w;
    h = pos.h;
  }

  return { x: x, y: y, w: w, h: h };
}

function enterHut(col, obst) {
  const trigger = col.owner;

  trigger.moveAreas("hut");

  trigger.speed = trigger.speed * 4;
  trigger.w = trigger.w * 4;
  trigger.h = trigger.h * 4;
  trigger.x = c.width / 2 - trigger.w / 2.5;
  trigger.y = c.height - trigger.h + 15;

  if (trigger.name == "player") {
    background.i = shop;
    sizemultiplier = 2;
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].target = getNewTarget(enemies[i].area);
    }
  } else if (trigger.area == player.area) {
    trigger.target = getNewTarget(trigger.area);
  }
}

function exitHut(col, obst) {
  const trigger = col.owner;

  trigger.moveAreas("start");

  trigger.speed = trigger.speed / 4;
  trigger.w = trigger.w / 4;
  trigger.h = trigger.h / 4;
  trigger.x = hut.x + hut.w / 2 - trigger.w / 2;
  trigger.y = hut.y + hut.h;

  if (trigger.name == "player") {
    background.i = bg;
    sizemultiplier = 2;
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].target = getNewTarget(enemies[i].area);
    }
  } else if (trigger.area == player.area) {
    trigger.target = getNewTarget(trigger.area);
  }
}

function getNewTarget(area) {
  if (area == player.area) {
    return player;
  } else if (area == "hut" && player.area == "start") {
    return { x: c.width / 2, y: c.height + 1 };
  } else if (area == "start" && player.area == "hut") {
    return { x: hut.x + hut.w / 2, y: hut.y + hut.h };
  }
}

function angleTo(start, end) {
  const startC = getCenter(start);

  let dx = end.x - startC.x;
  let dy = end.y - startC.y;

  let length = Math.sqrt(dx ** 2 + dy ** 2);

  dx /= length;
  dy /= length;

  const angle = Math.atan2(dy, dx);

  return { angle: angle, dx: dx, dy: dy };
}

function getCenter(obj) {
  return { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 };
}

function getAnimX(rowNum, frameSpeed, frameSize, delay) {
  const animX = Math.floor(((rowNum / (frameSpeed * rowNum)) * frameCount) % rowNum) * frameSize;

  if (delay) {
    return frameCount % (frameSpeed * rowNum + delay) > frameSpeed * rowNum ? 0 : animX;
  } else return animX;
}

function removeFromArray(element, array) {
  const index = array.indexOf(element);

  if (index != -1) array.splice(array.indexOf(element), 1);
}

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adadaLife() {
  ctx.fillStyle = "ivory";
  ctx.fillRect(c.width / 2 - 500, c.height * 0.015, 1000, 20);
  ctx.fillStyle = "red";
  ctx.fillRect(c.width / 2 - 500, c.height * 0.015, (1000 / enemiesperwave) * enemiesdefeated, 20);
  ctx.fillStyle = "black";
  ctx.strokeRect(c.width / 2 - 500, c.height * 0.015, 1000, 20);

  ctx.fillStyle = "ivory";
  ctx.fillRect(c.width / 1.5 - 175, c.height * 0.035, 500, 20);
  ctx.fillStyle = "mediumspringgreen";
  ctx.fillRect(c.width / 1.5 - 175, c.height * 0.035, (500 / player.turbobar) * player.turbo, 20);
  ctx.fillStyle = "black";
  ctx.strokeRect(c.width / 1.5 - 175, c.height * 0.035, 500, 20);

  const width = ctx.measureText(wave).width;
  ctx.font = "20px serif";
  ctx.fillText(wave, c.width / 2 - width / 2, c.height * 0.0255);
  ctx.font = "48px serif";

  ctx.fillStyle = "white";
  ctx.drawImage(imgcoin, 300, 0, 100, 100);
  if (player.hp >= 3) {
    ctx.drawImage(life, 0, 0, 100, 100);
    ctx.drawImage(life, 100, 0, 100, 100);
    ctx.drawImage(life, 200, 0, 100, 100);
  } else if (player.hp == 2) {
    ctx.drawImage(life, 0, 0, 100, 100);
    ctx.drawImage(life, 100, 0, 100, 100);
    ctx.drawImage(lifeDead, 200, 0, 100, 100);
  } else if (player.hp == 1) {
    ctx.drawImage(life, 0, 0, 100, 100);
    ctx.drawImage(lifeDead, 100, 0, 100, 100);
    ctx.drawImage(lifeDead, 200, 0, 100, 100);
  } else if (player.hp <= 0) {
    ctx.drawImage(lifeDead, 0, 0, 100, 100);
    ctx.drawImage(lifeDead, 100, 0, 100, 100);
    ctx.drawImage(lifeDead, 200, 0, 100, 100);

    const fatality = [hole1, hole2, deadplayer];
    const randomDeath = fatality[getRandInt(0, 2)];

    const w = 260;
    const h = 260;
    let deadPlayer = {
      x: player.x - w / 2,
      y: player.y - h / 2,
      w: w,
      h: h,
      i: randomDeath,
      draw: function () {
        ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
      },
    };

    player.vx = 0;
    player.vy = 0;

    areas[player.area].draw.push(deadPlayer);
    removeFromArray(player, areas[player.area].col);

    player.hp--;
  }
}

function moveWithPlayer(playerArea) {
  let moved = [];

  for (let i = 0; i < playerArea.col.length; i++) {
    const box = playerArea.col[i];
    move(box);
  }

  for (let i = 0; i < playerArea.obst.length; i++) {
    const box = playerArea.obst[i];
    move(box);
  }

  for (let i = 0; i < playerArea.draw.length; i++) {
    const box = playerArea.draw[i];
    move(box);
  }

  function move(box) {
    const boxName = box.owner ? box.owner.name : "none";
    const object = box.owner || box;
    if (boxName != "player" && !moved.includes(object)) {
      object.y -= player.vy / 2;
      moved.push(object);
    }
  }
}

function setup() {
  player.colbox = new Box(player, 0.17, 0.15, 0.6, 0.7);
  player.hurtbox = new Box(player, 0.17, 0.15, 0.6, 0.7, player.hurtCallback);
  cage.colbox = new Box(cage, -1, -1, 3, 3, null, 80);
  hut.colbox = new Box(hut, 0.1, 0.1, 0.8, 0.8);

  startColbox = new Box({ x: 0, y: 0, w: c.width, h: background.h + 870 }, 0, 0, 1, 1, null, 1);
  hutColbox = new Box({ x: 100, y: 100, w: 600, h: 600 }, 0, 0, 1, 1);

  const hutboxPos = hut.colbox.getPos();
  hutEntry = new Box({ x: hutboxPos.x + 50, y: hutboxPos.y + hutboxPos.h, w: hutboxPos.w - 100, h: 1 }, 0, 0, 1, 1, enterHut);
  hutExit = new Box({ x: 570, y: c.height - 25, w: 200, h: 1 }, 0, 0, 1, 1, exitHut);

  areas = {
    start: { draw: [], col: [player, ...enemies], obst: [hut, cage, startColbox, hutEntry], hit: [], hurt: [player] },
    hut: { draw: [], col: [], obst: [hutExit, hutColbox], hit: [], hurt: [] },
  };

  // new Enemy(210, 500);
  // new Enemy(cage.x + cage.w / 2, cage.y + 400);

  startAnimating();
}

function startAnimating() {
  animLoop.maxFpsInterval = 1000 / animLoop.maxFps;
  animLoop.then = window.performance.now();
  animLoop.startTime = animLoop.then;

  loop();
}

function skipFrame() {
  animLoop.now = window.performance.now();
  animLoop.elapsed = animLoop.now - animLoop.then;

  if (animLoop.elapsed > animLoop.maxFpsInterval) {
    frameRate = Math.round(1000 / animLoop.elapsed);
    animLoop.then = animLoop.now - (animLoop.elapsed % animLoop.maxFpsInterval);
    return false;
  } else return true;
}

function loop() {

  // c.width = window.innerWidth - 4;
  // c.height = window.innerHeight - 4;
  requestAnimationFrame(loop);
  // music.play();
  if (skipFrame()) return;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, c.width, c.height);
  background.draw();
  for (const area in areas) {
    for (const col of areas[area].col) {
      col.move();
    }
  }
  enemywave();
  const playerArea = areas[player.area];

  checkCollision();
  moveWithPlayer(playerArea);

  for (let i = 0; i < playerArea.col.length; i++) {
    const box = playerArea.col[i];
    if (!box.owner) box.draw();
  }

  for (let i = 0; i < playerArea.obst.length; i++) {
    const box = playerArea.obst[i];
    if (!box.owner) box.draw();
  }

  for (let i = 0; i < playerArea.draw.length; i++) {
    const box = playerArea.draw[i];
    box.draw();
  }

  for (let i = 0; i < countdown.length; i++) {
    countdown[i].owner.countdown();
  }

  // for (const area in areas) {
  // const thisArea = areas[area];
  const thisArea = playerArea;

  for (let i = 0; i < thisArea.col.length; i++) {
    const colbox = thisArea.col[i].colbox || thisArea.col[i];

    ctx.strokeStyle = "yellow";
    colbox.draw();
  }

  for (let i = 0; i < thisArea.obst.length; i++) {
    const colbox = thisArea.obst[i].colbox || thisArea.obst[i];

    ctx.strokeStyle = "blue";
    colbox.draw();
  }

  for (let i = 0; i < thisArea.hit.length; i++) {
    const hitbox = thisArea.hit[i].hitbox || thisArea.hit[i];

    ctx.strokeStyle = "red";
    hitbox.draw();
  }

  for (let i = 0; i < thisArea.hurt.length; i++) {
    const hurtbox = thisArea.hurt[i].hurtbox || thisArea.hurt[i];

    ctx.strokeStyle = "green";
    hurtbox.draw();
  }
  // }

  ctx.strokeStyle = "black";

  ctx.font = "48px serif";
  ctx.fillStyle = "white";
  adadaLife();
  ctx.fillText(money, 300, 100);
  ctx.drawImage(imgwall, 0, hut.y + c.height * 1.5, c.width, 200);
  frameCount++;
}

setup();
mouse.y = 900;
mouse.x = c.width / 2 - 45;

// setInterval(spawn, 2000);
function spawn() {
  // new Enemy(c.width / 2 - 40, hut.y + c.height * 1.5, Math.ceil(Math.random() * 5));
}

// function enemywave() {
//   if (frameCount % 200 == 0) {
//     for (let n = 0; n < 3; n++) {
//       new Enemy(c.width / 2 - 40, hut.y + c.height * 1.5, Math.ceil(Math.random() * 5));
//       console.log("new enemy");
//     }
//   }
// }
let enemiesspawned = 0;
function enemywave() {
  if (frameCount % spawnfrequency == 0 && enemiesspawned < enemiesperwave) {
    // new Enemy((c.width / 1.1 - 40) * Math.random(), hut.y + c.height * 1.5 - Math.random() * 200, Math.ceil(Math.random() * enemydifficulty));
    console.log("new enemy");
    enemiesspawned++;
  }
  if (enemiesdefeated == enemiesperwave) {
    wave++;
    enemiesperwave++;
    enemiesdefeated = 0;
    enemydifficulty += 0.5;
    spawnfrequency = spawnfrequency * 0.7;
    enemiesspawned = 0;
    spawnfrequency = Math.round(spawnfrequency);
    console.log(spawnfrequency);
  }
  if (enemydifficulty > 7) {
    enemydifficulty = 7;
  }
}
//enemiesperwave

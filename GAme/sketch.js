var background1; // 背景
let car,enemy1,enemy2; // 小车
let obstacles = []; // 障碍物数组
var woodTexture;
var borderThickness = 10
var semiCircleX,semiCircleY,semiCircleDiameter;
var Semiedgethickness = 26
let bullets = []; // 子弹数组
let hitTimer = -1; // 被击中的计时器
var bomb;//爆炸图
var newHeight = 60, newWidth = 90
let enemies = []; // 存储敌人小车的数组
let lastBulletTime1 = 0;
let lastBulletTime2 = 0;
var bulletInterval = 1100; // 子弹发射间隔1.1秒，以毫秒为单位
var CD_t = Math.floor(Math.random()*9000+17000)//设定生成汽车间隔
var current_time;
var number3 = true;
var time_last_car = 0
var to = true;
var score = 0;
var die = false;
var sec = true;
var IUI;
let elapsedTime;
let nextRefreshTime = 0;
let countdownStart = 0;
let countdown = 3;
let countdownActive = false;
var least = 0;
var gameStarted = false;
var mainback;
let startButton;
var huge, boom, shootS, lose, B1, B2;
var PT;
var XXX;

const spawnPoints = {
  1: [{ x: 540, y: 90 }, { x: 60, y: 600 }], // 1号车的两个位置
  2: [{ x: 40, y: 90 }, { x: 700, y: 640 }],  // 2号车的两个位置
  3: [{ x: 140, y: 360 }, { x: 560, y: 300 }] // 3号车的两个位置
};

function preload() {
  background1 = loadImage("Grass.jpg"); // 
  woodTexture = loadImage("wood.jpg")
  bomb = loadImage("bomb.jpeg")
  mainback = loadImage("Tank.jpeg")
  lose = loadSound("lose.mp3")
  huge = loadSound("huge.mp3")
  boom = loadSound("boom.mp3")
  shootS = loadSound("shoot.mp3")
  B1 = document.getElementById("myaudio")
  B2 = document.getElementById("myaudio2")
  
  document.getElementById('start-button').addEventListener('click', startGame);
  
}

function setup() {
  
  B1.play();
   // 设置音量（0.0 到 1.0 之间）
  // 创建画布
  let canvas = createCanvas(800, 700);
  canvas.parent('canvas-container');
  // 创建开始游戏按钮
  
  startButton = createButton('Start');
  //startButton.position(900,600)
  startButton.mousePressed(startGame);
  
  // 设置按钮样式
  startButton.style('background-color', '#0000FF'); // 蓝色背景
  startButton.style('border', 'none'); // 无边框
  startButton.style('color', 'white'); // 白色文字
  startButton.style('font-family', 'cursive'); // 手写体
  startButton.style('padding', '10px 20px'); // 内边距
  startButton.hide(); // 隐藏开始游戏按钮
  frameRate(60);
  // 创建小车对象，初始位置为画布中心
  car = new Car(width / 2, height / 2);
  enemies.push(new Enemycar(540, 90, 1));
  //enemies.push(new Enemycar(400, 340, 3));
  //enemies.push(new Enemycar(40, 90, 2));
  //enemies.push(new Enemycar(360, 340, 3));
  //enemies.push(new Turret(600, 280,4))
  textSize(20)
  textAlign(CENTER, CENTER); // 设置文本对齐方式
  resetRefreshTimer(); // 初始化刷新计时器
  
}
function centerButton() {
    startButton.position((windowWidth - startButton.width) / 2, (windowHeight - height) / 2 + 300);
}
function startGame() {
  gameStarted = true; // 改变游戏状态
  startButton.hide(); // 隐藏开始游戏按钮
  // 隐藏按钮
  document.getElementById('start-button').style.display = 'none';
  B1.pause();
  B2.play();
}
// 重置刷新计时器
function resetRefreshTimer() {
  let currentTime = millis();
  let refreshInterval = random(50000, 60000); // 50到60秒之间随机
  nextRefreshTime = currentTime + refreshInterval;
  countdownStart = nextRefreshTime - 3000; // 在刷新前3秒开始倒计时
}
function draw() {
  
  if(gameStarted){
  //获取时间
  current_time = millis() - PT;
  elapsedTime = Math.floor((current_time) / 1000); // 计算经过的时间（秒）
  // 重新绘制背景以清除之前的图形
  background(background1);
  spawnEnemy(); // 调用生成敌人的函数
  drawObstacles()
  obstacles = [
    { x: 100, y: 175, width: 50, height: 30 }, // 障碍物 1
    { x: 150, y: 130, width: 30, height: 75 }, // 障碍物 2
    { x: 100, y: 300, width: 200, height: 30 }, // 障碍物 3
    { x: 100, y: 460, width: 30, height: 90 },  // 障碍物 4
    { x: 675, y: 150, width: 30, height: 400 }, // 障碍物 5
    { x: 500, y: 150, width: 200, height: 35 }, // 障碍物 6
    { x: 480, y: 280, width: 30, height: 147 },  // 障碍物 7
    { x: 0, y: 0, width: width, height: borderThickness+35 }, // 顶部边框
    { x: 0, y: height - borderThickness, width: width, height: borderThickness }, // 底部边框
    { x: 0, y: 0, width: borderThickness, height: height }, // 左侧边框
    { x: width - borderThickness, y: 0, width: borderThickness, height: height }  // 右侧边框
  ];
  // 更新和显示玩家小车
  if (hitTimer < 0) {
    car.update();
    car.display();
  } else if (millis() - hitTimer > 500) {
    // 0.5秒后移除车辆
    car = null;
    fill(0,255,0)
    textSize(30)
    text("Game Over! " +" Final Score is " + score, width / 2, height / 2); // 在画布中心绘制文本
    lose.play();
  } else {
    // 车辆被击中，显示爆炸效果
    image(bomb, car.x - newWidth / 2, car.y - newHeight / 2, newWidth, newHeight);
  }
  least = Math.floor(current_time/60000)
  // 更新和绘制子弹
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();

    // 检查子弹是否击中玩家小车
    if (car && car.isHitByBullet(bullets[i])) {
      bullets.splice(i, 1); // 移除击中的子弹
      hitTimer = millis(); // 开始计时
      boom.play();
      B2.pause();
    } else if (!bullets[i].active) {
      bullets.splice(i, 1); // 移除不活跃的子弹
    }
  }
  if(sec && current_time >= 10000){
    enemies.push(new Enemycar(40, 90, 2));
    sec = false;
  }
  

  if (!countdownActive && current_time >= countdownStart) {
    countdownActive = true;
  }

  // 如果倒计时激活，显示倒计时
  if (countdownActive) {
    let remainingTime = countdown - Math.floor((current_time - countdownStart) / 1000);
    fill(255,0,0)
    text( remainingTime, 390, 585);

    // 如果倒计时结束，刷新炮台并重置计时器
    if (current_time >= nextRefreshTime) {
      enemies.push(new Turret(390, 595, 4));
      resetRefreshTimer();
      countdownActive = false;
    }
  }




  if((current_time-time_last_car >= CD_t) || enemies.length - least === 0){
    let numbb = Math.floor(1+Math.random()*3)
    let enemyX, enemyY;
    switch (numbb) {
      case 1:
        enemyX = 540; enemyY = 90; // 1号车的位置
        break;
      case 2:
        enemyX = 40; enemyY = 90; // 2号车的位置
        break;
      case 3:
        enemyX = 140; enemyY = 360; // 3号车的位置
        break;
    }
    enemies.push(new Enemycar(enemyX,enemyY,numbb))
    time_last_car = current_time;
  }
  // 更新和显示敌人小车
for (let i = enemies.length - 1; i >= 0; i--) {
  let enemy = enemies[i];

  // 检查每个子弹是否击中了敌人
  for (let j = bullets.length - 1; j >= 0; j--) {
    if (enemy && enemy.isHitByBullet(bullets[j])) {
      bullets.splice(j, 1); // 移除击中的子弹
      enemy.hitTime = millis(); // 记录被击中的时间
      if(enemy.count){score += 1; enemy.count = false}
      boom.play();
      break; // 一旦敌人被击中，就跳出循环
      
    }
  }

  if (enemy.hitTime) {
    // 如果敌人被击中
    if (millis() - enemy.hitTime > 500) {
      // 如果超过0.5秒，移除敌人
      enemies.splice(i, 1);
    } else {
      // 显示爆炸效果
      image(bomb, enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
    }
  } else {
    // 如果敌人没有被击中，正常更新和显示
    enemy.update(car.x, car.y, enemies);
    enemy.display(car.x,car.y);
    enemy.fireBulletIfPlayerDetected(car.x,car.y);
  }
}
fill(255,0,0)
  noStroke()
  text( "Your current score: "+ score +"         " + "Time : " + elapsedTime , width/2,27)
  if(die && hitTimer >= 500){
    
    fill(0,255,0)
    text("Game Over!" + "<br>"+"Final Score is" + score, width / 2, height / 2); // 在画布中心绘制文本
  }

  CD_t = Math.floor(Math.random()*6500+13000);
  IUI = Math.floor(current_time / 60000)
  CD_t = CD_t * 0.96**IUI


  }else {
    // 显示欢迎界面
    startButton.position(width/2, 300);
    startButton.mousePressed(startGame);
    background(mainback); // 浅灰色背景
    textSize(82);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(205,255,250)
    textAlign(CENTER, CENTER);
    text('Welcome', width / 2+width/25, height / 2 - 150);
    PT = millis();
    textSize(32);
  }
}
function spawnEnemy() {
  let current_time = millis() - PT;
  if ((current_time - time_last_car >= CD_t) || enemies.length === 0) {
    let numbb = Math.floor(1 + Math.random() * 3);
    let spawnPoint = random(spawnPoints[numbb]); // 随机选择刷新点

    enemies.push(new Enemycar(spawnPoint.x, spawnPoint.y, numbb));
    time_last_car = current_time;
  }
}
function mousePressed() {
  let currentTime = millis() - PT;

  // 检查第一个子弹是否冷却完毕
  if (currentTime - lastBulletTime1 > 1100) {
    fireBullet();
    lastBulletTime1 = currentTime; // 更新第一个子弹的发射时间
    shootS.play();
  } 
  // 如果第一个子弹还在冷却，检查第二个子弹
  else if (currentTime - lastBulletTime2 > 1100) {
    fireBullet();
    lastBulletTime2 = currentTime; // 更新第二个子弹的发射时间
    shootS.play();
  }
  
}
function fireBullet() {
  let bulletAngle = atan2(mouseY - car.y, mouseX - car.x);
  let newBullet = new Bullet1(car.x, car.y, bulletAngle, 2);
  bullets.push(newBullet);
}
function drawObstacles() {

 // 定义矩形障碍物的线条厚度
 let rectThickness = 2;
 strokeWeight(rectThickness);
 fill(0); // 设置填充色为黑色
 rectMode(CORNER); // 确保再次设置为从角落开始绘制
 for (let obs of obstacles) {
  rect(obs.x, obs.y, obs.width, obs.height);
}

 // 定义半圆形障碍物的参数
 semiCircleX = width / 2 -15;      // 画布中心的 x 坐标
 semiCircleY = height - 110;    // 画布底部的 y 坐标，略微向上移
 semiCircleDiameter = 450 / 3;  // 半圆的直径
 noFill();                         // 半圆形不填充
 stroke(0);                        // 黑色边框
 strokeWeight(Semiedgethickness);                 // 边框线条厚度
 arc(semiCircleX, semiCircleY, semiCircleDiameter, semiCircleDiameter, PI, TWO_PI);
}
class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1.6; // 小车的速度
    this.width = 50; // 小车的宽度
    this.height = 30; // 小车的高度
    this.direction = 0; // 小车的方向，以弧度表示
    this.bullets = []; // 存储子弹的数组
  }
  update() {
  let newX = this.x;
  let newY = this.y;
  let newDirection = this.direction;
  let moved = false;

  // 检测方向键
  if (keyIsDown(65)) { // A 键
    newDirection -= 0.08; // 假设每次转向改变 0.1 弧度
    moved = true;
  }
  if (keyIsDown(68)) { // D 键
    newDirection += 0.08;
    moved = true;
  }

  // 在实际转向前检查是否会卡在墙里
  let futureCorners = this.calculateFutureRotatedCorners(this.x, this.y, newDirection);
  if (!this.collidesWithObstacle(this.x, this.y, futureCorners)) {
    // 如果不会卡住，则更新方向
    if (moved) {
      this.direction = newDirection;
    }
  }

  // 检测移动键
  if (keyIsDown(87)) { // W 键
    newX += this.speed * cos(this.direction);
    newY += this.speed * sin(this.direction);
    moved = true;
  }
  if (keyIsDown(83)) { // S 键
    newX -= this.speed * cos(this.direction);
    newY -= this.speed * sin(this.direction);
    moved = true;
  }

  // 在移动之前检查碰撞
  if (!this.collidesWithObstacle(newX, newY) && !this.collidesWithSemiCircle(newX, newY)) {
    this.x = newX;
    this.y = newY;
  }
}

  collidesWithObstacle(newX, newY, corners = null) {
    if (!corners) {
      corners = this.calculateRotatedCorners(newX, newY);
    }
  
    for (let obs of obstacles) {
      for (let corner of corners) {
        if (corner.x > obs.x && corner.x < obs.x + obs.width &&
            corner.y > obs.y && corner.y < obs.y + obs.height) {
          return true; // 发生碰撞
        }
      }
    }
    return false; // 无碰撞
  }
  calculateRotatedCorners(x, y) {
    let corners = [];
    let dx = this.width / 2;
    let dy = this.height / 2;

    // 四个角的相对位置
    let offsets = [
      { x: -dx, y: -dy },
      { x: dx, y: -dy },
      { x: -dx, y: dy },
      { x: dx, y: dy }
    ];

    for (let offset of offsets) {
      // 计算旋转后的角位置
      let rotatedX = x + offset.x * cos(this.direction) - offset.y * sin(this.direction);
      let rotatedY = y + offset.x * sin(this.direction) + offset.y * cos(this.direction);
      corners.push({ x: rotatedX, y: rotatedY });
    }

    return corners;
  }
  collidesWithSemiCircle(newX, newY) {
    // 圆弧中心的坐标
    let arcCenterX = semiCircleX;
    let arcCenterY = semiCircleY;
    // 圆弧的半径
    let arcRadius = semiCircleDiameter / 2; // 直径除以2得到半径
    // 圆弧的起始和终止角度
    let arcStart = PI;
    let arcEnd = TWO_PI;
    Semiedgethickness = 30;
    // 获取小车的四个角点
    let corners = this.calculateRotatedCorners(newX, newY);

    // 检查每个角点是否在半圆弧内
    for (let corner of corners) {
        // 计算角点到圆弧中心的距离
        let distToArcCenter = dist(corner.x, corner.y, arcCenterX, arcCenterY);

        // 检查角点是否在半圆弧的内沿和外沿之间
        if (distToArcCenter >= arcRadius - Semiedgethickness/2 && distToArcCenter <= arcRadius + Semiedgethickness/2) {
            // 计算角点相对于圆弧中心的角度
            let angleToArcCenter = atan2(corner.y - arcCenterY, corner.x - arcCenterX);

            // 由于 atan2 返回的角度范围是 -PI 到 PI，我们需要调整角度范围以匹配半圆弧的范围
            if (angleToArcCenter < 0) {
                angleToArcCenter += TWO_PI;
            }

            // 检查角度是否在半圆弧的范围内
            if (angleToArcCenter >= arcStart && angleToArcCenter <= arcEnd) {
                return true; // 如果任何一个角点在半圆弧内，返回 true 表示发生碰撞
            }
        }
    }

    return false; // 如果没有角点在半圆弧内，返回 false 表示没有碰撞
}
calculateFutureRotatedCorners(x, y, futureDirection) {
  let corners = [];
  let dx = this.width / 2;
  let dy = this.height / 2;

  let offsets = [
    { x: -dx, y: -dy },
    { x: dx, y: -dy },
    { x: -dx, y: dy },
    { x: dx, y: dy }
  ];

  for (let offset of offsets) {
    let rotatedX = x + offset.x * cos(futureDirection) - offset.y * sin(futureDirection);
    let rotatedY = y + offset.x * sin(futureDirection) + offset.y * cos(futureDirection);
    corners.push({ x: rotatedX, y: rotatedY });
  }

  return corners;
}
  display() {
    push(); // 保存当前绘图设置
    translate(this.x, this.y); // 将原点移动到小车位置
    rotate(this.direction); // 根据移动方向旋转

    // 绘制小车本体
    fill(255, 0, 0); // 红色
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.width, this.height); // 绘制小车的主体

    // 计算炮台朝向
    let angle = atan2(mouseY - this.y, mouseX - this.x) - this.direction;

    // 炮台的参数
    let turretLength = 20;
    let turretWidth = 20;

    // 绘制炮台
    push(); // 再次保存绘图设置
    rotate(angle); // 旋转到炮台应该指向的方向

    fill(0, 0, 255); // 蓝色
    // 三角形的顶点现在被调整，使得一个顶点直接指向鼠标
    triangle(turretLength, 0, -turretWidth / 2, -turretWidth / 2, -turretWidth / 2, turretWidth / 2);
    pop(); // 恢复炮台的绘图设置
    pop(); // 恢复小车的绘图设置
  }
  isHitByBullet(bullet) {
    let carWidth = 50; // 假设车辆的宽度
    let carHeight = 30; // 假设车辆的高度
    return bullet.x > this.x - carWidth / 2 &&
           bullet.x < this.x + carWidth / 2 &&
           bullet.y > this.y - carHeight / 2 &&
           bullet.y < this.y + carHeight / 2;
  }
}
class Bullet1 {
  constructor(x, y, angle, maxCollisions) {
    // 根据角度和一定的偏移量设置子弹的初始位置
    let offset = 30; // 可以根据需要调整这个偏移量
    this.x = x + offset * cos(angle);
    this.y = y + offset * sin(angle);
    this.angle = angle;
    this.maxCollisions = maxCollisions
    
    if (this.maxCollisions === 4) { // 炮塔子弹
      this.speed = 4.7; // 更快的速度
      this.canPenetrateWalls = true;
    } else {
      this.speed = 2.8; // 普通子弹速度
      this.canPenetrateWalls = false;
    }

    this.active = true; // 子弹是否活跃（未碰撞）
    this.collisions = 0; // 当前碰撞次数
    this.maxCollisions = maxCollisions; // 最大碰撞次数
    
  }

  update() {
    // 更新子弹位置
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);

    // 检查子弹是否碰到边界或障碍物
    if (this.collides()) {
      this.collisions++; // 增加碰撞次数
      if (this.collisions >= this.maxCollisions) {
        this.active = false; // 达到最大碰撞次数后子弹变为非活跃状态
      }
    }
    // Check for collisions with other bullets
  for (let otherBullet of bullets) {
    if (otherBullet !== this && otherBullet.active) {
      let d = dist(this.x, this.y, otherBullet.x, otherBullet.y);
      if (d < 10) { // Assuming each bullet has a radius of 5
        this.active = false;
        otherBullet.active = false;
        break; // Exit the loop as the current bullet is no longer active
      }
    }
  }
  }

  display() {
    push();
    // 根据最大碰撞次数设置子弹颜色
    if (this.maxCollisions === 1) {
      fill(255); // 白色，一次消失
    } else if (this.maxCollisions === 2) {
      fill(255, 255, 0); // 黄色，两次消失
    } else if (this.maxCollisions === 3) {
      fill(255,0,255); // 黑色，三次消失
    } else if (this.maxCollisions == 4){
      fill(200,100,22)
    }
    noStroke();
    ellipse(this.x, this.y, 10, 10); // 绘制子弹
    pop();
  }

  collides() {
    // 如果子弹类型允许穿墙（maxCollisions == 4），则不检测碰撞
    if (this.maxCollisions == 4) {
      return false;
    }
  
    let bulletRadius = 5; // 子弹半径为5
  
    // 遍历所有直角障碍物
    for (let obstacle of obstacles) {
      // 检查子弹是否与障碍物发生碰撞
      if (this.x - bulletRadius < obstacle.x + obstacle.width &&
          this.x + bulletRadius > obstacle.x &&
          this.y - bulletRadius < obstacle.y + obstacle.height &&
          this.y + bulletRadius > obstacle.y) {
        // 确定碰撞类型（水平或垂直）
        if (this.x < obstacle.x || this.x > obstacle.x + obstacle.width) {
          // 水平碰撞，反转水平方向速度
          this.angle = PI - this.angle;
        } else {
          // 垂直碰撞，反转垂直方向速度
          this.angle = -this.angle;
        }
        return true; // 碰撞发生
      }
    }
  
    // 检查子弹是否碰到边框
    if (this.x - bulletRadius < borderThickness || 
        this.x + bulletRadius > width - borderThickness) {
      // 水平边框碰撞
      this.angle = PI - this.angle;
      return true;
    }
    if (this.y - bulletRadius < borderThickness || 
        this.y + bulletRadius > height - borderThickness) {
      // 垂直边框碰撞
      this.angle = -this.angle;
      return true;
    }
  
    // 检查子弹是否与半圆边缘发生碰撞
    let distToArcCenter = dist(this.x, this.y, semiCircleX, semiCircleY);
    let semiEdgeThickness = 30; // 半圆边缘的厚度
    let arcRadius = semiCircleDiameter / 2; // 半圆的半径
  
    if (distToArcCenter >= arcRadius - semiEdgeThickness / 2 && 
        distToArcCenter <= arcRadius + semiEdgeThickness / 2) {
      let angleToArcCenter = atan2(this.y - semiCircleY, this.x - semiCircleX);
      if (angleToArcCenter < 0) {
        angleToArcCenter += TWO_PI;
      }
      if (angleToArcCenter >= PI && angleToArcCenter <= TWO_PI) {
        // 碰撞发生，计算反射角度
        let normalAngle = angleToArcCenter + PI / 2; // 半圆边缘的法线角度
        this.angle = 2 * normalAngle - this.angle;
        return true;
      }
    }
  
    return false; // 未发生碰撞
  }
  
}
class Enemycar {
  constructor(x, y,num,count) {
    this.x = x;
    this.y = y;
    this.count = true;
    this.speed = 1.6; // 敌人小车的速度
    this.width = 50; // 敌人小车的宽度
    this.height = 30; // 敌人小车的高度
    this.direction = random(TWO_PI); // 随机初始方向
    this.num = num//敌人子弹等级
    // 随机行为的控制变量
    this.nextMoveTime = 1;
    this.nextTurnTime = 1;
    this.moving = false;
    this.turning = false;
    this.hitTime = null; // 被击中的时间，-1 表示未被击中
    this.turnDirection = 0; // 1 表示向右转，-1 表示向左转
    this.turretDirection = 0; // 炮台的初始朝向
    this.turretTurnSpeed = 0.05; // 炮台的转头速度上限，每次更新的最大角度变化
    this.bulletCooldown = 0.07; // 子弹发射间隔，单位秒
    this.lastBulletTime = 0; // 上次发射子弹的时间
    this.lastShootTime = 0; // 上次射击时间
    this.firstDetectedTime = null;
  }
  fireBulletIfPlayerDetected(playerX, playerY) {
    let currentTime = millis();
    
    if (this.canSeePlayer(playerX, playerY, obstacles)) {
      // 如果是首次检测到玩家
      if (this.firstDetectedTime === null) {
        this.firstDetectedTime = currentTime; // 记录首次检测到玩家的时间
      } else if (currentTime - this.firstDetectedTime > 800) {
        // 超过一秒后开始射击
        if (currentTime - this.lastShootTime > 1300) {
          // 发射子弹
          let bulletAngle = atan2(playerY - this.y, playerX - this.x);
          let newBullet = new Bullet1(this.x, this.y, bulletAngle, this.num);
          shootS.play();
          bullets.push(newBullet);
          this.lastShootTime = currentTime; // 更新上次射击时间
        }
      }
    } else {
      // 如果不能看到玩家，重置首次检测时间
      this.firstDetectedTime = null;
    }
  }
  
  FBullet() {
    // 计算子弹的初始位置和方向
    let bulletX = this.x + cos(this.turretDirection) * 20; // 假设炮管长度为20
    let bulletY = this.y + sin(this.turretDirection) * 20;
    let bulletDirection = this.turretDirection;

    // 创建子弹对象并添加到游戏中
    let bullet = new Bullet1(bulletX, bulletY, bulletDirection);
    // 假设有一个数组来存储游戏中的所有子弹
    bullets.push(bullet);
}
  // 计算边界框
  getBoundingBox() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
  checkCollisionWithOtherCars(enemies) {
    let myBox = this.getBoundingBox();
    for (let other of enemies) {
      if (other !== this) {
        let otherBox = other.getBoundingBox();
        if (myBox.x < otherBox.x + otherBox.width &&
            myBox.x + myBox.width > otherBox.x &&
            myBox.y < otherBox.y + otherBox.height &&
            myBox.y + myBox.height > otherBox.y) {
          // 发生碰撞
          return true;
        }
      }
    }
    return false;
  }
  update(carX, carY, enemies) {
  let currentTime = millis(); // 获取当前时间
  let newX = this.x;
  let newY = this.y;
  let newDirection = this.direction;
  let moved = false;

  // 每3秒随机决定转向逻辑
  if (currentTime > this.nextTurnTime) {
    this.nextTurnTime = currentTime + 3000; // 下一次决定转向的时间
    let turnOptions = [-1, 0, 1]; // -1: 左转, 0: 不转, 1: 右转
    this.turnDirection = random(turnOptions); // 随机选择转向
    this.turning = this.turnDirection !== 0; // 如果选择了转向
  }

  if (this.turning) {
    newDirection += this.turnDirection * 0.02; // 根据选择的方向转向
    moved = true;
  }

  // 移动逻辑
  if (currentTime > this.nextMoveTime) {
    this.moving = true;
    newX += this.speed * cos(newDirection);
    newY += this.speed * sin(newDirection);
    moved = true;
  }

  // 碰撞检测
  let futureCorners = this.calculateFutureRotatedCorners(newX, newY, newDirection);
  if (this.collidesWithObstacle(newX, newY, futureCorners) || this.collidesWithSemiCircle(newX, newY, futureCorners) ) {
    // 如果碰到障碍物，倒车
    this.nextMoveTime = currentTime + random(0, 40); // 设置下一次移动的时间
    this.speed = -this.speed; // 改变速度方向以倒车
  } else {
    // 如果没有碰撞，更新位置和方向
    if (moved) {
      this.x = newX;
      this.y = newY;
      this.direction = newDirection;
    }
  }
  //if (this.canSeePlayer(playerX, playerY, obstacles) && currentTime - this.lastBulletTime > this.bulletCooldown) {
//    this.FBullet();
   // this.lastBulletTime = currentTime;
//}
}
  collidesWithObstacle(newX, newY, corners = null) {
    if (!corners) {
      corners = this.calculateRotatedCorners(newX, newY);
    }
  
    for (let obs of obstacles) {
      for (let corner of corners) {
        if (corner.x > obs.x && corner.x < obs.x + obs.width &&
            corner.y > obs.y && corner.y < obs.y + obs.height) {
          return true; // 发生碰撞
        }
      }
    }
    return false; // 无碰撞
  }
  calculateRotatedCorners(x, y) {
    let corners = [];
    let dx = this.width / 2;
    let dy = this.height / 2;

    // 四个角的相对位置
    let offsets = [
      { x: -dx, y: -dy },
      { x: dx, y: -dy },
      { x: -dx, y: dy },
      { x: dx, y: dy }
    ];

    for (let offset of offsets) {
      // 计算旋转后的角位置
      let rotatedX = x + offset.x * cos(this.direction) - offset.y * sin(this.direction);
      let rotatedY = y + offset.x * sin(this.direction) + offset.y * cos(this.direction);
      corners.push({ x: rotatedX, y: rotatedY });
    }

    return corners;
  }
  collidesWithSemiCircle(newX, newY) {
    // 圆弧中心的坐标
    let arcCenterX = semiCircleX;
    let arcCenterY = semiCircleY;
    // 圆弧的半径
    let arcRadius = semiCircleDiameter / 2; // 直径除以2得到半径
    // 圆弧的起始和终止角度
    let arcStart = PI;
    let arcEnd = TWO_PI;
    Semiedgethickness = 30;
    // 获取小车的四个角点
    let corners = this.calculateRotatedCorners(newX, newY);

    // 检查每个角点是否在半圆弧内
    for (let corner of corners) {
        // 计算角点到圆弧中心的距离
        let distToArcCenter = dist(corner.x, corner.y, arcCenterX, arcCenterY);

        // 检查角点是否在半圆弧的内沿和外沿之间
        if (distToArcCenter >= arcRadius - Semiedgethickness/2 && distToArcCenter <= arcRadius + Semiedgethickness/2) {
            // 计算角点相对于圆弧中心的角度
            let angleToArcCenter = atan2(corner.y - arcCenterY, corner.x - arcCenterX);

            // 由于 atan2 返回的角度范围是 -PI 到 PI，我们需要调整角度范围以匹配半圆弧的范围
            if (angleToArcCenter < 0) {
                angleToArcCenter += TWO_PI;
            }

            // 检查角度是否在半圆弧的范围内
            if (angleToArcCenter >= arcStart && angleToArcCenter <= arcEnd) {
                return true; // 如果任何一个角点在半圆弧内，返回 true 表示发生碰撞
            }
        }
    }

    return false; // 如果没有角点在半圆弧内，返回 false 表示没有碰撞
}
calculateFutureRotatedCorners(x, y, futureDirection) {
  let corners = [];
  let dx = this.width / 2;
  let dy = this.height / 2;

  let offsets = [
    { x: -dx, y: -dy },
    { x: dx, y: -dy },
    { x: -dx, y: dy },
    { x: dx, y: dy }
  ];

  for (let offset of offsets) {
    let rotatedX = x + offset.x * cos(futureDirection) - offset.y * sin(futureDirection);
    let rotatedY = y + offset.x * sin(futureDirection) + offset.y * cos(futureDirection);
    corners.push({ x: rotatedX, y: rotatedY });
  }

  return corners;
}
  display(playerX,playerY) {
    push(); // 保存当前绘图设置
    translate(this.x, this.y); // 将原点移动到小车位置
    rotate(this.direction); // 根据移动方向旋转

    // 绘制小车本体
    fill((this.num-1)*35*(this.num-2),(this.num-3)*134*(this.num-2),(this.num-3)*15*(this.num-1)); 
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.width, this.height); // 绘制小车的主体

    // 判断是否能看到玩家小车
    let canSee = this.canSeePlayer(playerX, playerY, obstacles);
    let desiredTurretAngle;
    if (canSee) {
      // 如果能看到玩家，炮台朝向玩家小车
      desiredTurretAngle = atan2(playerY - this.y, playerX - this.x) - this.direction;
    } else {
      // 如果看不到玩家，保持当前方向或采取其他默认方向
      desiredTurretAngle = 0; // 或者任何你想要的默认方向
    }

    // 炮台的参数
    let turretLength = 20;
    let turretWidth = 20;

    // 调整炮台朝向
    let angleDifference = desiredTurretAngle - this.turretDirection;
    // 确保角度差在 -PI 到 PI 之间
    if (angleDifference > PI) angleDifference -= TWO_PI;
    if (angleDifference < -PI) angleDifference += TWO_PI;

    // 根据转头速度上限调整炮台朝向
    if (abs(angleDifference) > this.turretTurnSpeed) {
        this.turretDirection += this.turretTurnSpeed * Math.sign(angleDifference);
    } else {
        this.turretDirection = desiredTurretAngle;
    }

    // 绘制炮台
    push(); // 再次保存绘图设置
    rotate(this.turretDirection); // 旋转到炮台应该指向的方向

    fill(60*(this.num+2), 250*(this.num-2), 56*(this.num-1)); // 
    // 三角形的顶点现在被调整，使得一个顶点直接指向鼠标
    triangle(turretLength, 0, -turretWidth / 2, -turretWidth / 2, -turretWidth / 2, turretWidth / 2);
    pop(); // 恢复炮台的绘图设置
    pop(); // 恢复小车的绘图设置
  }
  isHitByBullet(bullet) {
    let carWidth = 50; // 假设车辆的宽度
    let carHeight = 30; // 假设车辆的高度
    return bullet.x > this.x - carWidth / 2 &&
           bullet.x < this.x + carWidth / 2 &&
           bullet.y > this.y - carHeight / 2 &&
           bullet.y < this.y + carHeight / 2;
  }
  // 检查与玩家小车之间是否有障碍物
  canSeePlayer(playerX, playerY, obstacles) {
    let stepSize = 5; // 检查连线上每个点的步长
    let dx = playerX - this.x;
    let dy = playerY - this.y;
    let distance = dist(this.x, this.y, playerX, playerY);
    let stepCount = distance / stepSize;
  
    // 半圆的中心和半径
    let semiCircleCenterX = semiCircleX;
    let semiCircleCenterY = semiCircleY - semiCircleDiameter / 2;
    let semiCircleRadius = semiCircleDiameter / 2;
  
    // 计算七边形的顶点
    let vertices = [];
    for (let i = 0; i < 7; i++) {
      let angle = PI - (i * PI / 6);
      let x = semiCircleCenterX + semiCircleRadius * cos(angle);
      let y = semiCircleCenterY + semiCircleRadius * sin(angle);
      vertices.push({x, y});
    }
  
    for (let i = 0; i <= stepCount; i++) {
      let checkX = this.x + (dx * i / stepCount);
      let checkY = this.y + (dy * i / stepCount);
  
      // 检查障碍物
      for (let obs of obstacles) {
        if (checkX > obs.x && checkX < obs.x + obs.width &&
            checkY > obs.y && checkY < obs.y + obs.height) {
          return false; // 发现障碍物，返回 false
        }
      }
  
      // 检查是否穿过七边形
      for (let j = 0; j < vertices.length; j++) {
        let nextIndex = (j + 1) % vertices.length;
        if (lineIntersects(checkX, checkY, playerX, playerY, vertices[j].x, vertices[j].y, vertices[nextIndex].x, vertices[nextIndex].y)) {
          return false; // 穿过七边形，返回 false
        }
      }
    }
    return true; // 没有障碍物，返回 true
  }
  
  

  
}
function lineIntersects(x1, y1, x2, y2, x3, y3, x4, y4) {
  // 计算两条线段的方向向量
  let p0_x = x1;
  let p0_y = y1;
  let p1_x = x2;
  let p1_y = y2;
  let p2_x = x3;
  let p2_y = y3;
  let p3_x = x4;
  let p3_y = y4;

  let s1_x = p1_x - p0_x;
  let s1_y = p1_y - p0_y;
  let s2_x = p3_x - p2_x;
  let s2_y = p3_y - p2_y;

  let s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
  let t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

  // 如果s和t都在0到1之间，则线段相交
  return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}
class Turret {
  constructor(x, y,num) {
    this.x = x;
    this.y = y;
    
    this.speed = 0; // 敌人小车的速度
    this.width = 50; // 敌人小车的宽度
    this.height = 30; // 敌人小车的高度
    this.direction = random(TWO_PI); // 随机初始方向
    this.num = num//敌人子弹等级
    // 随机行为的控制变量
    this.nextMoveTime = 1;
    this.nextTurnTime = 1;
    this.moving = false;
    this.turning = false;
    this.hitTime = null; // 被击中的时间，-1 表示未被击中
    this.turnDirection = 0; // 1 表示向右转，-1 表示向左转
    this.turretDirection = 0; // 炮台的初始朝向
    this.turretTurnSpeed = 0.05; // 炮台的转头速度上限，每次更新的最大角度变化
    this.bulletCooldown = 0.12; // 子弹发射间隔，单位秒
    this.lastBulletTime = 0; // 上次发射子弹的时间
    this.lastShootTime = 0; // 上次射击时间
  }
  fireBulletIfPlayerDetected(playerX, playerY) {
    let currentTime = millis();
    
    if (this.canSeePlayer(playerX, playerY, obstacles)) {
      // 如果是首次检测到玩家
      if (this.firstDetectedTime === null) {
        this.firstDetectedTime = currentTime; // 记录首次检测到玩家的时间
      } else if (currentTime - this.firstDetectedTime > 800) {
        // 超过一秒后开始射击
        if (currentTime - this.lastShootTime > 1900) {
          // 发射子弹
          let bulletAngle = atan2(playerY - this.y, playerX - this.x);
          let newBullet = new Bullet1(this.x, this.y, bulletAngle, this.num);
          bullets.push(newBullet);
          this.lastShootTime = currentTime; // 更新上次射击时间
        }
      }
    } else {
      // 如果不能看到玩家，重置首次检测时间
      this.firstDetectedTime = null;
    }
  }
  
  FBullet() {
    // 计算子弹的初始位置和方向
    let bulletX = this.x + cos(this.turretDirection) * 20; // 假设炮管长度为20
    let bulletY = this.y + sin(this.turretDirection) * 20;
    let bulletDirection = this.turretDirection;

    // 创建子弹对象并添加到游戏中
    let bullet = new Bullet1(bulletX, bulletY, bulletDirection);
    // 假设有一个数组来存储游戏中的所有子弹
    bullets.push(bullet);
}
fireBullet(targetX, targetY) {
  // 计算子弹的初始位置和方向
  let bulletDirection = atan2(targetY - this.y, targetX - this.x);
  huge.play();
  let bullet = new Bullet1(this.x, this.y, bulletDirection, this.num);
  bullets.push(bullet);
}

  // 计算边界框
  getBoundingBox() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
  checkCollisionWithOtherCars(enemies) {
    let myBox = this.getBoundingBox();
    for (let other of enemies) {
      if (other !== this) {
        let otherBox = other.getBoundingBox();
        if (myBox.x < otherBox.x + otherBox.width &&
            myBox.x + myBox.width > otherBox.x &&
            myBox.y < otherBox.y + otherBox.height &&
            myBox.y + myBox.height > otherBox.y) {
          // 发生碰撞
          return true;
        }
      }
    }
    return false;
  }
  update(carX, carY, enemies) {
    let currentTime = millis(); // 获取当前时间
  
    // ... 其他移动和转向逻辑 ...
  
    // 检查是否能看到玩家并且是否应该射击
    if (this.canSeePlayer(carX, carY, obstacles) && currentTime - this.lastBulletTime > 1700) {
      this.fireBullet(carX, carY);
      this.lastBulletTime = currentTime;
    }
  
    // ... 其他逻辑，如碰撞检测等 ...
  }
  
  collidesWithObstacle(newX, newY, corners = null) {
    if (!corners) {
      corners = this.calculateRotatedCorners(newX, newY);
    }
  
    for (let obs of obstacles) {
      for (let corner of corners) {
        if (corner.x > obs.x && corner.x < obs.x + obs.width &&
            corner.y > obs.y && corner.y < obs.y + obs.height) {
          return true; // 发生碰撞
        }
      }
    }
    return false; // 无碰撞
  }
  calculateRotatedCorners(x, y) {
    let corners = [];
    let dx = this.width / 2;
    let dy = this.height / 2;

    // 四个角的相对位置
    let offsets = [
      { x: -dx, y: -dy },
      { x: dx, y: -dy },
      { x: -dx, y: dy },
      { x: dx, y: dy }
    ];

    for (let offset of offsets) {
      // 计算旋转后的角位置
      let rotatedX = x + offset.x * cos(this.direction) - offset.y * sin(this.direction);
      let rotatedY = y + offset.x * sin(this.direction) + offset.y * cos(this.direction);
      corners.push({ x: rotatedX, y: rotatedY });
    }

    return corners;
  }
  collidesWithSemiCircle(newX, newY) {
    // 圆弧中心的坐标
    let arcCenterX = semiCircleX;
    let arcCenterY = semiCircleY;
    // 圆弧的半径
    let arcRadius = semiCircleDiameter / 2; // 直径除以2得到半径
    // 圆弧的起始和终止角度
    let arcStart = PI;
    let arcEnd = TWO_PI;
    Semiedgethickness = 30;
    // 获取小车的四个角点
    let corners = this.calculateRotatedCorners(newX, newY);

    // 检查每个角点是否在半圆弧内
    for (let corner of corners) {
        // 计算角点到圆弧中心的距离
        let distToArcCenter = dist(corner.x, corner.y, arcCenterX, arcCenterY);

        // 检查角点是否在半圆弧的内沿和外沿之间
        if (distToArcCenter >= arcRadius - Semiedgethickness/2 && distToArcCenter <= arcRadius + Semiedgethickness/2) {
            // 计算角点相对于圆弧中心的角度
            let angleToArcCenter = atan2(corner.y - arcCenterY, corner.x - arcCenterX);

            // 由于 atan2 返回的角度范围是 -PI 到 PI，我们需要调整角度范围以匹配半圆弧的范围
            if (angleToArcCenter < 0) {
                angleToArcCenter += TWO_PI;
            }

            // 检查角度是否在半圆弧的范围内
            if (angleToArcCenter >= arcStart && angleToArcCenter <= arcEnd) {
                return true; // 如果任何一个角点在半圆弧内，返回 true 表示发生碰撞
            }
        }
    }

    return false; // 如果没有角点在半圆弧内，返回 false 表示没有碰撞
}
calculateFutureRotatedCorners(x, y, futureDirection) {
  let corners = [];
  let dx = this.width / 2;
  let dy = this.height / 2;

  let offsets = [
    { x: -dx, y: -dy },
    { x: dx, y: -dy },
    { x: -dx, y: dy },
    { x: dx, y: dy }
  ];

  for (let offset of offsets) {
    let rotatedX = x + offset.x * cos(futureDirection) - offset.y * sin(futureDirection);
    let rotatedY = y + offset.x * sin(futureDirection) + offset.y * cos(futureDirection);
    corners.push({ x: rotatedX, y: rotatedY });
  }

  return corners;
}
  display(playerX,playerY) {
    push(); // 保存当前绘图设置
    translate(this.x, this.y); // 将原点移动到小车位置
    rotate(this.direction); // 根据移动方向旋转

    // 绘制小车本体
    fill((this.num-1)*35*(this.num-2),(this.num-3)*134*(this.num-2),(this.num-3)*15*(this.num-1)); 
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.width, this.height); // 绘制小车的主体

    // 判断是否能看到玩家小车
    let canSee = this.canSeePlayer(playerX, playerY, obstacles);
    let desiredTurretAngle;
    if (canSee) {
      // 如果能看到玩家，炮台朝向玩家小车
      desiredTurretAngle = atan2(playerY - this.y, playerX - this.x) - this.direction;
    } else {
      // 如果看不到玩家，保持当前方向或采取其他默认方向
      desiredTurretAngle = 0; // 或者任何你想要的默认方向
    }

    // 炮台的参数
    let turretLength = 20;
    let turretWidth = 20;

    // 调整炮台朝向
    let angleDifference = desiredTurretAngle - this.turretDirection;
    // 确保角度差在 -PI 到 PI 之间
    if (angleDifference > PI) angleDifference -= TWO_PI;
    if (angleDifference < -PI) angleDifference += TWO_PI;

    // 根据转头速度上限调整炮台朝向
    if (abs(angleDifference) > this.turretTurnSpeed) {
        this.turretDirection += this.turretTurnSpeed * Math.sign(angleDifference);
    } else {
        this.turretDirection = desiredTurretAngle;
    }

    // 绘制炮台
    push(); // 再次保存绘图设置
    rotate(this.turretDirection); // 旋转到炮台应该指向的方向

    fill(60*(this.num+2), 250*(this.num-2), 56*(this.num-1)); // 
    // 三角形的顶点现在被调整，使得一个顶点直接指向鼠标
    triangle(turretLength, 0, -turretWidth / 2, -turretWidth / 2, -turretWidth / 2, turretWidth / 2);
    pop(); // 恢复炮台的绘图设置
    pop(); // 恢复小车的绘图设置
  }
  isHitByBullet(bullet) {
    let carWidth = 50; // 假设车辆的宽度
    let carHeight = 30; // 假设车辆的高度
    return bullet.x > this.x - carWidth / 2 &&
           bullet.x < this.x + carWidth / 2 &&
           bullet.y > this.y - carHeight / 2 &&
           bullet.y < this.y + carHeight / 2;
  }
  // 检查与玩家小车之间是否有障碍物
  canSeePlayer(playerX, playerY, obstacles) {
    return true;
  }
  
  

  
}

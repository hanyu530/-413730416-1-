let stars = [];
let meteors = [];
let gradientColors;
let meteorX, meteorY; // 流星的位置
let meteorSpeed; // 流星的速度

function setup() { 
  createCanvas(windowWidth, windowHeight); // 全視窗畫布
  noStroke();

  // 產生星星
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: random(150, 255),
    });
  }

  // 初始化流星
  for (let i = 0; i < 5; i++) {
    meteors.push(createMeteor());
  }

  // 設定背景漸層顏色
  gradientColors = [color(10, 10, 30), color(0, 0, 50), color(20, 20, 70)];

  meteorX = random(width); // 随机初始位置
  meteorY = random(height);
  meteorSpeed = 5; // 初始速度
}

function draw() {
  drawGradientBackground(); // 繪製漸層背景

  // 繪製星星
  for (let star of stars) {
    // 計算滑鼠與星星的距離
    let distanceToMouse = dist(mouseX, mouseY, star.x, star.y);
    let mouseEffect = map(distanceToMouse, 0, width / 2, 100, 0); // 距離越近，影響越大
    star.brightness = map(sin(frameCount * 0.05 + star.x), -1, 1, 150, 255) + mouseEffect;
    star.brightness = constrain(star.brightness, 150, 255); // 限制亮度範圍
    fill(star.brightness);
    ellipse(star.x, star.y, star.size);
  }

  // 繪製流星
  for (let meteor of meteors) {
    drawMeteor(meteor);
    updateMeteor(meteor);
  }

  // 根据鼠标位置调整速度
  meteorSpeed = map(mouseX, 0, width, 2, 10); // 从慢到快，范围 2 到 10

  // 更新流星位置
  meteorX += meteorSpeed;
  meteorY += meteorSpeed * 0.5; // 斜向移动

  // 如果流星超出屏幕，重置位置
  if (meteorX > width || meteorY > height) {
    meteorX = random(width);
    meteorY = random(height);
  }

  // 绘制流星
  fill(255);
  noStroke();
  ellipse(meteorX, meteorY, 10, 10); // 流星为一个小圆点
}

function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(gradientColors[0], gradientColors[2], inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawMeteor(meteor) {
  // 繪製流星的尾巴
  for (let i = 0; i < meteor.trail.length; i++) {
    let t = meteor.trail[i];
    fill(255, 255, 255, map(i, 0, meteor.trail.length, 50, 0)); // 尾巴漸淡
    ellipse(t.x, t.y, meteor.size);
  }

  // 繪製流星本體
  fill(lerpColor(color(255, 255, 255), color(255, 165, 0), sin(frameCount * 0.1))); // 流星顏色變化
  ellipse(meteor.x, meteor.y, meteor.size);
}

function updateMeteor(meteor) {
  // 根據滑鼠位置調整流星速度
  let speedFactor = map(mouseX, 0, width, 0.5, 2); // 滑鼠左慢右快，速度範圍 0.5 到 2
  meteor.speedX = meteor.baseSpeedX * speedFactor;
  meteor.speedY = meteor.baseSpeedY * speedFactor;

  // 更新流星位置
  meteor.x += meteor.speedX;
  meteor.y += meteor.speedY;

  // 更新流星尾巴
  meteor.trail.push({ x: meteor.x, y: meteor.y });
  if (meteor.trail.length > meteor.trailLength) {
    meteor.trail.shift();
  }

  // 如果流星超出畫布，重置
  if (meteor.x > width || meteor.y > height) {
    Object.assign(meteor, createMeteor());
  }
}

function createMeteor() {
  // 建立一個新的流星
  let baseSpeedX = random(5, 10);
  let baseSpeedY = random(3, 7);
  return {
    x: random(-width, 0), // 從畫布外開始
    y: random(-height / 2, height / 2),
    size: random(3, 6),
    baseSpeedX: baseSpeedX, // 基礎水平速度
    baseSpeedY: baseSpeedY, // 基礎垂直速度
    speedX: baseSpeedX, // 當前水平速度
    speedY: baseSpeedY, // 當前垂直速度
    trail: [],
    trailLength: int(random(10, 20)),
  };
}

function mousePressed() {
  // 滑鼠點擊時新增流星
  meteors.push(createMeteor());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時，調整畫布大小
}

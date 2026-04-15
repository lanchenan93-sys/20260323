let bubbles = [];
let grasses = [];
let fishes = [];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('pointer-events', 'none'); // 設定畫布不攔截滑鼠事件，讓使用者能操作下方的 iframe
  cnv.position(0, 0);
  cnv.style('z-index', '1'); // 確保畫布在 iframe 之上

  let iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.et.tku.edu.tw/');
  iframe.position(0, 0);
  iframe.size(windowWidth, windowHeight);
  iframe.style('border', 'none');
  iframe.style('z-index', '-1'); // 將 iframe 設定在最底層

  // 將水草的生成移到 setup，只執行一次
  randomSeed(100);
  for (let x = 0; x < width; x += 20) {
    grasses.push({
      x: x,
      h: random(50, height / 3),
      c: color(random(255), random(255), random(255), 150),
      noiseOffset: random(1000)
    });
  }

  for (let i = 0; i < 5; i++) {
    fishes.push(new Fish());
  }
}

function draw() {
  clear(); // 清除背景變成透明，讓下方的 iframe 網頁顯示出來

  strokeWeight(30); // 加粗水草
  noFill();

  // 改為讀取預先生成的 grasses 陣列
  for (let g of grasses) {
    stroke(g.c);
    beginShape();
    for (let i = 0; i < g.h; i += 10) {
      let n = noise(frameCount * 0.01 + i * 0.005 + g.noiseOffset);
      let xOffset = map(n, 0, 1, -80, 80) * (i / 200);
      vertex(g.x + xOffset, height - i);
    }
    endShape();
  }

  // --- 小丑魚區塊 ---
  for (let f of fishes) {
    f.move();
    f.display();
  }

  // --- 氣泡效果區塊 ---
  noStroke(); // 去掉氣泡邊框
  fill(255, 200); // 提高白色填充的不透明度

  if (random() < 0.05) { // 每幀有 5% 機率產生新氣泡
    bubbles.push(new Bubble());
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].move();
    bubbles[i].display();
    if (bubbles[i].isFinished()) { // 如果氣泡到達高度破裂
      bubbles.splice(i, 1);
    }
  }
}

class Bubble {
  constructor() {
    this.x = random(width); // 隨機水平位置
    this.y = height + random(10); // 從底部生成
    this.size = random(20, 50); // 加大氣泡尺寸
    this.speed = random(1, 3); // 緩緩上升的速度
    this.popHeight = random(0, height * 0.6); // 設定隨機破裂高度
  }

  move() {
    this.y -= this.speed; // 向上移動
    this.x += random(-1, 1); // 輕微左右飄動
  }

  display() {
    circle(this.x, this.y, this.size);
  }

  isFinished() {
    return this.y < this.popHeight;
  }
}

class Fish {
  constructor() {
    this.x = random(width);
    this.y = random(height - 300, height - 50); // 限制在畫面下方水草區
    this.size = random(30, 50);
    this.speed = random(1, 3) * (random() > 0.5 ? 1 : -1); // 隨機左右游動
  }

  move() {
    this.x += this.speed;
    // 超出畫面時從另一邊出現
    if (this.speed > 0 && this.x > width + 50) this.x = -50;
    if (this.speed < 0 && this.x < -50) this.x = width + 50;
  }

  display() {
    push();
    translate(this.x, this.y);
    if (this.speed < 0) scale(-1, 1); // 如果往左游，水平翻轉

    noStroke();
    fill(255, 100, 0); // 橘色身體
    ellipse(0, 0, this.size, this.size * 0.6);
    triangle(-this.size * 0.4, 0, -this.size * 0.7, -this.size * 0.2, -this.size * 0.7, this.size * 0.2); // 尾巴
    fill(255); // 白色條紋
    rect(-this.size * 0.1, -this.size * 0.25, this.size * 0.2, this.size * 0.5, 5);
    fill(0); // 眼睛
    circle(this.size * 0.25, -this.size * 0.1, 4);
    pop();
  }
}

"use strict";
function RandChar(prevChar) {
  if (prevChar && prevChar.ttl) {
    prevChar.ttl--;
    return prevChar;
  }
  return {
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
    ttl: Math.floor(Math.random() * CHAR_MAX_LIFE)
  };
}
function generateDrop(prev) {
  const chars = Array(Math.floor(Math.random() * (DROP_MAX_LENGTH - 5) + 5))
    .fill(null)
    .map(RandChar);
  const fontSize = Math.floor(
    Math.random() * (MAX_DROP_FONT_SIZE - MIN_DROP_FONT_SIZE) +
      MIN_DROP_FONT_SIZE
  );
  const font = fontSize + "px monospace";
  if (!prev) prev = {};
  prev.x = Math.floor(Math.random() * canvas.width);
  prev.y = Math.floor(
    Math.random() * (canvas.height * 2) -
      canvas.height * 2 -
      chars.length * fontSize -
      200
  );
  prev.chars = chars;
  prev.font = font;
  prev.timeToMove = 0;
  return prev;
}
function scrambleDrop(drop) {
  drop.chars = drop.chars.map(RandChar);
  drop.chars.shift();
  drop.chars.push(RandChar());
  return drop;
}
const CHARS = "!\"#$%&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".split(
  ""
);
const DROPS = 120;
const DROP_MAX_LENGTH = 20;
const CHAR_MAX_LIFE = 10;
const MIN_DROP_FONT_SIZE = 17;
const MAX_DROP_FONT_SIZE = 22;
const DROP_SPEED = 1;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
ctx.textRendering = "optimizeSpeed";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const drops = [];
for (let row = 0; row < DROPS; row++) {
  drops.push(generateDrop());
}
let prevTime = 0;
function drawText(text, x, y, fillStyle, font, shadowBlur = 5) {
  ctx.shadowColor = fillStyle;
  ctx.shadowOffsetX = 200;
  ctx.shadowOffsetY = 200;
  ctx.shadowBlur = 0;
  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.fillText(text, x, y);
}
function draw(timestamp) {
  const passedTime = timestamp - prevTime;
  prevTime = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < drops.length; i++) {
    const fontSize = parseInt(drops[i].font);
    for (let k = 0; k < drops[i].chars.length; k++) {
      let color, shadowBlur;
      if (k === drops[i].chars.length - 1) {
        const s = 255 * (k / DROP_MAX_LENGTH);
        color = `rgb(${s},${s},${s})`;
        shadowBlur = 5;
      } else {
        color = `rgb(0, ${255 * (k / DROP_MAX_LENGTH)}, 0)`;
        shadowBlur = 10;
      }
      drawText(
        drops[i].chars[k].char,
        drops[i].x,
        drops[i].y + k * fontSize,
        color,
        drops[i].font,
        shadowBlur
      );
    }
    drops[i].timeToMove--;
    if (drops[i].timeToMove <= 0) {
      scrambleDrop(drops[i]);
      drops[i].y += fontSize;
      drops[i].timeToMove = fontSize ** -6.5 / (DROP_SPEED * 10 ** -9);
    }
    if (drops[i].y >= canvas.height) drops[i] = generateDrop(drops[i]);
  }
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
window.addEventListener("resize", (event) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

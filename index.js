const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const pointsHTML = document.querySelector("#points");
const recordHTML = document.querySelector("#recordpoints");
const modalHTML = document.querySelector(".StartContainer");
const startbuttonHTML = document.querySelector(".Start");
let record = JSON.parse(localStorage.getItem("Record")) || { record: 0 };
canvas.width = 500;
canvas.height = 500;

//--   Input
let INPUT_TRAGGED = "";
window.addEventListener("keydown", (evento) => {
  const key = evento.key.toLocaleLowerCase();
  if ((key === "w" || key === "arrowup") && INPUT_TRAGGED !== "DOWN") {
    INPUT_TRAGGED = "UP";
  }
  if ((key === "s" || key === "arrowdown") && INPUT_TRAGGED !== "UP") {
    INPUT_TRAGGED = "DOWN";
  }
  if ((key === "a" || key === "arrowleft") && INPUT_TRAGGED !== "RIGHT") {
    INPUT_TRAGGED = "LEFT";
  }
  if ((key === "d" || key === "arrowright") && INPUT_TRAGGED !== "LEFT") {
    INPUT_TRAGGED = "RIGHT";
  }
});
//--   Blocks
const BLOCKS_SIZE = 25;
const BLOCK_X = 500 / BLOCKS_SIZE;
const BLOCK_Y = 500 / BLOCKS_SIZE;
//--  Snake
let snake = [];

//-- Points

let points = 0;
let food = {
  x: 0,
  y: 0,
};
//--  RECORD

function IsRecord() {
  if (points > record.record) {
    localStorage.setItem("Record", JSON.stringify({ record: points }));
    record = { record: points };
  }
}

//--  FUNC FOODS

function GenerateFoods() {
  const LOC_X = Math.floor(Math.random() * BLOCK_X);
  const LOC_Y = Math.floor(Math.random() * BLOCK_Y);
  food.x = LOC_X;
  food.y = LOC_Y;
}
//-- States
let States = "MENU";
function StartGame() {
  modalHTML.classList.remove("Active");
  States = "GAME";
  GenerateFoods();
}
function Menu() {
  modalHTML.classList.add("Active");
  snake = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
  ];
  INPUT_TRAGGED = "UP";
  States = "MENU";
  points = 0;
  food = {
    x: 10,
    y: 10,
  };
}
// -- Configs
Menu();
startbuttonHTML.addEventListener("click", StartGame);
//-- RESTART AND START

function VerifyCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= BLOCK_X || head.y < 0 || head.y >= BLOCK_Y) {
    Menu();
  }
  const TOUCHEDSELF = snake
    .slice(1)
    .some((sg) => sg.x === head.x && sg.y === head.y);
  if (TOUCHEDSELF) {
    Menu();
  }
}

//--  Walk Snake
function WalkSnake() {
  const head = snake[0];
  const newHead = {
    x: head.x,
    y: head.y,
  };
  if (INPUT_TRAGGED === "UP") {
    newHead.y -= 1;
  }
  if (INPUT_TRAGGED === "DOWN") {
    newHead.y += 1;
  }
  if (INPUT_TRAGGED === "LEFT") {
    newHead.x -= 1;
  }
  if (INPUT_TRAGGED === "RIGHT") {
    newHead.x += 1;
  }
  const eatfood = newHead.x === food.x && newHead.y === food.y;
  if (eatfood) {
    points += 100;
    snake.unshift(newHead);
    GenerateFoods();
  } else {
    snake.unshift(newHead);
    snake.pop();
  }

  VerifyCollision();
}

//--  Render
function Render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //--Snake
  snake.forEach((e, i) => {
    if (i === 0) {
      ctx.fillStyle = "#03c500";
    } else {
      ctx.fillStyle = "green";
    }

    ctx.fillRect(
      e.x * BLOCKS_SIZE,
      e.y * BLOCKS_SIZE,
      BLOCKS_SIZE,
      BLOCKS_SIZE,
    );
  });
  //-- Food
  ctx.fillStyle = "red";
  ctx.fillRect(
    food.x * BLOCKS_SIZE,
    food.y * BLOCKS_SIZE,
    BLOCKS_SIZE,
    BLOCKS_SIZE,
  );
}

setInterval(() => {
  recordHTML.innerHTML = "Records: " + record.record;
  if (States === "GAME") {
    IsRecord();
    pointsHTML.innerHTML = "Points: " + points;
    WalkSnake();
    Render();
  }
}, 125);

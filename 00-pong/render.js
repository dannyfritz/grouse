import {
  Application, Circle, Container, Graphics, Rectangle, Text, TextStyle,
} from "pixi.js";
import {
  getScores,
  getPaddlePos, getBallPos,
  ARENA_WIDTH, ARENA_HEIGHT,
  BALL_SIZE,
  PADDLE_WIDTH, PADDLE_HEIGHT,
} from "./constants";

const application = new Application({
  width: ARENA_WIDTH,
  height: ARENA_HEIGHT,
  autoStart: false,
});

document.body.appendChild(application.view);
const circle = new Circle(0, 0, BALL_SIZE);
const rectangle = new Rectangle(10, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
const graphics = new Graphics();
application.stage.addChild(graphics);
const ui = new Container();
const score1 = new Text('0', new TextStyle({
  fill: "#ffffff",
}));
const score2 = new Text('0', new TextStyle({
  align: "right",
  fill: "#ffffff",
}));
ui.addChild(score1);
ui.addChild(score2);
application.stage.addChild(ui);

export const render = (state) => {
  [score1.text, score2.text] = getScores(state);
  score2.x = ARENA_WIDTH - score2.width;
  [circle.x, circle.y] = getBallPos(state);
  [rectangle.y] = getPaddlePos(state);
  graphics.clear();
  graphics.beginFill(0xFFFFFF);
  graphics.drawShape(circle);
  graphics.drawShape(rectangle);
  graphics.endFill();
  application.render();
};

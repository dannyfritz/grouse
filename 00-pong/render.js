import {
  Application, Circle, Graphics, Rectangle,
} from "pixi.js";
import {
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

export const render = (state) => {
  [circle.x, circle.y] = getBallPos(state);
  [rectangle.y] = getPaddlePos(state);
  graphics.clear();
  graphics.beginFill(0xFFFFFF);
  graphics.drawShape(circle);
  graphics.drawShape(rectangle);
  graphics.endFill();
  application.render();
};

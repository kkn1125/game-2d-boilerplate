import {
  CAMERA,
  COLOR,
  CONTROL,
  ctx,
  JOYSTICK,
  MAP_PADDING,
  master,
  SIZE,
} from "../util/global";
import Inventory from "./Inventory";
import Item from "./Item";

export default class Unit {
  static id: number = 0;
  id: number = 0;
  name: string;
  x: number = 0;
  y: number = 0;
  state: string = "hold";
  color: COLOR = COLOR.UNIT;
  velocity: number = master.velocity;
  money: number = 0;
  inventory: Inventory = new Inventory();
  locate: string = "home";

  constructor(name: string);
  constructor(id: number, name: string);
  constructor(a: number | string, b?: string) {
    if (typeof a === "string") {
      this.id = Unit.id;
      this.name = a;
      Unit.id++;
    } else if (typeof a === "number" && b) {
      this.id = (a as number) || Unit.id++;
      this.name = b;
    } else if (typeof a === "number" && !b) {
      this.id = (a as number) || Unit.id++;
      this.name = b || "guest";
    }
    this.goSpawn();
  }

  setLocate(locate: string) {
    this.locate = locate;
    this.goSpawn();
  }

  setPosition(x: number, y: number) {
    this.x = (x + MAP_PADDING) * SIZE.BLOCK() * SIZE.SCALE();
    this.y = (y + MAP_PADDING) * SIZE.BLOCK() * SIZE.SCALE();
  }

  setColor(color: COLOR) {
    this.color = color;
  }

  goSpawn(x: number = 0, y: number = 0) {
    if (this.locate === "home") this.setPosition(x || 25, y || 5);
    if (this.locate === "bcenter") this.setPosition(x || 5, y || 5);
  }

  move() {
    if (master.me?.id === this.id) {
      if (JOYSTICK["w"] || JOYSTICK["s"] || JOYSTICK["a"] || JOYSTICK["d"]) {
        JOYSTICK["w"] && (this.y -= this.velocity);
        JOYSTICK["s"] && (this.y += this.velocity);
        JOYSTICK["a"] && (this.x -= this.velocity);
        JOYSTICK["d"] && (this.x += this.velocity);
      }
    }
  }

  render() {
    const x = CAMERA.X();
    const y = CAMERA.Y();

    const responsivePositionX =
      x + this.x * CONTROL.SCALE - (master.me?.x || 0) * CONTROL.SCALE;
    const responsivePositionY =
      y + this.y * CONTROL.SCALE - (master.me?.y || 0) * CONTROL.SCALE;

    this.move();

    ctx.textAlign = "center";
    ctx.font = `bold ${16 * SIZE.SCALE() * 0.1}px sans-serif`;

    /* text outline */
    ctx.lineWidth = 3;
    ctx.strokeStyle =
      this.constructor.name === "Portal" ? "#00000000" : "#000000";
    ctx.strokeText(
      this.name.toUpperCase(),
      master.me?.id === this.id
        ? x + (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionX + (SIZE.UNIT() * SIZE.SCALE()) / 2,
      master.me?.id === this.id
        ? y - (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionY - (SIZE.UNIT() * SIZE.SCALE()) / 2
    );

    /* text */
    ctx.fillStyle =
      this.constructor.name === "NPC"
        ? this.color
        : this.constructor.name === "Portal"
        ? COLOR.PORTAL + "00"
        : COLOR.NAME;
    ctx.fillText(
      this.name.toUpperCase(),
      master.me?.id === this.id
        ? x + (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionX + (SIZE.UNIT() * SIZE.SCALE()) / 2,
      master.me?.id === this.id
        ? y - (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionY - (SIZE.UNIT() * SIZE.SCALE()) / 2
    );
    ctx.fillStyle = this.color;
    ctx.fillRect(
      // this.x,
      // this.y,
      master.me?.id === this.id ? x : responsivePositionX,
      master.me?.id === this.id ? y : responsivePositionY,
      // 0,
      // 0,
      SIZE.UNIT() * SIZE.SCALE(),
      SIZE.UNIT() * SIZE.SCALE()
    );
  }

  renderShadow() {
    const x = CAMERA.X();
    const y = CAMERA.Y();
    const shadowSize = 7;
    const shadowOffsetX = 17;
    const shadowOffsetY = 25;
    const shadowSizeX = 5;
    const shadowSizeY = 28;
    // const shadowOffsetY = 30;

    const responsivePositionX =
      x + this.x * CONTROL.SCALE - (master.me?.x || 0) * CONTROL.SCALE;
    const responsivePositionY =
      y + this.y * CONTROL.SCALE - (master.me?.y || 0) * CONTROL.SCALE;

    ctx.shadowBlur = 5;
    ctx.shadowColor = "#000000";
    ctx.fillStyle = "#00000056";
    ctx.beginPath();
    ctx.ellipse(
      (master.me?.id === this.id ? x : responsivePositionX) +
        (SIZE.UNIT() * SIZE.SCALE()) / 2 +
        shadowOffsetX -
        shadowSize,
      (master.me?.id === this.id ? y : responsivePositionY) +
        (SIZE.UNIT() * SIZE.SCALE()) / 2 +
        shadowOffsetY -
        shadowSize,
      SIZE.UNIT() * SIZE.SCALE() - shadowSizeX - shadowSize,
      SIZE.UNIT() * SIZE.SCALE() - shadowSizeY - shadowSize,
      Math.PI * 0.95,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  getItem(newItem: Item) {
    for (let row of this.inventory.bag) {
      const noneIndex = row.findIndex((cell) => cell.type === "none");
      if (noneIndex > -1) {
        row[noneIndex] = newItem;
        break;
      }
    }
  }
  dropItem() {}
}

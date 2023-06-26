import { COLOR, ctx, JOYSTICK, master, SIZE } from "../util/global";

export default class Unit {
  static id: number = 0;
  id: number = 0;
  name: string;
  x: number = 0;
  y: number = 0;
  state: string = "hold";
  color: COLOR = COLOR.UNIT;
  velocity: number = master.velocity;

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

  setColor(color: COLOR) {
    this.color = color;
  }

  goSpawn(x: number = 0, y: number = 0) {
    this.x = x + SIZE.BLOCK * SIZE.SCALE * 1;
    this.y = y + SIZE.BLOCK * SIZE.SCALE * 1;
  }

  move() {
    if (master.me?.id === this.id) {
      if (JOYSTICK["w"] || JOYSTICK["s"] || JOYSTICK["a"] || JOYSTICK["d"]) {
        // this.velocity = 1;
        JOYSTICK["w"] && (this.y -= this.velocity);
        JOYSTICK["s"] && (this.y += this.velocity);
        JOYSTICK["a"] && (this.x -= this.velocity);
        JOYSTICK["d"] && (this.x += this.velocity);
        // this.velocity = 0;
      }
    }
  }

  render() {
    this.move();
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x,
      this.y,
      SIZE.UNIT * SIZE.SCALE,
      SIZE.UNIT * SIZE.SCALE
    );
  }
}

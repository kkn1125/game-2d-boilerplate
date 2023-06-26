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

  setPosition(x: number, y: number) {
    this.x = x * SIZE.BLOCK * SIZE.SCALE;
    this.y = y * SIZE.BLOCK * SIZE.SCALE;
  }

  setColor(color: COLOR) {
    this.color = color;
  }

  goSpawn(x: number = 0, y: number = 0) {
    // this.x = x + SIZE.BLOCK * SIZE.SCALE * 1;
    // this.y = y + SIZE.BLOCK * SIZE.SCALE * 1;
    // this.x = innerWidth / 2 - (SIZE.UNIT * SIZE.SCALE) / 2;
    // this.y = innerHeight / 2 - (SIZE.UNIT * SIZE.SCALE) / 2;
    this.setPosition(25, 5);
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
    const x = innerWidth / 2 - (SIZE.UNIT * SIZE.SCALE) / 2;
    const y = innerHeight / 2 + (SIZE.UNIT * SIZE.SCALE) / 2;

    this.move();
    ctx.fillStyle = COLOR.NAME;
    ctx.textAlign = "center";
    ctx.font = "Bold 1rem sans-serif";
    ctx.fillText(
      this.name,
      master.me?.id === this.id
        ? x + (SIZE.UNIT * SIZE.SCALE) / 2
        : x + this.x - (master.me?.x || 0) + (SIZE.UNIT * SIZE.SCALE) / 2,
      master.me?.id === this.id
        ? y - (SIZE.UNIT * SIZE.SCALE) / 2
        : y + this.y - (master.me?.y || 0) - (SIZE.UNIT * SIZE.SCALE) / 2
    );
    ctx.fillStyle = this.color;
    ctx.fillRect(
      // this.x,
      // this.y,
      master.me?.id === this.id ? x : x + this.x - (master.me?.x || 0),
      master.me?.id === this.id ? y : y + this.y - (master.me?.y || 0),
      // 0,
      // 0,
      SIZE.UNIT * SIZE.SCALE,
      SIZE.UNIT * SIZE.SCALE
    );
  }
}

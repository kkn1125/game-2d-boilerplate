import {
  CAMERA,
  COLOR,
  CONTROL,
  ctx,
  MAP_PADDING,
  master,
  SIZE,
} from "../util/global";

export default class Building {
  static id: number = 0;
  id: number = 0;
  name: string;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  state: string = "hold";
  color: COLOR = COLOR.BUILDING;

  hello: boolean = false;
  nearBy: boolean = false;

  constructor(name: string);
  constructor(id: number, name: string);
  constructor(a: number | string, b?: string) {
    if (typeof a === "string") {
      this.id = Building.id;
      this.name = a;
      Building.id++;
    } else if (typeof a === "number" && b) {
      this.id = (a as number) || Building.id++;
      this.name = b;
    } else if (typeof a === "number" && !b) {
      this.id = (a as number) || Building.id++;
      this.name = b || "guest";
    }
    this.goSpawn();
  }

  setPosition(x: number, y: number) {
    this.x = (x + MAP_PADDING) * SIZE.BLOCK() * SIZE.SCALE();
    this.y = (y + MAP_PADDING) * SIZE.BLOCK() * SIZE.SCALE();
  }

  setColor(color: COLOR) {
    this.color = color;
  }

  goSpawn(x: number = 25, y: number = 5) {
    this.setPosition(x, y);
  }

  render() {
    const x = CAMERA.X();
    const y = CAMERA.Y();

    const responsivePositionX =
      x + this.x * CONTROL.SCALE - (master.me?.x || 0) * CONTROL.SCALE;
    const responsivePositionY =
      y + this.y * CONTROL.SCALE - (master.me?.y || 0) * CONTROL.SCALE;

    ctx.fillStyle = COLOR.BUILDING_NAME;
    ctx.textAlign = "center";
    ctx.font = `bold ${16 * SIZE.SCALE() * 0.1}px sans-serif`;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";
    ctx.strokeText(
      this.name.toUpperCase(),
      master.me?.id === this.id
        ? x + (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionX + (this.width / 2) * SIZE.SCALE(),
      master.me?.id === this.id
        ? y - (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionY +
            this.height * SIZE.SCALE() -
            (SIZE.UNIT() * SIZE.SCALE()) / 2
    );

    ctx.fillText(
      this.name.toUpperCase(),
      master.me?.id === this.id
        ? x + (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionX + (this.width / 2) * SIZE.SCALE(),
      master.me?.id === this.id
        ? y - (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionY +
            this.height * SIZE.SCALE() -
            (SIZE.UNIT() * SIZE.SCALE()) / 2
    );
    ctx.fillStyle = this.color;
    ctx.fillRect(
      master.me?.id === this.id ? x : responsivePositionX,
      master.me?.id === this.id ? y : responsivePositionY,
      this.width * SIZE.SCALE(),
      this.height * SIZE.SCALE()
    );
  }

  detectNearByPlayer() {
    master.units.forEach((player) => {
      const unit = SIZE.UNIT();
      const scale = SIZE.SCALE();
      const npcX = this.x * CONTROL.SCALE;
      const npcY = this.y * CONTROL.SCALE;
      const playerX = player.x * CONTROL.SCALE;
      const playerY = player.y * CONTROL.SCALE;
      const leftSide = npcX - unit * scale * 2;
      const rightSide = npcX + unit * scale * 2;
      const topSide = npcY - unit * scale * 2;
      const bottomSide = npcY + unit * scale * 2;
      if (
        leftSide < playerX &&
        playerX < rightSide &&
        topSide < playerY &&
        playerY < bottomSide
      ) {
        this.nearBy = true;
        this.onHello();
      } else {
        this.nearBy = false;
        this.offHello();
      }
    });
  }

  onHello() {
    this.hello = true;
  }
  offHello() {
    this.hello = false;
  }
}

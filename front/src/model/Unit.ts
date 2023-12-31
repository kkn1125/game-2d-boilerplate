import Engine from "../core/Engine";
import NoneItem from "../option/item/NoneItem";
import {
  CAMERA,
  COLOR,
  CONTROL,
  ctx,
  dev,
  JOYSTICK,
  MAP_PADDING,
  master,
  PICK_AVATAR,
  SIZE,
} from "../util/global";
import Inventory from "./Inventory";
import Item from "./Item";
import UI from "./UI";

export default class Unit {
  static id: number = 0;

  ui: UI;
  engine: Engine;

  id: number = 0;
  name: string;
  x: number = 0;
  y: number = 0;
  state: string = "hold";
  color: COLOR = COLOR.UNIT;
  velocity: { x: number; y: number } = {
    x: 0,
    y: 0,
  };
  money: number = 0;
  inventory: Inventory = new Inventory();
  avatar: string;

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
    dev.alias(this.name).log("생성");
  }

  initUI(ui: UI) {
    this.ui = ui;
  }

  initEngine(engine: Engine) {
    this.engine = engine;
  }

  setAvatar(type: "default") {
    this.avatar = type;
  }

  setLocate(locate: string) {
    switch (locate) {
      case "home":
        this.goSpawn(10, 7);
        break;
      case "home-sunset1":
        this.goSpawn(5.7, 0.8);
        break;
      case "bcenter":
        this.goSpawn(5, 5);
        break;
      case "home-bcenter1":
        this.goSpawn(8.8, 6.3);
        break;
      case "fsunsethill":
        this.goSpawn(10.7, 10);
        break;
      default:
        this.goSpawn();
        break;
    }

    this.locate = locate.split("-")[0];
  }

  setPosition(x: number, y: number) {
    this.x = (x + MAP_PADDING) * SIZE.BLOCK() * SIZE.SCALE();
    this.y = (y + MAP_PADDING) * SIZE.BLOCK() * SIZE.SCALE();
  }

  setColor(color: COLOR) {
    this.color = color;
  }

  goSpawn(x: number = 0, y: number = 0) {
    this.setPosition(x || 10, y || 7);
  }

  move() {
    if (master.me?.id === this.id) {
      if (JOYSTICK["w"] || JOYSTICK["s"] || JOYSTICK["a"] || JOYSTICK["d"]) {
        JOYSTICK["w"] && (this.y -= this.velocity.y);
        JOYSTICK["s"] && (this.y += this.velocity.y);
        JOYSTICK["a"] && (this.x -= this.velocity.x);
        JOYSTICK["d"] && (this.x += this.velocity.x);
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
      /* this.constructor.name === "Portal" ? "#00000000" : */ "#000000";
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
        : // : this.constructor.name === "Portal"
          // ? COLOR.PORTAL + "00"
          COLOR.NAME;
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
    if (this.avatar) {
      const image = PICK_AVATAR(this.avatar);
      ctx.drawImage(
        image,
        master.me?.id === this.id ? x : responsivePositionX,
        (master.me?.id === this.id ? y : responsivePositionY) - 10,
        SIZE.UNIT() * SIZE.SCALE() + 10,
        SIZE.UNIT() * SIZE.SCALE() + 10
      );
    } else {
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

  getItem(newItem: Item, force: boolean = false) {
    if (newItem.lock && !force) return;
    for (let row of this.inventory.bag) {
      const noneIndex = row.findIndex((cell) => cell === null);
      if (noneIndex > -1) {
        const index = this.engine.dropList.findIndex(
          (drop) => drop.id === newItem.id
        );
        if (index > -1) {
          const dropedItem = this.engine.dropList.splice(index, 1)[0];
          dropedItem.locate = "";
        }
        row[noneIndex] = newItem;
        newItem.lock = true;
        if (this.inventory.isOpen) {
          this.ui.redrawInventory.call(this.ui);
        }
        break;
      }
    }
  }

  dropItem(row: number = 0, column: number = 0) {
    console.log("drop");
    const dropItem = this.inventory.bag[row].splice(column, 1, null)[0];
    console.log(dropItem);
    if (dropItem) {
      dropItem?.drop(this.locate, this.x, this.y);
      this.engine.dropList.push(dropItem);
      dev.alias("after drop bag").log(this.inventory.bag[0][0]);
      dev.alias("drop item").log(dropItem);
      if (this.inventory.isOpen) {
        this.ui.redrawInventory.call(this.ui);
      }
      return dropItem;
    }

    return null;
  }
}

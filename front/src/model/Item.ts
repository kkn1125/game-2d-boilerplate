import Engine from "../core/Engine";
import {
  CAMERA,
  COLOR,
  CONTROL,
  dev,
  dropCanvas,
  DROP_LOCK_TIME,
  master,
  SIZE,
} from "../util/global";
import ChatQueue from "./ChatQueue";
import UI from "./UI";
import Unit from "./Unit";

type ItemArguments = {
  [key in keyof Item]?: any;
};

export default class Item {
  static idnumber = 0;
  dropCtx: CanvasRenderingContext2D;

  startBound: number = 0;

  id: number = 0;
  name: string = "";
  price: number = 0;
  str: number = 0;
  dex: number = 0;
  int: number = 0;
  luck: number = 0;

  x: number = 0;
  y: number = 0;

  type: ItemType = "none";

  wearPlace: ItemWearPlaceType = "none";

  currentDurablility: number = 0;
  maxDurability: number = 10;

  enforce: number = 0;
  maxEnforce: number = 5;

  slot: Item[] = [];

  /* 인첸트 개발 중 */
  enchantment = null;

  locate: string;

  lock: boolean = true;

  color: COLOR = COLOR.ITEM;
  hello: boolean = false;
  question: boolean = false;
  nearBy: boolean = false;
  flag: "up" | "down" = "up";
  bound: number = 10;
  eventList: {
    [key: string]: Function[];
  } = {};

  ui: UI;
  engine?: Engine;
  chatQueue: ChatQueue = new ChatQueue();

  constructor(options: ItemArguments) {
    this.dropCtx = dropCanvas.getContext("2d") as CanvasRenderingContext2D;
    Object.entries(options).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }

  getName() {
    return `+${this.enforce} ${this.name}`;
  }

  /* drop axis save */
  drop(locate: string, x: number, y: number) {
    this.locate = locate;
    this.x = x;
    this.y = y;
    setTimeout(() => {
      console.log("lock 해제");
      this.lock = false;
    }, DROP_LOCK_TIME);
  }

  addEventListener(type: "nearby" | "messageend", fn: Function) {
    if (!this.eventList[type]) this.eventList[type] = [];
    this.eventList[type].push(fn);
  }

  addStaticMessage(message: string) {
    this.chatQueue.addMessage(message, false);
  }

  addAutoMessage(message: string) {
    this.chatQueue.addMessage(message, true);
  }

  talk() {
    const npc = this;
    const message = this.chatQueue.talk((isNext: boolean) => {
      if (isNext) {
        npc.talk();
      }
    });

    if (message) {
      this.ui.openModal(
        this.id,
        this.name,
        this.constructor.name,
        message.message
      );
    } else {
      this.eventList?.["messageend"]?.forEach?.((fn) => fn(this.engine));
      UI.clearChatModals();
      this.talkExit();
    }
  }

  talkExit() {
    UI.clearChatModals();
    this.chatQueue.stop();
    if (master.me) master.me.velocity = master.velocity;
  }

  questionRender() {
    // this.dropCtx.fillRect(this.x, this.y, 10, 10);

    const x = CAMERA.X();
    const y = CAMERA.Y();

    const size = this.startBound;
    const npcX = this.x * CONTROL.SCALE;
    const npcY = this.y * CONTROL.SCALE;
    const playerX = (master.me?.x || 0) * CONTROL.SCALE;
    const playerY = (master.me?.y || 0) * CONTROL.SCALE;
    const unitSize = (SIZE.UNIT() * SIZE.SCALE()) / 2;

    this.dropCtx.font = `bold ${36 * SIZE.SCALE() * 0.1}px sans-serif`;
    this.dropCtx.lineWidth = 5;
    this.dropCtx.strokeStyle = COLOR.WHITE;
    this.dropCtx.strokeText(
      "?",
      x + npcX - playerX + unitSize,
      -(SIZE.SCALE() * 2.5) + size + y + npcY - playerY - unitSize
    );
    this.dropCtx.fillStyle = COLOR.WARN;
    this.dropCtx.fillText(
      "?",
      x + npcX - playerX + unitSize,
      -(SIZE.SCALE() * 2.5) + size + y + npcY - playerY - unitSize
    );
    if (this.flag === "up") {
      if (this.startBound < this.bound) {
        this.startBound += 0.035 * SIZE.SCALE();
      } else {
        this.flag = "down";
      }
    } else if (this.flag === "down") {
      if (this.startBound > 0) {
        this.startBound -= 0.035 * SIZE.SCALE();
      } else {
        this.flag = "up";
      }
    }
  }

  detectNearByPlayer() {
    master.units.forEach((player) => {
      const unit = SIZE.UNIT();
      const scale = SIZE.SCALE();
      const boundary = unit * scale * 2;
      const npcX = this.x * CONTROL.SCALE;
      const npcY = this.y * CONTROL.SCALE;
      const playerX = player.x * CONTROL.SCALE;
      const playerY = player.y * CONTROL.SCALE;
      const leftSide = npcX - boundary;
      const rightSide = npcX + boundary;
      const topSide = npcY - boundary;
      const bottomSide = npcY + boundary;
      if (
        leftSide < playerX &&
        playerX < rightSide &&
        topSide < playerY &&
        playerY < bottomSide &&
        player.locate === this.locate
      ) {
        if (!this.nearBy) {
          this.eventList?.["nearby"]?.forEach?.((fn) => fn(this.engine));
        }
        this.nearBy = true;
        this.onHello();
      } else {
        this.nearBy = false;
        this.offHello();
      }
    });
  }

  render() {
    this.detectNearByPlayer();
    const x = CAMERA.X();
    const y = CAMERA.Y();

    const responsivePositionX =
      x + this.x * CONTROL.SCALE - (master.me?.x || 0) * CONTROL.SCALE;
    const responsivePositionY =
      y + this.y * CONTROL.SCALE - (master.me?.y || 0) * CONTROL.SCALE;

    this.dropCtx.textAlign = "center";
    this.dropCtx.font = `bold ${16 * SIZE.SCALE() * 0.1}px sans-serif`;

    /* text outline */
    this.dropCtx.lineWidth = 3;
    this.dropCtx.strokeStyle =
      /* this.constructor.name === "Portal" ? "#00000000" : */ "#000000";
    this.dropCtx.strokeText(
      this.name.toUpperCase(),
      master.me?.id === this.id
        ? x + (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionX + (SIZE.UNIT() * SIZE.SCALE()) / 2,
      master.me?.id === this.id
        ? y - (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionY - (SIZE.UNIT() * SIZE.SCALE()) / 2
    );

    /* text */
    this.dropCtx.fillStyle =
      this.constructor.name === "NPC"
        ? this.color
        : // : this.constructor.name === "Portal"
          // ? COLOR.PORTAL + "00"
          COLOR.NAME;
    this.dropCtx.fillText(
      this.name.toUpperCase(),
      master.me?.id === this.id
        ? x + (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionX + (SIZE.UNIT() * SIZE.SCALE()) / 2,
      master.me?.id === this.id
        ? y - (SIZE.UNIT() * SIZE.SCALE()) / 2
        : responsivePositionY - (SIZE.UNIT() * SIZE.SCALE()) / 2
    );
    this.dropCtx.fillStyle = this.color;
    this.dropCtx.fillRect(
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

  onHello() {
    this.hello = true;
  }
  offHello() {
    this.hello = false;
  }

  onQuestion() {
    this.hello = true;
  }
  offQuestion() {
    this.hello = false;
  }
}

import Engine from "../core/Engine";
import { CAMERA, COLOR, CONTROL, ctx, master, SIZE } from "../util/global";
import ChatQueue from "./ChatQueue";
import UI from "./UI";
import Unit from "./Unit";

export default class NPC extends Unit {
  constructor(...args: any) {
    if (args.length === 1) {
      super(args[0]);
    } else {
      super(args[0], args[1]);
    }
    this.setColor(COLOR.NPC);
  }
  ui: UI;
  engine: Engine;
  hello: boolean = false;
  question: boolean = false;
  chatQueue: ChatQueue = new ChatQueue();

  nearBy: boolean = false;

  flag: "up" | "down" = "up";
  bound: number = 10;
  startBound: number = 0;
  eventList: {
    [key: string]: Function[];
  } = {};

  initUI(ui: UI) {
    this.ui = ui;
  }

  initEngine(engine: Engine) {
    this.engine = engine;
  }

  addEventListener(type: string, fn: Function) {
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
          this.eventList?.["nearBy"]?.forEach?.((fn) => fn(this.engine));
        }
        this.nearBy = true;
        this.onHello();
      } else {
        this.nearBy = false;
        this.offHello();
      }
    });
  }

  render(): void {
    const x = CAMERA.X();
    const y = CAMERA.Y();

    super.render();

    if (this.hello) {
      const size = this.startBound;
      const npcX = this.x * CONTROL.SCALE;
      const npcY = this.y * CONTROL.SCALE;
      const playerX = (master.me?.x || 0) * CONTROL.SCALE;
      const playerY = (master.me?.y || 0) * CONTROL.SCALE;
      const unitSize = (SIZE.UNIT() * SIZE.SCALE()) / 2;

      ctx.font = `bold ${36 * SIZE.SCALE() * 0.1}px sans-serif`;
      ctx.lineWidth = 5;
      ctx.strokeStyle = COLOR.WHITE;
      ctx.strokeText(
        "?",
        x + npcX - playerX + unitSize,
        -(SIZE.SCALE() * 2.5) + size + y + npcY - playerY - unitSize
      );
      ctx.fillStyle = COLOR.WARN;
      ctx.fillText(
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

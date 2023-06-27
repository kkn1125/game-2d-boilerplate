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
  hello: boolean = false;
  question: boolean = false;
  chatQueue: ChatQueue = new ChatQueue();

  nearBy: boolean = false;

  flag: "up" | "down" = "up";
  bound: number = 10;
  startBound: number = 0;

  initUI(ui: UI) {
    this.ui = ui;
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
      this.ui.openModal(this.id, this.name, message.message);
    } else {
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

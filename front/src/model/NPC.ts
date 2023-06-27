import { CAMERA, COLOR, ctx, master, SIZE } from "../util/global";
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
      const leftSide = this.x - unit * scale * 2;
      const rightSide = this.x + unit * scale * 2;
      const topSide = this.y - unit * scale * 2;
      const bottomSide = this.y + unit * scale * 2;
      if (
        leftSide < player.x &&
        player.x < rightSide &&
        topSide < player.y &&
        player.y < bottomSide
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

      ctx.font = `bold ${36 * SIZE.SCALE() * 0.1}px sans-serif`;
      ctx.fillStyle = COLOR.WARN;
      ctx.fillText(
        "?",
        x + this.x - (master.me?.x || 0) + (SIZE.UNIT() * SIZE.SCALE()) / 2,
        -(SIZE.SCALE() * 2.5) +
          size +
          y +
          this.y -
          (master.me?.y || 0) -
          (SIZE.UNIT() * SIZE.SCALE()) / 2
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

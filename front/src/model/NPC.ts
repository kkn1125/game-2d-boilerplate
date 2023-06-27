import { COLOR, ctx, master, SIZE, UNIT } from "../util/global";
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
    const message = this.chatQueue.talk(this.name);
    if (message) {
      this.ui.openModal(this.name, message.message);
    }
  }

  talkExit() {
    this.chatQueue.stop();
  }

  detectNearByPlayer() {
    master.units.forEach((player) => {
      const leftSide = this.x - SIZE.UNIT * SIZE.SCALE * 2;
      const rightSide = this.x + SIZE.UNIT * SIZE.SCALE * 2;
      const topSide = this.y - SIZE.UNIT * SIZE.SCALE * 2;
      const bottomSide = this.y + SIZE.UNIT * SIZE.SCALE * 2;
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
    const x = innerWidth / 2 - (SIZE.UNIT * SIZE.SCALE) / 2;
    const y = innerHeight / 2 + (SIZE.UNIT * SIZE.SCALE) / 2;

    super.render();

    if (this.hello) {
      ctx.font = "bold 36px sans-serif";
      ctx.fillStyle = COLOR.WARN;
      ctx.fillText(
        "?",
        x + this.x - (master.me?.x || 0) + (SIZE.UNIT * SIZE.SCALE) / 2,
        y + this.y - (master.me?.y || 0) - SIZE.UNIT * SIZE.SCALE - 10,
        2 * SIZE.SCALE
      );
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

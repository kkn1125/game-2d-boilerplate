import { canvas, JOYSTICK, master, UNIT } from "../util/global";

export default class EventListener {
  constructor() {
    window.addEventListener("load", this.handleResizeCanvas.bind(this));
    window.addEventListener("resize", this.handleResizeCanvas.bind(this));
    window.addEventListener("click", this.handleChatClick.bind(this));
    window.addEventListener("keydown", this.handleJoyStickDown.bind(this));
    window.addEventListener("keyup", this.handleJoyStickUp.bind(this));
  }

  handleJoyStickDown(e: KeyboardEvent) {
    const key = e.key as KeySet;
    if (JOYSTICK.hasOwnProperty(key)) {
      JOYSTICK[key] = true;
      if (master.me) {
        master.me.velocity = master.velocity;
      }
    }
  }

  handleJoyStickUp(e: KeyboardEvent) {
    const key = e.key as KeySet;
    if (JOYSTICK.hasOwnProperty(key)) {
      JOYSTICK[key] = false;
    }
    if (Object.values(JOYSTICK).every((_) => _ === false)) {
      if (master.me) {
        master.me.velocity = 0;
      }
    }
  }

  canvasSize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  handleResizeCanvas() {
    this.canvasSize();
  }

  handleChatClick(e: MouseEvent) {
    const target = e.target as HTMLButtonElement;
    const type = target.dataset.type;
    const npcName = target.dataset.npc;
    if (type === "talk" && npcName) {
      const npc = UNIT.NPC.get(npcName);
      if (npc) {
        npc.talk();
      }
    }
  }
}

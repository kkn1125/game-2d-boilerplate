import NPC from "../model/NPC";
import UI from "../model/UI";
import { canvas, JOYSTICK, master, UNIT } from "../util/global";
import RayPointer from "./RayPointer";

export default class EventListener {
  constructor() {
    window.addEventListener("load", this.handleResizeCanvas.bind(this));
    window.addEventListener("resize", this.handleResizeCanvas.bind(this));
    window.addEventListener("click", this.handleNpcClick.bind(this));
    window.addEventListener(
      "keydown",
      this.handleJoyStickDown.bind(this),
      false
    );
    window.addEventListener("keyup", this.handleJoyStickUp.bind(this));
  }

  ui: UI;
  rayPointer: RayPointer;

  initUI(ui: UI) {
    this.ui = ui;
  }

  initRayPointer(rayPointer: RayPointer) {
    this.rayPointer = rayPointer;
  }

  handleJoyStickDown(e: KeyboardEvent) {
    const key = e.key as KeySet;
    if ((key as OtherKeySet) === " ") {
      UNIT.NPC.forEach((npc) => {
        if (npc.nearBy && npc.chatQueue.temp.length === 0) {
          npc.talk();
          if (master.me) master.me.velocity = 0;
        }
      });
    }
    if (JOYSTICK.hasOwnProperty(key) && !UI.isOpenModal()) {
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

  handleNpcClick(e: MouseEvent) {
    // const target = e.target as HTMLButtonElement;
    // const type = target.dataset.type;
    // const npcNum = Number(target.dataset.npcNum);
    const npc = this.rayPointer.selector?.[0] as NPC;
    if (npc && npc.nearBy && npc.chatQueue.temp.length === 0) {
      npc.talk();
    }
  }
}

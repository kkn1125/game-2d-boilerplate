import NPC from "../model/NPC";
import { canvas, JOYSTICK, master, UNIT } from "../util/global";
import RayPointer from "./RayPointer";

export default class EventListener {
  constructor() {
    window.addEventListener("load", this.handleResizeCanvas.bind(this));
    window.addEventListener("resize", this.handleResizeCanvas.bind(this));
    window.addEventListener("click", this.handleNpcClick.bind(this));
    window.addEventListener("keydown", this.handleJoyStickDown.bind(this));
    window.addEventListener("keyup", this.handleJoyStickUp.bind(this));
  }

  rayPointer: RayPointer;

  initRayPointer(rayPointer: RayPointer) {
    this.rayPointer = rayPointer;
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

  handleNpcClick(e: MouseEvent) {
    // const target = e.target as HTMLButtonElement;
    // const type = target.dataset.type;
    // const npcNum = Number(target.dataset.npcNum);
    const npc = this.rayPointer.selector?.[0] as NPC;
    if (npc) {
      console.log(npc);
      npc.talk();
    }
  }
}

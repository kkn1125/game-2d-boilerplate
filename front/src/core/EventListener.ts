import NPC from "../model/NPC";
import UI from "../model/UI";
import { canvas, CONTROL, JOYSTICK, master, SIZE, UNIT } from "../util/global";
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
    window.addEventListener(
      "mousedown",
      this.handleJoyStickMouseDown.bind(this)
    );
    window.addEventListener("mouseup", this.handleJoyStickMouseUp.bind(this));
    window.addEventListener(
      "mousemove",
      this.handleJoyStickMouseMove.bind(this)
    );

    // window.addEventListener(
    //   "touchstart",
    //   this.handleJoyStickMouseDown.bind(this)
    // );
    // window.addEventListener("touchend", this.handleJoyStickMouseUp.bind(this));
    // window.addEventListener(
    //   "touchmove",
    //   this.handleJoyStickMouseMove.bind(this)
    // );
  }

  ui: UI;
  rayPointer: RayPointer;

  mobJoystick: {
    w: boolean;
    s: boolean;
    a: boolean;
    d: boolean;
    touch: boolean;
    ball: Element | null;
    boundary: Element | null;
    velocity: number;
  } = {
    w: false,
    s: false,
    a: false,
    d: false,
    touch: false,
    ball: null,
    boundary: null,
    velocity: 0,
  };

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
        } else if (npc.nearBy && npc.chatQueue.temp.length > 0) {
          npc.talk();
        }
      });
    }
    if ((key as OtherKeySet) === "Escape") {
      UNIT.NPC.forEach((npc) => {
        if (npc.nearBy && npc.chatQueue.temp.length > 0) {
          npc.talkExit();
        }
      });
    }
    if ((key as OtherKeySet) === "+") {
      if (CONTROL.SCALE + 1 > CONTROL.MAX_ZOOM) return;
      CONTROL.SCALE += 1;
    }
    if ((key as OtherKeySet) === "-") {
      if (CONTROL.SCALE - 1 < CONTROL.MIN_ZOOM) return;
      CONTROL.SCALE -= 1;
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

  handleJoyStickMouseDown(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    const ball = (target.closest("#ball") ||
      target.querySelector("#ball") ||
      target.parentElement?.querySelector("#ball")) as Element;
    const joystick = target.closest("#joystick") as Element;
    if (joystick) {
      this.mobJoystick.touch = true;
      this.mobJoystick.ball = ball;
      this.mobJoystick.boundary = joystick;
    }
  }

  handleJoyStickMouseUp(e: MouseEvent) {
    const ball = this.mobJoystick.ball as HTMLDivElement;
    if (ball) ball.style.transform = `translate(-50%, -50%)`;
    this.mobJoystick.touch = false;
    this.mobJoystick.ball = null;
    this.mobJoystick.boundary = null;
    if (master.me) {
      master.me.velocity = 0;
    }
    JOYSTICK["w"] = false;
    JOYSTICK["s"] = false;
    JOYSTICK["a"] = false;
    JOYSTICK["d"] = false;
  }

  handleJoyStickMouseMove(e: MouseEvent) {
    if (this.mobJoystick.touch) {
      const rect =
        this.mobJoystick.boundary?.getBoundingClientRect() as DOMRect;

      const joyCenterX = rect.width / 2;
      const joyCenterY = rect.height / 2;
      const joyLeft = rect.left;
      const joyTop = rect.top;
      // console.log(rect.width, this.mobJoystick.ball);

      const yJoy = joyCenterY + joyTop;
      const xJoy = joyCenterX + joyLeft;

      const x = e.clientX;
      const y = e.clientY;

      const axisX = x - xJoy;
      const axisY = y - yJoy;

      const isMinusX = axisX < 0 ? -1 : 1;
      const isMinusY = axisY < 0 ? -1 : 1;

      const r = rect.width / 2;

      let temp = 0;

      const getDist = (w: number, h: number) => Math.sqrt(w ** 2 + h ** 2);

      const middle = () => {
        const value = parseFloat((axisX / axisY).toFixed(2));
        const isUpper = Math.abs(value) > 0.5 && Math.abs(value) <= 2;
        return isUpper;
      };

      const isTop = () => {
        const value = parseFloat((axisX / axisY).toFixed(2));
        const isUpper = Math.abs(value) >= 0 && Math.abs(value) < 0.5;
        return isUpper && isMinusY < 0;
      };

      const isBottom = () => {
        const value = parseFloat((axisX / axisY).toFixed(2));
        const isUpper = Math.abs(value) >= 0 && Math.abs(value) < 0.5;
        return isUpper && isMinusY > 0;
      };

      const isLeft = () => {
        const value = parseFloat((axisX / axisY).toFixed(2));
        const isUpper = Math.abs(value) > 2;
        return isUpper && isMinusX < 0;
      };

      const isRight = () => {
        const value = parseFloat((axisX / axisY).toFixed(2));
        const isUpper = Math.abs(value) >= 2;
        return isUpper && isMinusX > 0;
      };

      JOYSTICK["w"] = false;
      JOYSTICK["s"] = false;
      JOYSTICK["a"] = false;
      JOYSTICK["d"] = false;

      if (middle() && isMinusX < 0 && isMinusY < 0) {
        console.log("left top");
        JOYSTICK["w"] = true;
        JOYSTICK["a"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (middle() && isMinusX > 0 && isMinusY < 0) {
        console.log("right top");
        JOYSTICK["w"] = true;
        JOYSTICK["d"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (middle() && isMinusX < 0 && isMinusY > 0) {
        console.log("left bottom");
        JOYSTICK["s"] = true;
        JOYSTICK["a"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (middle() && isMinusX > 0 && isMinusY > 0) {
        console.log("right bottom");
        JOYSTICK["s"] = true;
        JOYSTICK["d"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (isTop()) {
        console.log("top");
        JOYSTICK["w"] = true;
        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (isBottom()) {
        console.log("bottom");
        JOYSTICK["s"] = true;
        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (isLeft()) {
        console.log("left");
        JOYSTICK["a"] = true;
        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (isRight()) {
        console.log("right");
        JOYSTICK["d"] = true;
        if (master.me) {
          master.me.velocity = master.velocity;
        }
      }

      // console.log(axisX / axisY);
      (this.mobJoystick.ball as HTMLDivElement).style.transform = `translate(${
        axisX - 50
      }%,${axisY - 50}%)`;
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
    const npc = this.rayPointer.selector?.[0] as NPC;
    if (npc && npc.nearBy && npc.chatQueue.temp.length === 0) {
      npc.talk();
      if (master.me) master.me.velocity = 0;
    }
  }
}

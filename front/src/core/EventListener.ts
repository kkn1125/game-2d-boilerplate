import Effector from "../model/Effector";
import NPC from "../model/NPC";
import Portal from "../model/Portal";
import UI from "../model/UI";
import {
  canvas,
  CONTROL,
  JOYSTICK,
  bgCanvas,
  master,
  SIZE,
  UNIT,
  uiCanvas,
  dropCanvas,
  effectCanvas,
} from "../util/global";
import RayPointer from "./RayPointer";

let beforeX = 0;
let beforeY = 0;

export default class EventListener {
  constructor() {
    window.addEventListener("load", this.handleResizeCanvas.bind(this));
    window.addEventListener("resize", this.handleResizeCanvas.bind(this));
    window.addEventListener(
      "click",
      this.handleClickOtherInteractive.bind(this)
    );
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
    window.addEventListener(
      "touchstart",
      this.handleJoyStickTouchStart.bind(this)
    );
    window.addEventListener("mouseup", this.handleJoyStickMouseUp.bind(this));
    window.addEventListener("touchend", this.handleJoyStickTouchEnd.bind(this));
    window.addEventListener(
      "mousemove",
      this.handleJoyStickMouseMove.bind(this)
    );
    window.addEventListener(
      "touchmove",
      this.handleJoyStickTouchMove.bind(this)
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
  effectors: Effector[] = [];

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

  initEffectors(effectors: Effector[]) {
    this.effectors = [...effectors];
  }

  initRayPointer(rayPointer: RayPointer) {
    this.rayPointer = rayPointer;
  }

  handleClickOtherInteractive(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (target.id === "inventory-exit-btn") {
      this.ui.closeInventory();
    }

    if (
      target.classList.contains("cell") &&
      !target.classList.contains("lock")
    ) {
      document.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.remove("select");
      });
      target.classList.add("select");
    }
  }

  handleOpenInventory() {
    // this.ui.openInventory()
    this.ui.openInventory();
  }

  handleJoyStickDown(e: KeyboardEvent) {
    const key = e.key as KeySet;
    if (
      this.effectors.some(
        (effect) => effect.state === "start" && effect.isForce
      )
    ) {
      JOYSTICK["w"] = false;
      JOYSTICK["s"] = false;
      JOYSTICK["a"] = false;
      JOYSTICK["d"] = false;
      return;
    }

    if ((key as OtherKeySet) === " ") {
      const u = Array.from(UNIT.NPC.values()).find(
        (npc) => npc.nearBy && master.me?.locate === npc.locate
      );
      const p = Array.from(master.portals.values()).find(
        (portal) => portal.nearBy && master.me?.locate === portal.locate
      );
      const isTalkingU = Array.from(UNIT.NPC.values()).find(
        (npc) =>
          npc.nearBy &&
          master.me?.locate === npc.locate &&
          npc.chatQueue.temp.length > 0
      );
      const isTalkingP = Array.from(master.portals.values()).find(
        (portal) =>
          portal.nearBy &&
          master.me?.locate === portal.locate &&
          portal.chatQueue.temp.length > 0
      );
      if (isTalkingU && !isTalkingP) {
        isTalkingU.talk();
        return;
      } else if (!isTalkingU && isTalkingP) {
        isTalkingP.talk();
        return;
      }

      if (master.me && u) {
        let compare = null;
        for (let npc of UNIT.NPC.values()) {
          if (npc.nearBy && npc.locate === master.me.locate) {
            if (!compare) compare = npc;
            const npcXGap = Math.abs(master.me.x - npc.x);
            const npcYGap = Math.abs(master.me.y - npc.y);
            const compareXGap = Math.abs(master.me.x - compare.x);
            const compareYGap = Math.abs(master.me.y - compare.y);
            const dist = Math.sqrt(npcXGap ** 2 + npcYGap ** 2);
            const compareDist = Math.sqrt(compareXGap ** 2 + compareYGap ** 2);
            if (compareDist > dist) {
              compare = npc;
            }
          }
        }
        compare?.talk();
      }

      // let moreThanP = null;
      // const muX = Math.abs((master.me?.x || 0) - (u?.x || 0));
      // const muY = Math.abs((master.me?.y || 0) - (u?.y || 0));
      // const mpX = Math.abs((master.me?.x || 0) - (p?.x || 0));
      // const mpY = Math.abs((master.me?.y || 0) - (p?.y || 0));
      // const uDist = Math.sqrt(muX ** 2 + muY ** 2);
      // const pDist = Math.sqrt(mpX ** 2 + mpY ** 2);
      // moreThanP = uDist > pDist;

      // if (moreThanP === false) {
      //   UNIT.NPC.forEach((npc) => {
      //     if (
      //       master.me?.locate === npc.locate &&
      //       npc.nearBy &&
      //       npc.chatQueue.temp.length === 0
      //     ) {
      //       npc.talk();
      //       if (master.me) master.me.velocity = 0;
      //     } else if (
      //       master.me?.locate === npc.locate &&
      //       npc.nearBy &&
      //       npc.chatQueue.temp.length > 0
      //     ) {
      //       npc.talk();
      //     }
      //   });
      // } else if (moreThanP === true || moreThanP === null) {
      //   master.portals.forEach((portal) => {
      //     if (
      //       master.me?.locate === portal.locate &&
      //       portal.nearBy &&
      //       portal.chatQueue.temp.length === 0
      //     ) {
      //       portal.talk();
      //       if (master.me) master.me.velocity = 0;
      //     } else if (
      //       master.me?.locate === portal.locate &&
      //       portal.nearBy &&
      //       portal.chatQueue.temp.length > 0
      //     ) {
      //       portal.talk();
      //     }
      //   });
      // }
    }
    if ((key as OtherKeySet) === "i") {
      if (master.me) {
        if (!document.querySelector("#inventory")) {
          this.ui.openInventory();
          master.me.inventory.setOpen();
        } else {
          this.ui.closeInventory();
          master.me.inventory.setClose();
        }
      }
    }
    if ((key as OtherKeySet) === "Escape") {
      UNIT.NPC.forEach((npc) => {
        if (npc.nearBy && npc.chatQueue.temp.length > 0) {
          npc.talkExit();
        }
      });

      master.portals.forEach((portal) => {
        if (portal.nearBy && portal.chatQueue.temp.length > 0) {
          portal.talkExit();
        }
      });

      if (document.querySelector("#inventory")) {
        this.ui.closeInventory();
        master.me?.inventory.setClose();
      }
    }
    if ((key as OtherKeySet) === "+") {
      if (CONTROL.SCALE + CONTROL.ZOOM_RATIO > CONTROL.MAX_ZOOM) return;
      CONTROL.SCALE += CONTROL.ZOOM_RATIO;
    }
    if ((key as OtherKeySet) === "-") {
      if (CONTROL.SCALE - CONTROL.ZOOM_RATIO < CONTROL.MIN_ZOOM) return;
      CONTROL.SCALE -= CONTROL.ZOOM_RATIO;
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
  handleJoyStickTouchStart(e: TouchEvent) {
    // console.log(e);
    const target = e.target as HTMLDivElement;
    const ball = ((target.id === "ball" && target) ||
      target.closest("#ball") ||
      target.querySelector("#ball") ||
      target.parentElement?.querySelector("#ball")) as Element;
    const joystick =
      (target.closest("#joystick") as Element) ||
      (target.parentElement?.id === "joystick" && target.parentElement);
    if (joystick) {
      this.mobJoystick.touch = true;
      this.mobJoystick.ball = ball;
      this.mobJoystick.boundary = joystick;
    }
  }

  handleJoyStickMouseUp(e: MouseEvent) {
    const ball = this.mobJoystick.ball as HTMLDivElement;
    if (ball) ball.style.transform = `translate(-50%, -50%)`;

    if (this.mobJoystick.touch) {
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
  }

  handleJoyStickTouchEnd(e: TouchEvent) {
    const ball = this.mobJoystick.ball as HTMLDivElement;
    // console.log(ball, ball.style);
    if (ball) ball.style.transform = `translate(-50%, -50%)`;
    // console.log(ball);
    if (this.mobJoystick.touch) {
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

      // console.log("center point", xJoy, yJoy);
      // console.log("move point from center", axisX, axisY);

      const degX = parseInt(axisX.toString());
      const degY = parseInt(axisY.toString());
      const roundDist = 2 * Math.PI * 50;
      const dist = Math.sqrt(degX ** 2 + degY ** 2);
      const limitDist = 50;

      const bandingX = Math.sqrt(50 ** 2 - axisY ** 2);
      const bandingY = Math.sqrt(50 ** 2 - axisX ** 2);

      const radians = Math.atan2(degX, degY);

      const value = parseInt(((radians / Math.PI) * 10 * 18 + 180).toString());

      if (value < 60 && value > 30) {
        // left top
        // console.log("lt");
        JOYSTICK["w"] = true;
        JOYSTICK["a"] = true;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 30 || value > 330) {
        // top
        // console.log("t");
        JOYSTICK["w"] = true;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 330 && value > 300) {
        // right top
        // console.log("rt");
        JOYSTICK["w"] = true;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 300 && value > 240) {
        // right
        // console.log("r");
        JOYSTICK["w"] = false;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 240 && value > 210) {
        // right bottom
        // console.log("rb");
        JOYSTICK["w"] = false;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = true;
        JOYSTICK["d"] = true;
        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 210 && value > 150) {
        // bottom
        // console.log("b");
        JOYSTICK["w"] = false;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = true;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 150 && value > 120) {
        // left bottom
        // console.log("lb");
        JOYSTICK["w"] = false;
        JOYSTICK["s"] = true;
        JOYSTICK["a"] = true;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 120 && value > 60) {
        // left
        // console.log("l");
        JOYSTICK["w"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["a"] = true;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      }

      (
        this.mobJoystick.boundary as HTMLDivElement
      ).style.transform = `rotate(${-value}deg)`;
      (
        this.mobJoystick.ball as HTMLDivElement
      ).style.transform = `translate(-50%, ${
        -((dist > limitDist ? limitDist : dist) / 50) * 100 - 50
      }%)`;
    }
  }

  handleJoyStickTouchMove(t: TouchEvent) {
    if (
      this.effectors.some(
        (effect) => effect.state === "start" && effect.isForce
      )
    )
      return;

    const e = t.touches[0];

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

      // console.log("center point", xJoy, yJoy);
      // console.log("move point from center", axisX, axisY);

      const degX = parseInt(axisX.toString());
      const degY = parseInt(axisY.toString());
      const roundDist = 2 * Math.PI * 50;
      const dist = Math.sqrt(degX ** 2 + degY ** 2);
      const limitDist = 50;

      const bandingX = Math.sqrt(50 ** 2 - axisY ** 2);
      const bandingY = Math.sqrt(50 ** 2 - axisX ** 2);

      const radians = Math.atan2(degX, degY);

      const value = parseInt(((radians / Math.PI) * 10 * 18 + 180).toString());

      if (value < 60 && value > 30) {
        // left top
        // console.log("lt");
        JOYSTICK["w"] = true;
        JOYSTICK["a"] = true;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 30 || value > 330) {
        // top
        // console.log("t");
        JOYSTICK["w"] = true;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 330 && value > 300) {
        // right top
        // console.log("rt");
        JOYSTICK["w"] = true;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 300 && value > 240) {
        // right
        // console.log("r");
        JOYSTICK["w"] = false;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["d"] = true;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 240 && value > 210) {
        // right bottom
        // console.log("rb");
        JOYSTICK["w"] = false;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = true;
        JOYSTICK["d"] = true;
        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 210 && value > 150) {
        // bottom
        // console.log("b");
        JOYSTICK["w"] = false;
        JOYSTICK["a"] = false;
        JOYSTICK["s"] = true;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 150 && value > 120) {
        // left bottom
        // console.log("lb");
        JOYSTICK["w"] = false;
        JOYSTICK["s"] = true;
        JOYSTICK["a"] = true;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      } else if (value < 120 && value > 60) {
        // left
        // console.log("l");
        JOYSTICK["w"] = false;
        JOYSTICK["s"] = false;
        JOYSTICK["a"] = true;
        JOYSTICK["d"] = false;

        if (master.me) {
          master.me.velocity = master.velocity;
        }
      }

      (
        this.mobJoystick.boundary as HTMLDivElement
      ).style.transform = `rotate(${-value}deg)`;
      (
        this.mobJoystick.ball as HTMLDivElement
      ).style.transform = `translate(-50%, ${
        -((dist > limitDist ? limitDist : dist) / 50) * 100 - 50
      }%)`;
    }
  }

  canvasSize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    bgCanvas.width = innerWidth;
    bgCanvas.height = innerHeight;
    dropCanvas.width = innerWidth;
    dropCanvas.height = innerHeight;
    uiCanvas.width = innerWidth;
    uiCanvas.height = innerHeight;
    // effectCanvas.width = innerWidth;
    // effectCanvas.height = innerHeight;
  }

  handleResizeCanvas() {
    this.canvasSize();
    this.ui.showJoystick(!navigator.userAgent.match(/Win64/));
  }

  handleNpcClick(e: MouseEvent) {
    if (
      this.effectors.some(
        (effect) => effect.state === "start" && effect.isForce
      )
    )
      return;

    const npc = this.rayPointer.selector?.[0] as NPC;
    if (npc && npc.nearBy && npc.chatQueue.temp.length === 0) {
      npc.talk();
      if (master.me) master.me.velocity = 0;
    }
    const portal = this.rayPointer.pSelector?.[0] as Portal;
    if (portal && portal.nearBy && portal.chatQueue.temp.length === 0) {
      portal.talk();
      if (master.me) master.me.velocity = 0;
    }
  }
}

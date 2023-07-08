import Portal from "../model/Portal";
import Unit from "../model/Unit";
import { CAMERA, CONTROL, master, SIZE, UNIT } from "../util/global";

export default class RayPointer {
  constructor() {
    this.initPointer();
  }

  initPointer() {
    window.addEventListener("mousemove", this.handleDetectObject.bind(this));
  }

  selector: Unit[] = [];
  pSelector: Portal[] = [];

  handleDetectObject(e: MouseEvent) {
    if (!master.me) return;

    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    const x = e.clientX;
    const y = e.clientY;
    const playerViewX = -(master.me?.x || 0) * CONTROL.SCALE + CAMERA.X();
    /* -(master.me?.x || 0) +
      centerX -
      (SIZE.UNIT() * SIZE.SCALE()) / 2; */ /* innerWidth / 2; */
    const playerViewY = -(master.me?.y || 0) * CONTROL.SCALE + CAMERA.Y();
    /*  -(master.me?.y || 0) +
      centerY +
      (SIZE.UNIT() * SIZE.SCALE()) / 2; */ /* innerHeight / 2; */
    const blockSize = SIZE.BLOCK() * SIZE.SCALE();
    const unitSize = SIZE.UNIT() * SIZE.SCALE();

    /* 마우스 포인터 화면 및 맵 거리 기준 계산하여 NPC, Player 선택 때 사용 */
    const xPosition = x - playerViewX;
    const yPosition = y - playerViewY;

    /* index는 블록단위 오브젝트 선택할 떄 사용 예정 */
    const xIndex = Math.floor(xPosition / blockSize);
    const yIndex = Math.floor(yPosition / blockSize);

    // console.log(xIndex, yIndex);
    const npc = Array.from(UNIT.NPC.values()).find((npc) => {
      const npcX = npc.x;
      const npcY = npc.y;
      const inHorizontal = npcX <= xPosition && xPosition <= npcX + unitSize;
      const inVertical = npcY <= yPosition && yPosition <= npcY + unitSize;
      if (inHorizontal && inVertical && npc.nearBy) {
        return true;
      }
      return false;
    });
    const portal = Array.from(master.portals.values()).find((portal) => {
      const portalX = portal.x;
      const portalY = portal.y;
      const inHorizontal =
        portalX <= xPosition && xPosition <= portalX + unitSize;
      const inVertical =
        portalY <= yPosition && yPosition <= portalY + unitSize;
      if (inHorizontal && inVertical && portal.nearBy) {
        return true;
      }
      return false;
    });
    if (npc && !this.selector[0]) {
      this.selector[0] = npc;
    } else if (!npc) {
      this.selector = [];
    }
    if (portal && !this.pSelector[0]) {
      this.pSelector[0] = portal;
    } else if (!portal) {
      this.pSelector = [];
    }
  }
}

import Unit from "../model/Unit";
import { master, SIZE, UNIT } from "../util/global";

export default class RayPointer {
  constructor() {
    this.initPointer();
  }

  initPointer() {
    window.addEventListener("mousemove", this.handleDetectObject.bind(this));
  }

  selector: Unit[] = [];

  handleDetectObject(e: MouseEvent) {
    if (!master.me) return;

    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    const x = e.clientX;
    const y = e.clientY;

    const playerViewX =
      -(master.me?.x || 0) +
      centerX -
      (SIZE.UNIT * SIZE.SCALE) / 2; /* innerWidth / 2; */
    const playerViewY =
      -(master.me?.y || 0) +
      centerY +
      (SIZE.UNIT * SIZE.SCALE) / 2; /* innerHeight / 2; */
    const blockSize = SIZE.BLOCK * SIZE.SCALE;
    const unitSize = SIZE.UNIT * SIZE.SCALE;

    /* 마우스 포인터 화면 및 맵 거리 기준 계산하여 NPC, Player 선택 때 사용 */
    const xPosition = x - playerViewX;
    const yPosition = y - playerViewY;

    /* index는 블록단위 오브젝트 선택할 떄 사용 예정 */
    // const xIndex = Math.floor(xPosition / blockSize);
    // const yIndex = Math.floor(yPosition / blockSize);

    UNIT.NPC.forEach((npc) => {
      // console.log(npc);
      const npcX = npc.x;
      const npcY = npc.y;
      const inHorizontal = npcX <= xPosition && xPosition <= npcX + unitSize;
      const inVertical = npcY <= yPosition && yPosition <= npcY + unitSize;
      if (inHorizontal && inVertical) {
        // select npc
        if (npc.nearBy) {
          // console.log("do question");
          if (!this.selector[0]) {
            this.selector[0] = npc;
          }
        } else {
          this.selector = [];
        }
      } else {
        this.selector = [];
      }
    });
    // console.log(xIndex, yIndex);
  }
}

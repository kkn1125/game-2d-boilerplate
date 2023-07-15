import { CONTROL, master, SIZE } from "../util/global";
import NPC from "./NPC";

export default class Portal extends NPC {
  destination: string;

  constructor(name: string);
  constructor(id: number, name: string);
  constructor(a: string | number, b?: string) {
    if (b) {
      super(a, b);
    } else {
      super(a);
    }
  }

  detectNearByPlayer() {
    master.units.forEach((player) => {
      const unit = SIZE.UNIT();
      const scale = SIZE.SCALE();
      const boundary = unit * scale * 2;
      const npcX = this.x * CONTROL.SCALE;
      const npcY = this.y * CONTROL.SCALE;
      const playerX = player.x * CONTROL.SCALE;
      const playerY = player.y * CONTROL.SCALE;
      const leftSide = npcX - boundary;
      const rightSide = npcX + boundary;
      const topSide = npcY - boundary;
      const bottomSide = npcY + boundary;

      if (
        leftSide < playerX &&
        playerX < rightSide &&
        topSide < playerY &&
        playerY < bottomSide &&
        player.locate === this.locate
      ) {
        if (!this.nearBy) {
          this.eventList?.["nearby"]?.forEach?.((fn) => fn(this.engine));
        }
        this.nearBy = true;
        this.onHello();
      } else {
        this.nearBy = false;
        this.offHello();
      }
    });
  }

  setDestination(destination: string) {
    this.destination = destination;
  }

  destinationName() {
    return this.destination || this.name;
  }
}

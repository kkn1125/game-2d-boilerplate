import Building from "../model/Building";
import GameMap from "../model/GameMap";
import NPC from "../model/NPC";
import UI from "../model/UI";
import Unit from "../model/Unit";
import { COLOR, ctx, master, UNIT } from "../util/global";
import EventListener from "./EventListener";
import RayPointer from "./RayPointer";

export default class Engine {
  map: GameMap;
  eventListener: EventListener;
  ui: UI;
  rayPointer: RayPointer;
  activeGuideLine: boolean = false;

  constructor() {
    this.initUI();
    this.initRayPointer();
    this.initListener();
    this.initMap();
    this.render.call(this);
  }

  initListener() {
    this.eventListener = new EventListener();
    this.eventListener.initUI(this.ui);
    this.eventListener.initRayPointer(this.rayPointer);
  }

  initMap() {
    const map = new GameMap();
    this.map = map;
  }

  initUI() {
    const ui = new UI();
    this.ui = ui;
  }

  initRayPointer() {
    const rayPointer = new RayPointer();
    this.rayPointer = rayPointer;
  }

  addPlayer(...units: Unit[]) {
    for (let unit of units) {
      master.units.set(unit.id, unit);
    }
  }

  addNpc(...units: NPC[]) {
    for (let unit of units) {
      unit.initUI(this.ui);
      UNIT.NPC.set(unit.id, unit);
    }
  }

  addBuilding(...units: Building[]) {
    for (let unit of units) {
      UNIT.BUILDING.set(unit.id, unit);
    }
  }

  clearCanvas() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  render(time?: number) {
    this.clearCanvas();
    if (this.map) {
      this.map.render();
      this.map.drawMinimap(-200, -200, 0.1);
    }
    UNIT.BUILDING.forEach((building: Building) => {
      building.render();
      // console.log(building)
      building.detectNearByPlayer();
    });
    UNIT.NPC.forEach((npc: NPC) => {
      npc.render();
      // console.log(npc)
      npc.detectNearByPlayer();
    });
    master.units.forEach((unit) => {
      unit.render();
    });
    if (this.activeGuideLine) {
      this.guideLine();
    }
    requestAnimationFrame(this.render.bind(this));
  }

  guideLine() {
    /* vertical guide line */
    ctx.fillStyle = COLOR.BLACK + "56";
    ctx.fillRect(innerWidth / 2, 0, 1, innerHeight);
    /* horizontal guide line */
    ctx.fillStyle = COLOR.BLACK + "56";
    ctx.fillRect(0, innerHeight / 2, innerWidth, 1);
  }
}

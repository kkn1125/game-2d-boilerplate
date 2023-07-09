import Building from "../model/Building";
import Effector from "../model/Effector";
import GameMap from "../model/GameMap";
import NPC from "../model/NPC";
import Portal from "../model/Portal";
import UI from "../model/UI";
import Unit from "../model/Unit";
import PageOff from "../option/effect/PageOff";
import PageOn from "../option/effect/PageOn";
import { COLOR, ctx, master, UNIT } from "../util/global";
import EventListener from "./EventListener";
import RayPointer from "./RayPointer";

export default class Engine {
  map: GameMap;
  eventListener: EventListener;
  ui: UI;
  rayPointer: RayPointer;
  effectors: Effector[] = [];
  activeGuideLine: boolean = false;
  options: EngineOption;

  constructor(options: EngineOption) {
    this.options = options;
    this.initUI();
    this.initRayPointer();
    this.initEffectors();
    this.initListener();
    this.render.call(this);
  }

  initListener() {
    this.eventListener = new EventListener();
    this.eventListener.initUI(this.ui);
    this.eventListener.initEffectors(this.effectors);
    this.eventListener.initRayPointer(this.rayPointer);
  }

  initUI() {
    const ui = new UI();
    this.ui = ui;
  }

  initRayPointer() {
    const rayPointer = new RayPointer();
    this.rayPointer = rayPointer;
  }

  initEffectors() {
    this.effectors.push(PageOff, PageOn);
  }

  changeMap(map: GameMap) {
    this.map = map;
  }

  addPortal(...portals: Portal[]) {
    for (let unit of portals) {
      unit.initUI(this.ui);
      unit.initEngine(this);
      master.portals.set(unit.id, unit);
    }
  }

  addPlayer(...units: Unit[]) {
    for (let unit of units) {
      master.units.set(unit.id, unit);
    }
  }

  addNpc(...units: NPC[]) {
    for (let unit of units) {
      unit.initUI(this.ui);
      unit.initEngine(this);
      UNIT.NPC.set(unit.id, unit);
    }
  }

  addBuilding(...units: Building[]) {
    for (let unit of units) {
      UNIT.BUILDING.set(unit.id, unit);
      unit.initEngine(this);
    }
  }

  clearCanvas() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  render(time?: number) {
    this.clearCanvas();
    if (this.map) {
      this.map.clear();
      this.map.render();
      // this.map.collision();
    }
    this.options.render.portal &&
      master.portals.forEach((portal: Portal) => {
        if (portal.locate === this.map.name) {
          this.options.render.shadow && portal.renderShadow();
          portal.render();
          portal.detectNearByPlayer();
        }
      });
    this.options.render.building &&
      UNIT.BUILDING.forEach((building: Building) => {
        if (building.locate === this.map.name) {
          // this.options.render.shadow && building.renderShadow();
          building.render();
          building.detectNearByPlayer();
        }
      });
    this.options.render.npc &&
      UNIT.NPC.forEach((npc: NPC) => {
        // console.log(this.map.name)
        if (npc.locate === this.map.name) {
          this.options.render.shadow && npc.renderShadow();
          npc.render();
          npc.detectNearByPlayer();
        }
      });
    this.options.render.player &&
      master.units.forEach((unit) => {
        this.options.render.shadow && unit.renderShadow();
        unit.render();
      });
    if (this.options.active.guideLine) {
      this.guideLine();
    }
    // if (master.me) {
    //   master.me.renderMoney();
    // }
    if (this.map) {
      const scale =
        innerWidth < 376
          ? 0.05
          : 376 < innerWidth && innerWidth < 568
          ? 0.06
          : 0.1;
      this.map.drawMinimap(-200, -200, scale, this.options.render);
      this.map.drawMoney();
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

import Building from "../model/Building";
import Effector from "../model/Effector";
import GameMap from "../model/GameMap";
import Item from "../model/Item";
import NPC from "../model/NPC";
import Portal from "../model/Portal";
import UI from "../model/UI";
import Unit from "../model/Unit";
import PageOff from "../option/effect/PageOff";
import PageOn from "../option/effect/PageOn";
import {
  COLOR,
  CONTROL,
  ctx,
  dev,
  dropCanvas,
  MAP_PADDING,
  master,
  SIZE,
  UNIT,
} from "../util/global";
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

  dropList: Item[] = [];
  dropCtx = dropCanvas.getContext("2d");

  constructor(options: EngineOption) {
    /* Engine Options display */
    dev.alias("Engine Options").log(
      `\n${JSON.stringify(options, null, 2)
        .replace(/{|}|,|"/g, "")
        .replace(/\n+/g, "\n")
        .replace(/true|false/g, ($1) => ($1 === "true" ? "ON" : "OFF"))}\n`
    );

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
      unit.initUI(this.ui);
      unit.initEngine(this);
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
      this.map.render(this.options.active.guideLine);
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

    /* drop item render */
    this.dropCtx?.clearRect(0, 0, innerWidth, innerHeight);
    if (this.dropList.length > 0) {
      this.dropList.forEach((item) => {
        if (master.me && item && item.locate === master.me.locate)
          item.render();
      });
    }
    requestAnimationFrame(this.render.bind(this));
  }

  guideLine() {
    /* vertical guide line */
    ctx.font = `bold ${16}px monospace`; // font fixed
    ctx.fillStyle = COLOR.BLACK + "a6";
    ctx.fillRect(innerWidth / 2, 0, 1, innerHeight);
    /* horizontal guide line */
    ctx.fillRect(0, innerHeight / 2, innerWidth, 1);

    ctx.textAlign = "left";
    const getPositionValue = (value: number = 0) =>
      value /* + (SIZE.BLOCK() * SIZE.SCALE()) / 2 */ /
        (SIZE.BLOCK() * CONTROL.STATIC_SCALE) -
      MAP_PADDING;
    const xValue = getPositionValue(master.me?.x);
    const yValue = getPositionValue(master.me?.y);
    ctx.fillStyle = COLOR.BLACK + "96";
    ctx.fillText(
      String(`x:${xValue.toFixed(2)}, y:${yValue.toFixed(2)}`),
      innerWidth / 2 + 5,
      innerHeight / 2 + 21
    );
  }
}

import GameMap from "../model/GameMap";
import Unit from "../model/Unit";
import { ctx, master } from "../util/global";
import EventListener from "./EventListener";

export default class Engine {
  map: GameMap;
  eventListener: EventListener;

  constructor() {
    this.initListener();
    this.initMap();
    this.render.call(this);
  }

  insertUnits(...units: Unit[]) {
    for (let unit of units) {
      master.units.set(unit.id, unit);
    }
  }

  initListener() {
    this.eventListener = new EventListener();
  }
  initMap() {
    const map = new GameMap();
    this.map = map;
  }

  clearCanvas() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  render(time?: number) {
    this.clearCanvas();
    if (this.map) {
      this.map.render();
    }
    master.units.forEach((unit) => {
      unit.render();
    });
    requestAnimationFrame(this.render.bind(this));
  }
}

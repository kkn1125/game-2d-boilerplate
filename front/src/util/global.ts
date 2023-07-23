import DEFAULT_NPC_IMG from "/images/default_npc.png";
import GRASS from "/images/grass-1.png";
import GRASS2 from "/images/grass-2.png";
import GRASS3 from "/images/grass-3.png";
import GRASS4 from "/images/grass-4.png";
import ROAD from "/images/road.png";
import TREE from "/images/tree.png";
import ROCK from "/images/rock-1.png";
import ROCK2 from "/images/rock2.png";
import WATER from "/images/water.png";
import BUSH from "/images/bush.png";
import DEFAULT_AVATAR from "/images/character-r.png";

import NPC from "../model/NPC";
import Unit from "../model/Unit";
import User from "../model/User";
import Building from "../model/Building";
import Portal from "../model/Portal";

export enum COLOR {
  BLACK = "#000000", // block
  WHITE = "#ffffff", // white
  WARN = "#ff0000", // warn
  BLOCK = "#555555", // block
  ROAD = "#cccccc", // road
  ITEM = "#00ff00", // unit
  UNIT = "#ffff00", // unit
  NPC = "#bc0fab", // unit
  NAME = "#ffffff", // unit
  BUILDING_NAME = "#ffffff", // unit
  BUILDING = "#45fcab", // unit
  PORTAL = "#12acc6", // unit
  DEVIAN = "#0ff0ff", // unit
  MOMO = "#9a2fa0", // unit
  KIMSON = "#a6ef0a", // unit
  DAVID = "#6bacba", // unit
  MING = "#cc3672", // unit
}

export const CONTROL = {
  BLOCK: 1,
  UNIT: 1,
  SCALE: 1,
  MAX_ZOOM: 2,
  MIN_ZOOM: 1,
  ZOOM_RATIO: 0.5,
  STATIC_SCALE: 15,
};

// window.CONTROL = CONTROL;

export const SIZE = {
  BLOCK: () => 5,
  UNIT: () => 3,
  SCALE: () => CONTROL.STATIC_SCALE * CONTROL.SCALE,
  INVENTORY: {
    X: 5,
    Y: 7,
  },
};
export const CAMERA = {
  X: () => innerWidth / 2 - (SIZE.UNIT() * SIZE.SCALE()) / 2,
  Y: () => innerHeight / 2 - (SIZE.UNIT() * SIZE.SCALE()) / 2,
};

export const master: {
  me: User | null;
  units: Map<number, Unit>;
  portals: Map<number, Portal>;
  velocity: number;
} = {
  me: null,
  units: new Map<number, Unit>(),
  portals: new Map<number, Portal>(),
  velocity: 30 * (SIZE.SCALE() / 100),
};
export const JOYSTICK = {
  w: false,
  s: false,
  a: false,
  d: false,
};
export const players = new Map<number, User>();
export const UNIT = {
  NPC: new Map<number, NPC>(),
  BUILDING: new Map<number, Building>(),
};
export const DROP_LOCK_TIME = 2000;

export const APP = () => document.getElementById("app") as HTMLDivElement;
export const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.id = "game-layer";
export const bgCanvas = document.createElement("canvas") as HTMLCanvasElement;
bgCanvas.id = "bg-layer";
export const dropCanvas = document.createElement("canvas") as HTMLCanvasElement;
dropCanvas.id = "drop-layer";
export const uiCanvas = document.createElement("canvas") as HTMLCanvasElement;
uiCanvas.id = "ui-layer";
export const effectCanvas = document.createElement(
  "canvas"
) as HTMLCanvasElement;
effectCanvas.id = "effect-layer";

export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

APP().append(bgCanvas, canvas, dropCanvas, uiCanvas, effectCanvas);

export enum FIELD_VALUE {
  block = 0,
  road = 1,
  grass = 2,
  grass2 = "b",
  grass3 = "c",
  grass4 = "d",
  water = 3,
  tree = 4,
  flower = 5,
  wall = 6,
  bush = 7,
  rock = 8,
  rock2 = 9,
  dummy = 10,
}

const createImage = (url: string) => {
  const img = new Image();
  img.src = url;
  return img;
};

export const TEXTURE = {
  [Number(FIELD_VALUE["block"])]: createImage(GRASS),
  [Number(FIELD_VALUE["grass"])]: createImage(GRASS),
  [FIELD_VALUE["grass2"]]: createImage(GRASS2),
  [FIELD_VALUE["grass3"]]: createImage(GRASS3),
  [FIELD_VALUE["grass4"]]: createImage(GRASS4),
  [Number(FIELD_VALUE["road"])]: createImage(ROAD),
  [Number(FIELD_VALUE["rock"])]: createImage(ROCK),
  [Number(FIELD_VALUE["rock2"])]: createImage(ROCK2),
  [Number(FIELD_VALUE["water"])]: createImage(WATER),
  [Number(FIELD_VALUE["bush"])]: createImage(BUSH),
  [Number(FIELD_VALUE["tree"])]: createImage(TREE),
};

export { DEFAULT_NPC_IMG };

export const MAP_PADDING = 6;

export const dev = function () {};

dev.temp = "";

dev.log = ((...data: any[]) => {
  const name = `[${dev.temp || "SYSTEM"}]`;
  const timestamp = new Date().toLocaleTimeString("en");
  console.log(`%c${name}`, "color:yellow", ...data, timestamp);
  dev.temp = "";
}).bind(console.log);

dev.alias = (alias: string) => {
  dev.temp = alias.toUpperCase();
  return dev;
};

const AVATAR: { [k: string]: CanvasImageSource } = {
  default: createImage(DEFAULT_AVATAR),
};

export const PICK_AVATAR = (type: any) => AVATAR[type];

import DEFAULT_NPC_IMG from "/images/default_npc.png";
import GRASS from "/images/grass.png";
import ROAD from "/images/road.png";
import TREE from "/images/tree.png";
import ROCK from "/images/rock.png";
import ROCK2 from "/images/rock2.png";
import WATER from "/images/water.png";
import BUSH from "/images/bush.png";

import NPC from "../model/NPC";
import Unit from "../model/Unit";
import User from "../model/User";
import Building from "../model/Building";

export enum COLOR {
  WARN = "#ff0000", // warn
  BLACK = "#000000", // block
  BLOCK = "#555555", // block
  ROAD = "#cccccc", // road
  UNIT = "#ffff00", // unit
  NPC = "#bc0fab", // unit
  NAME = "#ffffff", // unit
  BUILDING_NAME = "#ffffff", // unit
  BUILDING = "#45fcab", // unit
  DEVIAN = "#0ff0ff", // unit
  MOMO = "#9a2fa0", // unit
  KIMSON = "#a6ef0a", // unit
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
};
export const CAMERA = {
  X: () => innerWidth / 2 - (SIZE.UNIT() * SIZE.SCALE()) / 2,
  Y: () => innerHeight / 2 - (SIZE.UNIT() * SIZE.SCALE()) / 2,
};

export const master: {
  me: User | null;
  units: Map<number, Unit>;
  velocity: number;
} = {
  me: null,
  units: new Map<number, Unit>(),
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

export const APP = () => document.getElementById("app") as HTMLDivElement;
export const canvas = document.createElement("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

APP().append(canvas);

export enum FIELD_VALUE {
  block = 0,
  road = 1,
  grass = 2,
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
  [Number(FIELD_VALUE["grass"])]: createImage(GRASS),
  [Number(FIELD_VALUE["road"])]: createImage(ROAD),
  [Number(FIELD_VALUE["rock"])]: createImage(ROCK),
  [Number(FIELD_VALUE["rock2"])]: createImage(ROCK2),
  [Number(FIELD_VALUE["water"])]: createImage(WATER),
  [Number(FIELD_VALUE["bush"])]: createImage(BUSH),
  [Number(FIELD_VALUE["tree"])]: createImage(TREE),
};

export { DEFAULT_NPC_IMG };

export const MAP_PADDING = 6;

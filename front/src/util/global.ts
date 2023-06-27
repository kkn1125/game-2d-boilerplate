import DEFAULT_NPC_IMG from "/images/default_npc.png";
import GRASS from "/images/grass.png";
import ROAD from "/images/road.png";

import NPC from "../model/NPC";
import Unit from "../model/Unit";
import User from "../model/User";

export enum COLOR {
  WARN = "#ff0000", // warn
  BLACK = "#000000", // block
  BLOCK = "#555555", // block
  ROAD = "#cccccc", // road
  UNIT = "#ffff00", // unit
  NPC = "#ff0ff0", // unit
  NAME = "#ff0fff", // unit
}

export const CONTROL = {
  BLOCK: 1,
  UNIT: 1,
  SCALE: 1,
  MAX_ZOOM: 2,
  MIN_ZOOM: 1,
};

// window.CONTROL = CONTROL;

export const SIZE = {
  BLOCK: () => 5,
  UNIT: () => 3,
  SCALE: () => 10 * CONTROL.SCALE,
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
  dummy = 7,
}

const createImage = (url: string) => {
  const img = new Image();
  img.src = url;
  return img;
};

export const TEXTURE = {
  [Number(FIELD_VALUE["grass"])]: createImage(GRASS),
  [Number(FIELD_VALUE["road"])]: createImage(ROAD),
};

export { DEFAULT_NPC_IMG };

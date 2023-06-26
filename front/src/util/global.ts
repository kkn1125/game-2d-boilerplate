import NPC from "../model/NPC";
import Unit from "../model/Unit";
import User from "../model/User";

export enum COLOR {
  WARN = "#ff0000", // warn
  BLOCK = "#555555", // block
  ROAD = "#cccccc", // road
  UNIT = "#ffff00", // unit
  NPC = "#ff0ff0", // unit
  NAME = "#ff0fff", // unit
}
export const master: {
  me: User | null;
  units: Map<number, Unit>;
  velocity: number;
} = {
  me: null,
  units: new Map<number, Unit>(),
  velocity: 3,
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

export const SIZE = {
  BLOCK: 5,
  UNIT: 3,
  SCALE: 10,
};

export const APP = () => document.getElementById("app") as HTMLDivElement;
export const canvas = document.createElement("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

APP().append(canvas);

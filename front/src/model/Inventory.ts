import NoneItem from "../option/item/NoneItem";
import { SIZE } from "../util/global";
import Item from "./Item";

export default class Inventory {
  bag: Item[][] = new Array(SIZE.INVENTORY.Y)
    .fill(0)
    .map((row) => new Array(SIZE.INVENTORY.X).fill(0).map((cell) => NoneItem));

  lockCount: number = 5;
}

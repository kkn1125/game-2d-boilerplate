import NoneItem from "../option/item/NoneItem";
import { SIZE } from "../util/global";
import Item from "./Item";

export default class Inventory {
  isOpen: boolean = false;

  bag: (Item | null)[][] = new Array(SIZE.INVENTORY.Y)
    .fill(0)
    .map((row) => new Array(SIZE.INVENTORY.X).fill(0).map((cell) => null));

  lockCount: number = 5;

  addBag(newItem: Item) {
    for (let row of this.bag) {
      for (let column of row) {
        if (column === null) {
          column = newItem;
          return true;
        }
      }
    }
    return false;
  }

  setOpen() {
    this.isOpen = true;
  }

  setClose() {
    this.isOpen = false;
  }
}

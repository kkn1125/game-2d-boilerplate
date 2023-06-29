export default class Item {
  static idnumber = 0;
  id: number = 0;
  name: string = "";
  price: number = 0;
  str: number = 0;
  dex: number = 0;
  int: number = 0;
  luck: number = 0;

  wearPlace: string = "hat";

  currentDurablility: number = 0;
  maxDurability: number = 10;

  enforce: number = 0;
  maxEnforce: number = 5;

  slot: Item[] = [];

  /* 인첸트 개발 중 */
  enchantment = null;

  getName() {
    return `+${this.enforce} ${this.name}`;
  }
}

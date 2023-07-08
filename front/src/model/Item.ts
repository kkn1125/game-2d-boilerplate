type ItemArguments = {
  [key in keyof Item]?: any;
};

export default class Item {
  static idnumber = 0;

  id: number = 0;
  name: string = "";
  price: number = 0;
  str: number = 0;
  dex: number = 0;
  int: number = 0;
  luck: number = 0;

  type: ItemType = "none";

  wearPlace: ItemWearPlaceType = "none";

  currentDurablility: number = 0;
  maxDurability: number = 10;

  enforce: number = 0;
  maxEnforce: number = 5;

  slot: Item[] = [];

  /* 인첸트 개발 중 */
  enchantment = null;

  constructor(options: ItemArguments) {
    Object.entries(options).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }

  getName() {
    return `+${this.enforce} ${this.name}`;
  }
}

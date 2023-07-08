import NPC from "./NPC";

export default class Portal extends NPC {
  constructor(name: string);
  constructor(id: number, name: string);
  constructor(a: string | number, b?: string) {
    if (b) {
      super(a, b);
    } else {
      super(a);
    }
  }
}

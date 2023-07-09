import NPC from "./NPC";

export default class Portal extends NPC {
  destination: string;

  constructor(name: string);
  constructor(id: number, name: string);
  constructor(a: string | number, b?: string) {
    if (b) {
      super(a, b);
    } else {
      super(a);
    }
  }

  setDestination(destination: string) {
    this.destination = destination;
  }

  destinationName() {
    return this.destination || this.name;
  }
}

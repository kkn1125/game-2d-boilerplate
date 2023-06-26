import { COLOR } from "../util/global";
import ChatQueue from "./ChatQueue";
import Unit from "./Unit";

export default class NPC extends Unit {
  constructor(...args: any) {
    if (args.length === 1) {
      super(args[0]);
    } else {
      super(args[0], args[1]);
    }
    this.setColor(COLOR.NPC)
  }
  chatQueue: ChatQueue = new ChatQueue();

  addStaticMessage(message: string) {
    this.chatQueue.addMessage(message, false);
  }
  addAutoMessage(message: string) {
    this.chatQueue.addMessage(message, true);
  }

  talk() {
    this.chatQueue.talk(this.name);
  }

  talkExit() {
    this.chatQueue.stop();
  }
}

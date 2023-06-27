import Message from "./Message";

export default class ChatQueue {
  static id: number = 0;
  chattings: Message[] = [];
  temp: Message[] = [];

  addMessage(message: string, autoClose: boolean) {
    const msg = new Message(ChatQueue.id, message, autoClose);
    this.chattings.push(msg);
  }

  isAutoClose(message: Message) {
    return message.autoClose;
  }

  talk(cb: Function) {
    const message = this.chattings.shift();
    if (message) {
      message.setOpen(cb);
      this.temp.push(message);
      // console.log(`${nickname}: ${message.message}`);
      return message;
    } else {
      this.chattings.push(...this.temp.splice(0));
      // console.log(`${nickname}: ${"bye"}`);
      return null;
    }
  }

  stop() {
    this.chattings = this.temp.splice(0).concat(...this.chattings);
    this.chattings.forEach((message) => message.setClose());
  }
}

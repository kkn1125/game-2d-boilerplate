export default class Message {
  id: number;
  message: string;
  autoClose: boolean;
  open: boolean = false;

  constructor(id: number, message: string, autoClose: boolean = true) {
    this.id = id;
    this.message = message;
    this.autoClose = autoClose;
  }

  setOpen(cb: Function) {
    this.open = true;

    if (this.autoClose) {
      this.intervalClose(cb);
    }
  }

  setClose() {
    this.open = false;
  }

  intervalClose(cb: Function) {
    let flag = setTimeout(() => {
      this.setClose();
      cb(true);
    }, 5000);
  }
}

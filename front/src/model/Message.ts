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

  setOpen() {
    this.open = true;
    if (this.autoClose) {
      return this.intervalClose();
    }
  }

  setClose() {
    this.open = false;
  }

  intervalClose() {
    let resolver: (value: unknown) => void = () => {};

    let flag = setTimeout(() => {
      if (!this.open) {
        clearTimeout(flag);
        resolver(false);
      }
      this.setClose();
      resolver(true);
    }, 5000);
    return new Promise((resolve) => (resolver = resolve));
  }
}

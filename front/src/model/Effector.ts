import { effectCanvas } from "../util/global";

export default class Effector {
  effectCanvas: HTMLCanvasElement = document.createElement("canvas");
  effectCtx: CanvasRenderingContext2D;

  effect: Function;
  word: string;
  beforeNum: number = 0;
  speed: number = 1;
  isForce = true;
  count: number = 0;
  limit: number = 255;
  delay: number = 0;
  afterWait: number = 0;

  state: "stop" | "start";

  resolver: (value: any) => void;

  constructor(isForce: boolean = false) {
    this.isForce = isForce;
  }

  setWord(word: string) {
    this.word = word;
    return this;
  }

  setSpeed(speed: number) {
    this.speed = speed;
    return this;
  }

  setDelay(delay: number) {
    this.delay = delay;
    return this;
  }

  setEffect(effector: Function) {
    this.effect = effector;
    return this;
  }

  setAfterWait(time: number) {
    this.afterWait = time;
    return this;
  }

  animate(time: number) {
    if (this.count > this.limit) {
      if (this.afterWait === 0) {
        this.resolver(true);
        this.reset();
      } else {
        setTimeout(() => {
          this.resolver(true);
          this.reset();
        }, this.afterWait * 1000);
      }
      return;
    }
    this.effectCtx.clearRect(0, 0, innerWidth, innerHeight);
    this.effect.call(this, this.count, this.word);
    this.count += this.speed;
    this.beforeNum = time;

    requestAnimationFrame(this.animate.bind(this));
  }

  handleResize() {
    this.effectCanvas.width = innerWidth;
    this.effectCanvas.height = innerHeight;
  }

  render() {
    this.handleResize();
    const ctx = this.effectCanvas.getContext("2d") as CanvasRenderingContext2D;
    document.body.append(this.effectCanvas);
    this.effectCtx = ctx;
    window.addEventListener("resize", this.handleResize.bind(this));

    if (this.delay) {
      setTimeout(() => {
        this.state = "start";
        requestAnimationFrame(this.animate.bind(this));
      }, this.delay * 1000);
    } else {
      this.state = "start";
      requestAnimationFrame(this.animate.bind(this));
    }
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  reset() {
    this.beforeNum = 0;
    this.count = 0;
    this.state = "stop";
    setTimeout(() => {
      this.effectCanvas.remove();
      window.removeEventListener("resize", this.handleResize.bind(this));
    }, 100);
  }
}

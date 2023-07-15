export default class Effector {
  effectCanvas: HTMLCanvasElement;
  effectCtx: CanvasRenderingContext2D;

  start: number = 0;
  end: number = 100;

  temp: number = 0;
  animate: number | null = null;
  effect: Function;
  resolver: (value: unknown) => void;
  isForce: boolean;
  word: string;

  constructor(force: boolean = false) {
    this.isForce = force;
  }

  setWord(word: string) {
    this.word = word;
    return this;
  }

  setEffect(effect: Function) {
    this.effect = effect;
  }

  animation(delay: number, time = 0) {
    this.animate = requestAnimationFrame(this.animation.bind(this, delay));
    const count = Math.floor(time / 1000);

    // if (this.temp !== count) {
    // }
    this.effect?.(this.start * delay, this.word);
    if (this.start >= this.end) {
      this.effect?.(false);
      this.resolver(true);
      cancelAnimationFrame(this.animate);
      return;
    }

    this.start += delay;

    this.temp = count;
  }

  render(delay = 1) {
    this.effectCanvas = document.createElement("canvas");
    this.effectCtx = this.effectCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    document.body.append(this.effectCanvas);
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));

    this.animate = requestAnimationFrame(this.animation.bind(this, delay));

    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  handleResize() {
    this.effectCanvas.width = innerWidth;
    this.effectCanvas.height = innerHeight;
  }

  reset() {
    // this.effectCtx.clearRect(0, 0, innerWidth, innerHeight);
    this.start = 0;
    this.temp = 0;
    this.animate = null;
    setTimeout(() => {
      window.removeEventListener("resize", this.handleResize.bind(this));
      this.effectCanvas.remove();
    }, 100);
  }
}

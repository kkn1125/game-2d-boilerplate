import { effectCanvas } from "../util/global";

export default class Effector {
  effectCanvas: HTMLCanvasElement = effectCanvas;
  effectCtx: CanvasRenderingContext2D = this.effectCanvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  start: number = 0;
  end: number = 100;

  temp: number = 0;
  animate: number | null = null;
  effect: Function;
  resolver: (value: unknown) => void;
  isForce: boolean;

  constructor(force: boolean = false) {
    this.isForce = force;
  }

  setEffect(effect: Function) {
    this.effect = effect;
  }

  animation(delay: number, time = 0) {
    this.animate = requestAnimationFrame(this.animation.bind(this, delay));
    const count = Math.floor(time / 1000);

    // if (this.temp !== count) {
    // }
    this.effect?.(this.start * delay);
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
    this.animate = requestAnimationFrame(this.animation.bind(this, delay));

    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  reset() {
    this.start = 0;
    this.temp = 0;
    this.animate = null;
  }
}

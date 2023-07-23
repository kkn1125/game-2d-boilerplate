import Effector from "../../model/Effector";

const PageOff = new Effector(true);

PageOff.setSpeed(10)
  .setEffect(function (this: Effector, time: number) {
    const hex = Math.floor(time).toString(16).padStart(2, "0");
    this.effectCtx.fillStyle = `#000000${hex}`;
    this.effectCtx.fillRect(0, 0, innerWidth, innerHeight);
  })
  .setAfterWait(0.5);

export default PageOff;

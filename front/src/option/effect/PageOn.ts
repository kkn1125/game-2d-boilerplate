import Effector from "../../model/Effector";

const PageOn = new Effector(true);

PageOn.setSpeed(10).setEffect(function (this: Effector, time: number) {
  const hex = (255 - Math.floor(time)).toString(16).padStart(2, "0");
  this.effectCtx.fillStyle = `#000000${hex}`;
  this.effectCtx.fillRect(0, 0, innerWidth, innerHeight);
});

export default PageOn;

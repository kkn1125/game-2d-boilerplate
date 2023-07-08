import Effector from "../../model/Effector";

const PageOn = new Effector();
PageOn.setEffect((process: number | false) => {
  if (process !== false) {
    const toHex = 255 - Math.floor((process * 255) / 100);
    PageOn.effectCtx.clearRect(0, 0, innerWidth, innerHeight);
    PageOn.effectCtx.fillStyle = `#000000${toHex
      .toString(16)
      .padStart(2, "0")}`;
    PageOn.effectCtx.fillRect(0, 0, innerWidth, innerHeight);
  }
});

export default PageOn;

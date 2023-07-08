import Effector from "../../model/Effector";

const PageOff = new Effector();
PageOff.setEffect((process: number | false) => {
  if (process !== false) {
    const toHex = Math.floor((process * 255) / 100);
    PageOff.effectCtx.clearRect(0, 0, innerWidth, innerHeight);
    PageOff.effectCtx.fillStyle = `#000000${toHex
      .toString(16)
      .padStart(2, "0")}`;

    PageOff.effectCtx.fillRect(0, 0, innerWidth, innerHeight);
  }
});

export default PageOff;

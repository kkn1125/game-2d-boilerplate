import Effector from "../../model/Effector";
import { CAMERA, SIZE } from "../../util/global";

const WordFloat = new Effector(false);

WordFloat.setSpeed(2)
  .setEffect(function (this: Effector, time: number, word: string) {
    this.effectCtx.textAlign = "center";
    this.effectCtx.font = `bold ${Math.floor(innerWidth / 2) * 0.07}px monospace`;

    this.effectCtx.fillStyle = `#ffffff`;
    this.effectCtx.fillText(
      word.toUpperCase(),
      innerWidth / 2,
      innerHeight / 2
    );

    this.effectCtx.lineWidth = 2;
    this.effectCtx.strokeStyle = `#000000`;
    this.effectCtx.strokeText(
      word.toUpperCase(),
      innerWidth / 2,
      innerHeight / 2
    );
  })
  .setAfterWait(1);

export default WordFloat;

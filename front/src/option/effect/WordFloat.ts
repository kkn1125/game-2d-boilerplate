import Effector from "../../model/Effector";
import { CAMERA } from "../../util/global";

const WordFloat = new Effector(true);

WordFloat.setEffect((process: number | false, word?: string) => {
  if (process !== false && word) {
    WordFloat.effectCtx.clearRect(0, 0, innerWidth, innerHeight);
    WordFloat.effectCtx.textAlign = `center`;
    WordFloat.effectCtx.font = `bold 50px monospace`;

    WordFloat.effectCtx.lineWidth = 5;

    WordFloat.effectCtx.fillStyle = `#000000`;
    WordFloat.effectCtx.strokeText(
      word,
      innerWidth / 2 - 25,
      innerHeight / 2 + 25
    );
    WordFloat.effectCtx.fillStyle = `#ffffff`;
    WordFloat.effectCtx.fillText(
      word,
      innerWidth / 2 - 25,
      innerHeight / 2 + 25
    );
  }
});

export default WordFloat;

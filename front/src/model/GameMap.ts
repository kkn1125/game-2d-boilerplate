import list from "../map/list";
import {
  CAMERA,
  COLOR,
  CONTROL,
  ctx,
  FIELD_VALUE,
  master,
  SIZE,
  TEXTURE,
} from "../util/global";

export default class GameMap {
  binary: number[][];
  constructor(mapBinary: string = "") {
    const map = mapBinary || list.home;
    this.binary = this.convertToMap(map);
  }

  convertToMap(str: string) {
    return str
      .trim()
      .split(/[\n]+/)
      .map((row) =>
        row
          .replace(/[\s]+/, "")
          .split("")
          .map((column) => Number(column))
      );
  }

  render() {
    this.collision();
    this.drawMap();
  }

  collision() {
    if (!master.me) return;
    const unitSize = SIZE.UNIT() * SIZE.SCALE();
    const blockSize = SIZE.BLOCK() * SIZE.SCALE();

    const binary = this.binary;
    const cellCount = Math.min(binary[0].length, binary.length);
    const dist = cellCount * blockSize;

    const xin = master.me.x * CONTROL.SCALE;
    const xout = xin + unitSize;
    const yin = master.me.y * CONTROL.SCALE;
    const yout = yin + unitSize;
    const xcen = xin + unitSize / 2;
    const ycen = yin + unitSize / 2;

    const indexCenterX = Math.floor(xcen / blockSize);
    const indexCenterY = Math.floor(ycen / blockSize);

    const indexL = Math.floor(xin / blockSize);
    const indexR = Math.floor(xout / blockSize);
    const indexT = Math.floor(yin / blockSize);
    const indexB = Math.floor(yout / blockSize);

    const blockRight = indexL * blockSize;

    const nockbackSpeed = master.velocity * 2;

    /* center */
    const topCenterBlock = binary?.[indexT]?.[indexCenterX];
    const bottomCenterBlock = binary?.[indexB]?.[indexCenterX];
    const leftCenterBlock = binary?.[indexCenterY]?.[indexL];
    const rightCenterBlock = binary?.[indexCenterY]?.[indexR];

    /* top */
    const topLeftBlock = binary?.[indexT]?.[indexL];
    const topRightBlock = binary?.[indexT]?.[indexR];
    const bottomLeftBlock = binary?.[indexB]?.[indexL];
    const bottomRightBlock = binary?.[indexB]?.[indexR];

    /* Map 외부 감지 */
    if (
      topCenterBlock === undefined ||
      bottomCenterBlock === undefined ||
      leftCenterBlock === undefined ||
      rightCenterBlock === undefined ||
      topLeftBlock === undefined ||
      topRightBlock === undefined ||
      bottomLeftBlock === undefined ||
      bottomRightBlock === undefined
    ) {
      // console.log("out");
      if (topCenterBlock === undefined) {
        // console.log("top out");
        master.me.y += nockbackSpeed;
      } else if (
        rightCenterBlock === undefined &&
        topRightBlock === undefined
      ) {
        // console.log("right out");
        master.me.x -= nockbackSpeed;
      } else if (leftCenterBlock === undefined && topLeftBlock === undefined) {
        // console.log("left out");
        master.me.x += nockbackSpeed;
      } else if (bottomCenterBlock === undefined) {
        // console.log("bottom out");
        master.me.y -= nockbackSpeed;
      }
      return;
    } else {
      /* Map 내부 오브젝트에 대한 감지 */
      if (
        binary[indexT][indexL] === FIELD_VALUE["block"] ||
        binary[indexT][indexR] === FIELD_VALUE["block"] ||
        (topCenterBlock === FIELD_VALUE["block"] &&
          (topLeftBlock === FIELD_VALUE["block"] ||
            topRightBlock === FIELD_VALUE["block"]))
      ) {
        // console.log("상 충돌");
        master.me.y += nockbackSpeed;
      }
      if (
        binary[indexCenterY][indexL] === FIELD_VALUE["block"] &&
        (binary[indexT][indexL] === FIELD_VALUE["block"] ||
          binary[indexB][indexL] === FIELD_VALUE["block"] ||
          (leftCenterBlock === FIELD_VALUE["block"] &&
            (topLeftBlock === FIELD_VALUE["block"] ||
              bottomLeftBlock === FIELD_VALUE["block"])))
      ) {
        // console.log("좌 충돌");
        master.me.x += nockbackSpeed;
      }
      if (
        binary[indexCenterY][indexR] === FIELD_VALUE["block"] &&
        (binary[indexT][indexR] === FIELD_VALUE["block"] ||
          binary[indexB][indexR] === FIELD_VALUE["block"] ||
          (rightCenterBlock === FIELD_VALUE["block"] &&
            (topRightBlock === FIELD_VALUE["block"] ||
              bottomRightBlock === FIELD_VALUE["block"])))
      ) {
        // console.log("우 충돌");
        master.me.x -= nockbackSpeed;
      }
      if (
        binary[indexB][indexL] === FIELD_VALUE["block"] ||
        binary[indexB][indexR] === FIELD_VALUE["block"] ||
        (bottomCenterBlock === FIELD_VALUE["block"] &&
          (bottomLeftBlock === FIELD_VALUE["block"] ||
            bottomRightBlock === FIELD_VALUE["block"]))
      ) {
        // console.log("하 충돌");
        master.me.y -= nockbackSpeed;
      }
    }
  }

  drawMap() {
    const unitSize = SIZE.UNIT() * SIZE.SCALE();
    const blockSize = SIZE.BLOCK() * SIZE.SCALE();
    const playerViewX =
      -(master.me?.x || 0) * CONTROL.SCALE + CAMERA.X(); /* innerWidth / 2; */
    const playerViewY =
      -(master.me?.y || 0) * CONTROL.SCALE + CAMERA.Y(); /* innerHeight / 2; */

    const binary = this.binary;

    for (let ri = 0; ri < binary.length / 2; ri++) {
      const rowMirror = binary.length - ri - 1;
      const row = ri;
      const bRow = binary[row];
      const bRowMirror = binary[rowMirror];

      /* half map top 1/2 */
      for (let ci = 0; ci < bRow.length / 2; ci++) {
        const columnMirror = bRow.length - ci - 1;
        const column = ci;
        const bColumnMirror = bRow[columnMirror];
        const bColumn = bRow[column];

        /* Blocks */
        /* half column top-left */
        if (bColumn === FIELD_VALUE["block"]) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            column * blockSize + playerViewX,
            row * blockSize + playerViewY,
            blockSize,
            blockSize
          );

          ctx.drawImage(
            TEXTURE[FIELD_VALUE["grass"]],
            0,
            0,
            blockSize,
            blockSize,
            column * blockSize + playerViewX,
            row * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }

        /* half column top-right */
        if (bColumnMirror === FIELD_VALUE["block"]) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            columnMirror * blockSize + playerViewX,
            row * blockSize + playerViewY,
            blockSize,
            blockSize
          );

          ctx.drawImage(
            TEXTURE[FIELD_VALUE["grass"]],
            0,
            0,
            blockSize,
            blockSize,
            columnMirror * blockSize + playerViewX,
            row * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }

        /* Roads */
        /* half column top-left */
        if (bColumn === FIELD_VALUE["road"]) {
          // ctx.fillStyle = COLOR.ROAD;
          // ctx.fillRect(
          //   column * blockSize + playerViewX,
          //   row * blockSize + playerViewY,
          //   blockSize,
          //   blockSize
          // );
          ctx.drawImage(
            TEXTURE[bColumn],
            column * blockSize + playerViewX,
            row * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }

        /* half column top-right */
        if (bColumnMirror === FIELD_VALUE["road"]) {
          // ctx.fillStyle = COLOR.ROAD;
          // ctx.fillRect(
          //   columnMirror * blockSize + playerViewX,
          //   row * blockSize + playerViewY,
          //   blockSize,
          //   blockSize
          // );
          ctx.drawImage(
            TEXTURE[bColumnMirror],
            columnMirror * blockSize + playerViewX,
            row * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }
      }

      /* half map bottom 2/2 */
      for (let ci = 0; ci < bRowMirror.length / 2; ci++) {
        const columnMirror = Math.floor(bRowMirror.length) - ci - 1;
        const column = ci;
        const bColumnMirror = bRowMirror[columnMirror];
        const bColumn = bRowMirror[column];

        /* Blocks */
        /* half column bottom-left */
        if (bColumn === FIELD_VALUE["block"]) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            column * blockSize + playerViewX,
            rowMirror * blockSize + playerViewY,
            blockSize,
            blockSize
          );

          ctx.drawImage(
            TEXTURE[FIELD_VALUE["grass"]],
            0,
            0,
            blockSize,
            blockSize,
            column * blockSize + playerViewX,
            rowMirror * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }

        /* half column bottom-right */
        if (bColumnMirror === FIELD_VALUE["block"]) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            columnMirror * blockSize + playerViewX,
            rowMirror * blockSize + playerViewY,
            blockSize,
            blockSize
          );

          ctx.drawImage(
            TEXTURE[FIELD_VALUE["grass"]],
            0,
            0,
            blockSize,
            blockSize,
            columnMirror * blockSize + playerViewX,
            rowMirror * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }

        /* Roads */
        /* half column bottom-left */
        if (bColumn === FIELD_VALUE["road"]) {
          // ctx.fillStyle = COLOR.ROAD;
          // ctx.fillRect(
          //   column * blockSize + playerViewX,
          //   rowMirror * blockSize + playerViewY,
          //   blockSize,
          //   blockSize
          // );
          ctx.drawImage(
            TEXTURE[bColumn],
            column * blockSize + playerViewX,
            rowMirror * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }

        /* half column bottom-right */
        if (bColumnMirror === FIELD_VALUE["road"]) {
          // ctx.fillStyle = COLOR.ROAD;
          // ctx.fillRect(
          //   columnMirror * blockSize + playerViewX,
          //   rowMirror * blockSize + playerViewY,
          //   blockSize,
          //   blockSize
          // );
          ctx.drawImage(
            TEXTURE[bColumnMirror],
            columnMirror * blockSize + playerViewX,
            rowMirror * blockSize + playerViewY,
            blockSize,
            blockSize
          );
        }
      }
    }
  }
}

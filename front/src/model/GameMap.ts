import list from "../map/list";
import { COLOR, ctx, JOYSTICK, master, SIZE } from "../util/global";

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
    const unitSize = SIZE.UNIT * SIZE.SCALE;
    const blockSize = SIZE.BLOCK * SIZE.SCALE;

    const binary = this.binary;
    const cellCount = Math.min(binary[0].length, binary.length);
    const dist = cellCount * blockSize;

    const xin = master.me.x;
    const xout = master.me.x + unitSize;
    const yin = master.me.y;
    const yout = master.me.y + unitSize;
    const xcen = master.me.x + unitSize / 2;
    const ycen = master.me.y + unitSize / 2;

    const indexCenterX = Math.floor(xcen / blockSize);
    const indexCenterY = Math.floor(ycen / blockSize);

    const indexL = Math.floor(xin / blockSize);
    const indexR = Math.floor(xout / blockSize);
    const indexT = Math.floor(yin / blockSize);
    const indexB = Math.floor(yout / blockSize);

    const blockRight = indexL * blockSize;

    const nockbackSpeed = master.velocity * 2;

    /* center */
    const topCenterBlock = binary[indexT][indexCenterX];
    const bottomCenterBlock = binary[indexB][indexCenterX];
    const leftCenterBlock = binary[indexCenterY][indexL];
    const rightCenterBlock = binary[indexCenterY][indexR];

    /* top */
    const topLeftBlock = binary[indexT][indexL];
    const topRightBlock = binary[indexT][indexR];
    const bottomLeftBlock = binary[indexB][indexL];
    const bottomRightBlock = binary[indexB][indexR];

    // console.log(
    //   "center",
    //   "t:",
    //   topCenterBlock ? "길" : "벽",
    //   "b:",
    //   bottomCenterBlock ? "길" : "벽"
    // );
    // console.log(
    //   "center",
    //   "l:",
    //   leftCenterBlock ? "길" : "벽",
    //   "r:",
    //   rightCenterBlock ? "길" : "벽"
    // );
    // console.log(
    //   "top",
    //   "l:",
    //   topLeftBlock ? "길" : "벽",
    //   "r:",
    //   topRightBlock ? "길" : "벽"
    // );
    // console.log(
    //   "bottom",
    //   "l:",
    //   bottomLeftBlock ? "길" : "벽",
    //   "r:",
    //   bottomRightBlock ? "길" : "벽"
    // );
    // console.log("=========================================");

    if (
      binary[indexT][indexL] === 0 ||
      binary[indexT][indexR] === 0 ||
      (topCenterBlock === 0 && (topLeftBlock === 0 || topRightBlock === 0))
    ) {
      // console.log("상 충돌");
      master.me.y += nockbackSpeed;
    }
    if (
      binary[indexCenterY][indexL] === 0 &&
      (binary[indexT][indexL] === 0 ||
        binary[indexB][indexL] === 0 ||
        (leftCenterBlock === 0 &&
          (topLeftBlock === 0 || bottomLeftBlock === 0)))
    ) {
      // console.log("좌 충돌");
      master.me.x += nockbackSpeed;
    }
    if (
      binary[indexCenterY][indexR] === 0 &&
      (binary[indexT][indexR] === 0 ||
        binary[indexB][indexR] === 0 ||
        (rightCenterBlock === 0 &&
          (topRightBlock === 0 || bottomRightBlock === 0)))
    ) {
      // console.log("우 충돌");
      master.me.x -= nockbackSpeed;
    }
    if (
      binary[indexB][indexL] === 0 ||
      binary[indexB][indexR] === 0 ||
      (bottomCenterBlock === 0 &&
        (bottomLeftBlock === 0 || bottomRightBlock === 0))
    ) {
      // console.log("하 충돌");
      master.me.y -= nockbackSpeed;
    }
  }

  drawMap() {
    const playerViewX =
      -(master.me?.x || 0) +
      innerWidth / 2 -
      (SIZE.UNIT * SIZE.SCALE) / 2; /* innerWidth / 2; */
    const playerViewY =
      -(master.me?.y || 0) +
      innerHeight / 2 +
      (SIZE.UNIT * SIZE.SCALE) / 2; /* innerHeight / 2; */
    const size = SIZE.BLOCK * SIZE.SCALE;
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
        if (bColumn === 0) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            column * size + playerViewX,
            row * size + playerViewY,
            size,
            size
          );
        }

        /* half column top-right */
        if (bColumnMirror === 0) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            columnMirror * size + playerViewX,
            row * size + playerViewY,
            size,
            size
          );
        }

        /* Roads */
        /* half column top-left */
        if (bColumn === 1) {
          ctx.fillStyle = COLOR.ROAD;
          ctx.fillRect(
            column * size + playerViewX,
            row * size + playerViewY,
            size,
            size
          );
        }

        /* half column top-right */
        if (bColumnMirror === 1) {
          ctx.fillStyle = COLOR.ROAD;
          ctx.fillRect(
            columnMirror * size + playerViewX,
            row * size + playerViewY,
            size,
            size
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
        if (bColumn === 0) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            column * size + playerViewX,
            rowMirror * size + playerViewY,
            size,
            size
          );
        }

        /* half column bottom-right */
        if (bColumnMirror === 0) {
          ctx.fillStyle = COLOR.BLOCK;
          ctx.fillRect(
            columnMirror * size + playerViewX,
            rowMirror * size + playerViewY,
            size,
            size
          );
        }

        /* Roads */
        /* half column bottom-left */
        if (bColumn === 1) {
          ctx.fillStyle = COLOR.ROAD;
          ctx.fillRect(
            column * size + playerViewX,
            rowMirror * size + playerViewY,
            size,
            size
          );
        }

        /* half column bottom-right */
        if (bColumnMirror === 1) {
          ctx.fillStyle = COLOR.ROAD;
          ctx.fillRect(
            columnMirror * size + playerViewX,
            rowMirror * size + playerViewY,
            size,
            size
          );
        }
      }
    }
  }
}

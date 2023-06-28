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
  UNIT,
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

  drawMinimap(x: number, y: number, scale: number) {
    this.minimap(x, y, scale);
    this.miniMapNPC(x, y, scale);
    this.miniMapPlayer(x, y, scale);
  }

  minimap(x: number, y: number, scale: number) {
    const unitSize = SIZE.UNIT() * SIZE.SCALE() * scale;
    const blockSize = SIZE.BLOCK() * SIZE.SCALE() * scale;
    const playerViewX =
      -(x !== undefined ? x : master.me?.x || 0) * CONTROL.SCALE * scale +
      (x !== undefined ? 0 : CAMERA.X()); /* innerWidth / 2; */
    const playerViewY =
      -(y !== undefined ? y : master.me?.y || 0) * CONTROL.SCALE * scale +
      (y !== undefined ? 0 : CAMERA.Y()); /* innerHeight / 2; */

    const binary = this.binary;

    if (x && y && scale) {
      const padding = 2;
      ctx.fillStyle = COLOR.WARN;
      ctx.fillRect(
        playerViewX - padding,
        playerViewY - padding,
        this.binary[0].length * blockSize + padding * 2,
        this.binary.length * blockSize + padding * 2
      );
    }

    const renderBlock = (x: number, y: number, field: number) => {
      ctx.fillStyle = COLOR.BLOCK;
      ctx.fillRect(
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
    };
    const renderGrass = (x: number, y: number, field: number) => {
      ctx.drawImage(
        TEXTURE[FIELD_VALUE["grass"]],
        0,
        0,
        blockSize*scale,
        blockSize*scale,
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
    };

    const renderRoad = (x: number, y: number, field: number) => {
      // ctx.fillStyle = COLOR.ROAD;
      // ctx.fillRect(
      //   columnMirror * blockSize + playerViewX,
      //   rowMirror * blockSize + playerViewY,
      //   blockSize,
      //   blockSize
      // );
      ctx.drawImage(
        TEXTURE[field],
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
    };

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
          renderBlock(column, row, bColumn);
          renderGrass(column, row, bColumn);
        }

        /* half column top-right */
        if (bColumnMirror === FIELD_VALUE["block"]) {
          renderBlock(columnMirror, row, bColumnMirror);
          renderGrass(columnMirror, row, bColumnMirror);
        }

        /* Roads */
        /* half column top-left */
        if (bColumn === FIELD_VALUE["road"]) {
          renderRoad(column, row, bColumn);
        }

        /* half column top-right */
        if (bColumnMirror === FIELD_VALUE["road"]) {
          renderRoad(columnMirror, row, bColumnMirror);
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
          renderBlock(column, rowMirror, bColumn);
          renderGrass(column, rowMirror, bColumn);
        }

        /* half column bottom-right */
        if (bColumnMirror === FIELD_VALUE["block"]) {
          renderBlock(columnMirror, rowMirror, bColumnMirror);
          renderGrass(columnMirror, rowMirror, bColumnMirror);
        }

        /* Roads */
        /* half column bottom-left */
        if (bColumn === FIELD_VALUE["road"]) {
          renderRoad(column, rowMirror, bColumn);
        }

        /* half column bottom-right */
        if (bColumnMirror === FIELD_VALUE["road"]) {
          renderRoad(columnMirror, rowMirror, bColumnMirror);
        }
      }
    }
  }

  miniMapPlayer(x: number, y: number, scale: number) {
    master.units.forEach((user) => {
      const userX = user.x * CONTROL.SCALE * scale;
      const userY = user.y * CONTROL.SCALE * scale;
      const unitSize = SIZE.UNIT() * SIZE.SCALE();

      ctx.textAlign = "center";
      ctx.fillStyle = COLOR.BLACK;
      ctx.font = `bold ${36 * scale * 3}px sans-serif`;
      ctx.fillText(user.name, userX - x * scale, userY - y * scale - 2);
      ctx.fillStyle = COLOR.UNIT;
      ctx.fillRect(
        userX - x * scale,
        userY - y * scale,
        unitSize * scale,
        unitSize * scale
      );
    });
  }

  miniMapNPC(x: number, y: number, scale: number) {
    UNIT.NPC.forEach((npc) => {
      const npcX = npc.x * CONTROL.SCALE * scale;
      const npcY = npc.y * CONTROL.SCALE * scale;
      const unitSize = SIZE.UNIT() * SIZE.SCALE();

      ctx.textAlign = "center";
      ctx.fillStyle = COLOR.BLACK;
      ctx.font = `bold ${36 * scale * 3}px sans-serif`;
      ctx.fillText(npc.name, npcX - x * scale, npcY - y * scale - 2);
      ctx.fillStyle = COLOR.NPC;
      ctx.fillRect(
        npcX - x * scale,
        npcY - y * scale,
        unitSize * scale,
        unitSize * scale
      );
    });
  }

  drawMap() {
    const unitSize = SIZE.UNIT() * SIZE.SCALE();
    const blockSize = SIZE.BLOCK() * SIZE.SCALE();
    const playerViewX = -(master.me?.x || 0) * CONTROL.SCALE + CAMERA.X();
    const playerViewY = -(master.me?.y || 0) * CONTROL.SCALE + CAMERA.Y();

    const binary = this.binary;

    const renderBlock = (x: number, y: number, field: number) => {
      ctx.fillStyle = COLOR.BLOCK;
      ctx.fillRect(
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
    };
    const renderGrass = (x: number, y: number, field: number) => {
      ctx.drawImage(
        TEXTURE[FIELD_VALUE["grass"]],
        0,
        0,
        blockSize,
        blockSize,
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
    };

    const renderRoad = (x: number, y: number, field: number) => {
      // ctx.fillStyle = COLOR.ROAD;
      // ctx.fillRect(
      //   columnMirror * blockSize + playerViewX,
      //   rowMirror * blockSize + playerViewY,
      //   blockSize,
      //   blockSize
      // );
      ctx.drawImage(
        TEXTURE[field],
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
    };

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
          renderBlock(column, row, bColumn);
          renderGrass(column, row, bColumn);
        }

        /* half column top-right */
        if (bColumnMirror === FIELD_VALUE["block"]) {
          renderBlock(columnMirror, row, bColumnMirror);
          renderGrass(columnMirror, row, bColumnMirror);
        }

        /* Roads */
        /* half column top-left */
        if (bColumn === FIELD_VALUE["road"]) {
          renderRoad(column, row, bColumn);
        }

        /* half column top-right */
        if (bColumnMirror === FIELD_VALUE["road"]) {
          renderRoad(columnMirror, row, bColumnMirror);
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
          renderBlock(column, rowMirror, bColumn);
          renderGrass(column, rowMirror, bColumn);
        }

        /* half column bottom-right */
        if (bColumnMirror === FIELD_VALUE["block"]) {
          renderBlock(columnMirror, rowMirror, bColumnMirror);
          renderGrass(columnMirror, rowMirror, bColumnMirror);
        }

        /* Roads */
        /* half column bottom-left */
        if (bColumn === FIELD_VALUE["road"]) {
          renderRoad(column, rowMirror, bColumn);
        }

        /* half column bottom-right */
        if (bColumnMirror === FIELD_VALUE["road"]) {
          renderRoad(columnMirror, rowMirror, bColumnMirror);
        }
      }
    }
  }
}

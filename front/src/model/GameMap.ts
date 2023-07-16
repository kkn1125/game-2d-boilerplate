import MapList from "../option/MapList";
import {
  bgCanvas,
  CAMERA,
  COLOR,
  CONTROL,
  FIELD_VALUE,
  MAP_PADDING,
  master,
  SIZE,
  TEXTURE,
  uiCanvas,
  UNIT,
} from "../util/global";
import { setPaddingToArray } from "../util/tool";

export default class GameMap {
  name: string = "";
  binary: number[][];
  bgCanvas: HTMLCanvasElement = bgCanvas;
  uiCanvas: HTMLCanvasElement = uiCanvas;
  bgCtx: CanvasRenderingContext2D = this.bgCanvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  uiCtx: CanvasRenderingContext2D = this.uiCanvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  guideLine: boolean;

  constructor(name: string, mapBinary: string = "", paddingType: number = 3) {
    const map = mapBinary || MapList.home;
    this.name = name;
    this.binary = this.convertToMap(map, paddingType);
    this.guideLine = false;
  }

  convertToMap(str: string, paddingType: number) {
    return setPaddingToArray(
      str
        .trim()
        .split(/[\n]+/)
        .map((row) =>
          row
            .replace(/[\s]+/, "")
            .split("")
            .map((column) => Number(column))
        ),
      paddingType,
      MAP_PADDING
    );
  }

  render(guideLine: boolean = false) {
    this.guideLine = guideLine;
    this.drawMap();
    this.collision();
  }

  clear() {
    this.bgCtx.clearRect(0, 0, innerWidth, innerHeight);
    this.uiCtx.clearRect(0, 0, innerWidth, innerHeight);
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

    const collisionType = (type: "block" | "water") => {
      if (!master.me) return;
      /* Map 내부 오브젝트에 대한 감지 */
      if (
        binary[indexT][indexL] === FIELD_VALUE[type] ||
        binary[indexT][indexR] === FIELD_VALUE[type] ||
        (topCenterBlock === FIELD_VALUE[type] &&
          (topLeftBlock === FIELD_VALUE[type] ||
            topRightBlock === FIELD_VALUE[type]))
      ) {
        // console.log("상 충돌");
        master.me.y += nockbackSpeed;
      }
      if (
        binary[indexCenterY][indexL] === FIELD_VALUE[type] &&
        (binary[indexT][indexL] === FIELD_VALUE[type] ||
          binary[indexB][indexL] === FIELD_VALUE[type] ||
          (leftCenterBlock === FIELD_VALUE[type] &&
            (topLeftBlock === FIELD_VALUE[type] ||
              bottomLeftBlock === FIELD_VALUE[type])))
      ) {
        // console.log("좌 충돌");
        master.me.x += nockbackSpeed;
      }
      if (
        binary[indexCenterY][indexR] === FIELD_VALUE[type] &&
        (binary[indexT][indexR] === FIELD_VALUE[type] ||
          binary[indexB][indexR] === FIELD_VALUE[type] ||
          (rightCenterBlock === FIELD_VALUE[type] &&
            (topRightBlock === FIELD_VALUE[type] ||
              bottomRightBlock === FIELD_VALUE[type])))
      ) {
        // console.log("우 충돌");
        master.me.x -= nockbackSpeed;
      }
      if (
        binary[indexB][indexL] === FIELD_VALUE[type] ||
        binary[indexB][indexR] === FIELD_VALUE[type] ||
        (bottomCenterBlock === FIELD_VALUE[type] &&
          (bottomLeftBlock === FIELD_VALUE[type] ||
            bottomRightBlock === FIELD_VALUE[type]))
      ) {
        // console.log("하 충돌");
        master.me.y -= nockbackSpeed;
      }
    };

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
      collisionType("block");
      collisionType("water");
    }
  }

  drawMinimap(x: number, y: number, scale: number, options: RenderOption) {
    if (options.minimap) {
      this.minimap(x, y, scale);
      options.building && this.miniMapBuilding(x, y, scale);
      options.portal && this.miniMapPortal(x, y, scale);
      options.npc && this.miniMapNPC(x, y, scale);
      options.player && this.miniMapPlayer(x, y, scale);
    }
  }

  commonMap(
    blockSize: number,
    playerViewX: number,
    playerViewY: number,
    binary: number[][],
    scale: number,
    isBg: boolean
  ) {
    const masterCtx = isBg ? this.bgCtx : this.uiCtx;
    const renderBlock = (x: number, y: number, field: number) => {
      masterCtx.fillStyle = COLOR.BLOCK;
      masterCtx.fillRect(
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
      if (this.guideLine) {
        masterCtx.strokeStyle = '#ff000056';
        masterCtx.lineWidth = 2;
        masterCtx.strokeRect(
          x * blockSize + playerViewX,
          y * blockSize + playerViewY,
          blockSize,
          blockSize
        );
      }
    };
    const renderGrass = (x: number, y: number, field: number) => {
      masterCtx.drawImage(
        TEXTURE[FIELD_VALUE["grass"]],
        0,
        0,
        blockSize * scale,
        blockSize * scale,
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
    };

    const renderRoad = (x: number, y: number, field: number) => {
      // masterCtx.fillStyle = COLOR.ROAD;
      // masterCtx.fillRect(
      //   columnMirror * blockSize + playerViewX,
      //   rowMirror * blockSize + playerViewY,
      //   blockSize,
      //   blockSize
      // );
      masterCtx.drawImage(
        TEXTURE[field],
        x * blockSize + playerViewX,
        y * blockSize + playerViewY,
        blockSize,
        blockSize
      );
      if (this.guideLine) {
        masterCtx.strokeStyle = '#ff000026';
        masterCtx.lineWidth = 2;
        masterCtx.strokeRect(
          x * blockSize + playerViewX,
          y * blockSize + playerViewY,
          blockSize,
          blockSize
        );
      }
    };

    const renderWater = (x: number, y: number, field: number) => {
      // masterCtx.fillStyle = COLOR.ROAD;
      // masterCtx.fillRect(
      //   columnMirror * blockSize + playerViewX,
      //   rowMirror * blockSize + playerViewY,
      //   blockSize,
      //   blockSize
      // );
      masterCtx.drawImage(
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

        /* Water */
        /* half column top-left */
        if (bColumn === FIELD_VALUE["water"]) {
          renderWater(column, row, bColumn);
        }

        /* half column top-right */
        if (bColumnMirror === FIELD_VALUE["water"]) {
          renderWater(columnMirror, row, bColumnMirror);
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

        /* Water */
        /* half column bottom-left */
        if (bColumn === FIELD_VALUE["water"]) {
          renderWater(column, rowMirror, bColumn);
        }

        /* half column bottom-right */
        if (bColumnMirror === FIELD_VALUE["water"]) {
          renderWater(columnMirror, rowMirror, bColumnMirror);
        }
      }
    }
  }

  minimap(x: number, y: number, scale: number) {
    const unitSize = SIZE.UNIT() * SIZE.SCALE() * scale;
    const blockSize =
      ((SIZE.BLOCK() * SIZE.SCALE()) /
        (CONTROL.STATIC_SCALE / 10) /
        CONTROL.SCALE) *
      scale;
    const playerViewX =
      -(x !== undefined ? x : master.me?.x || 0) * scale +
      (x !== undefined ? 0 : CAMERA.X()); /* innerWidth / 2; */
    const playerViewY =
      -(y !== undefined ? y : master.me?.y || 0) * scale +
      (y !== undefined ? 0 : CAMERA.Y()); /* innerHeight / 2; */

    const binary = this.binary;

    if (x && y && scale) {
      const padding = 5;
      this.uiCtx.fillStyle = COLOR.WHITE;
      this.uiCtx.fillRect(
        playerViewX - padding,
        playerViewY - padding,
        this.binary[0].length * blockSize + padding * 2,
        this.binary.length * blockSize + padding * 2
      );
    }

    this.commonMap(blockSize, playerViewX, playerViewY, binary, scale, false);
  }

  miniMapPlayer(x: number, y: number, scale: number) {
    master.units.forEach((user) => {
      if (user.locate === this.name) {
        const userX = user.x * scale;
        const userY = user.y * scale;
        const unitSize =
          (SIZE.UNIT() * SIZE.SCALE()) /
          (CONTROL.STATIC_SCALE / 10) /
          CONTROL.SCALE;

        this.uiCtx.textAlign = "center";
        this.uiCtx.fillStyle = COLOR.BLACK;
        this.uiCtx.font = `bold ${36 * scale * 3}px sans-serif`;

        /* text outline */
        this.uiCtx.lineWidth = 2;
        this.uiCtx.strokeStyle = COLOR.WHITE;
        this.uiCtx.strokeText(
          user.name.toUpperCase(),
          userX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          userY / (CONTROL.STATIC_SCALE / 10) - y * scale - 2
        );

        /* text */
        this.uiCtx.fillText(
          user.name.toUpperCase(),
          userX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          userY / (CONTROL.STATIC_SCALE / 10) - y * scale - 2
        );
        this.uiCtx.fillStyle = COLOR.UNIT;
        this.uiCtx.fillRect(
          userX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          userY / (CONTROL.STATIC_SCALE / 10) - y * scale,
          unitSize * scale,
          unitSize * scale
        );
      }
    });
  }

  miniMapPortal(x: number, y: number, scale: number) {
    master.portals.forEach((portal) => {
      if (portal.locate === this.name) {
        const portalX = portal.x * scale;
        const portalY = portal.y * scale;
        const unitSize =
          (SIZE.UNIT() * SIZE.SCALE()) /
          (CONTROL.STATIC_SCALE / 10) /
          CONTROL.SCALE;

        this.uiCtx.textAlign = "center";
        this.uiCtx.fillStyle = COLOR.PORTAL;
        this.uiCtx.font = `bold ${36 * scale * 3}px sans-serif`;

        /* text outline */
        this.uiCtx.lineWidth = 2;
        this.uiCtx.strokeStyle = COLOR.WHITE;
        this.uiCtx.strokeText(
          portal.name.toUpperCase(),
          portalX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          portalY / (CONTROL.STATIC_SCALE / 10) - y * scale - 2
        );

        this.uiCtx.fillText(
          portal.name.toUpperCase(),
          portalX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          portalY / (CONTROL.STATIC_SCALE / 10) - y * scale - 2
        );
        this.uiCtx.fillStyle = COLOR.PORTAL;
        this.uiCtx.fillRect(
          portalX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          portalY / (CONTROL.STATIC_SCALE / 10) - y * scale,
          unitSize * scale,
          unitSize * scale
        );
      }
    });
  }

  miniMapNPC(x: number, y: number, scale: number) {
    UNIT.NPC.forEach((npc) => {
      if (npc.locate === this.name) {
        const npcX = npc.x * scale;
        const npcY = npc.y * scale;
        const unitSize =
          (SIZE.UNIT() * SIZE.SCALE()) /
          (CONTROL.STATIC_SCALE / 10) /
          CONTROL.SCALE;

        this.uiCtx.textAlign = "center";
        this.uiCtx.fillStyle = COLOR.BLACK;
        this.uiCtx.font = `bold ${36 * scale * 3}px sans-serif`;

        /* text outline */
        this.uiCtx.lineWidth = 2;
        this.uiCtx.strokeStyle = COLOR.WHITE;
        this.uiCtx.strokeText(
          npc.name.toUpperCase(),
          npcX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          npcY / (CONTROL.STATIC_SCALE / 10) - y * scale - 2
        );

        this.uiCtx.fillText(
          npc.name.toUpperCase(),
          npcX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          npcY / (CONTROL.STATIC_SCALE / 10) - y * scale - 2
        );
        this.uiCtx.fillStyle = COLOR.NPC;
        this.uiCtx.fillRect(
          npcX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          npcY / (CONTROL.STATIC_SCALE / 10) - y * scale,
          unitSize * scale,
          unitSize * scale
        );
      }
    });
  }

  miniMapBuilding(x: number, y: number, scale: number) {
    UNIT.BUILDING.forEach((building) => {
      if (building.locate === this.name) {
        const buildingX = building.x * scale;
        const buildingY = building.y * scale;
        const unitSize = (SIZE.UNIT() * SIZE.SCALE()) / CONTROL.SCALE;

        this.uiCtx.textAlign = "center";
        this.uiCtx.fillStyle = COLOR.BLACK;
        this.uiCtx.font = `bold ${36 * scale * 3}px sans-serif`;
        this.uiCtx.fillText(
          building.name,
          buildingX / (CONTROL.STATIC_SCALE / 10) +
            building.width / 2 -
            x * scale,
          buildingY / (CONTROL.STATIC_SCALE / 10) +
            building.height -
            y * scale -
            2
        );
        this.uiCtx.fillStyle = COLOR.BUILDING;
        this.uiCtx.fillRect(
          buildingX / (CONTROL.STATIC_SCALE / 10) - x * scale,
          buildingY / (CONTROL.STATIC_SCALE / 10) - y * scale,
          building.width,
          building.height
        );
      }
    });
  }

  drawMap() {
    const unitSize = SIZE.UNIT() * SIZE.SCALE();
    const blockSize = SIZE.BLOCK() * SIZE.SCALE();
    const playerViewX = -(master.me?.x || 0) * CONTROL.SCALE + CAMERA.X();
    const playerViewY = -(master.me?.y || 0) * CONTROL.SCALE + CAMERA.Y();

    const binary = this.binary;

    this.commonMap(blockSize, playerViewX, playerViewY, binary, 1, true);
  }

  drawMoney() {
    if (master.me) {
      this.uiCtx.font = `bold ${
        ((16 * SIZE.SCALE()) / CONTROL.SCALE) * 0.1
      }px sans-serif`;
      this.uiCtx.textAlign = "right";
      this.uiCtx.lineWidth = 3;
      this.uiCtx.strokeStyle = "#000000";
      this.uiCtx.strokeText(
        "💰" + master.me.money.toLocaleString("ko"),
        innerWidth - 20,
        50
      );
      this.uiCtx.fillStyle = "#ffffff";
      this.uiCtx.fillText(
        "💰" + master.me.money.toLocaleString("ko"),
        innerWidth - 20,
        50
      );
    }
  }
}

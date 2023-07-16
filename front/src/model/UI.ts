import { DEFAULT_NPC_IMG, master, SIZE, UNIT } from "../util/global";
import Unit from "./Unit";

export default class UI {
  static clearChatModals() {
    document
      .querySelectorAll(".chat-modal.modal")
      .forEach((modal) => modal.remove());
  }

  static createEl(elName: string) {
    return document.createElement(elName);
  }

  static isOpenModal() {
    return document.querySelectorAll(".chat-modal.modal").length > 0;
  }

  static CHAT_MODAL(id: number, name: string, type: string, message: string) {
    const modal = UI.createEl("div");
    modal.classList.add("chat-modal", "modal");
    const title = UI.createEl("div");
    title.classList.add("chat-modal", "title");
    title.dataset.type = type;
    title.innerHTML = name;
    const profile = UI.createEl("div") as HTMLImageElement;
    profile.classList.add("profile");
    profile.style.setProperty("background-image", `url(${DEFAULT_NPC_IMG})`);
    const content = UI.createEl("div");
    content.classList.add("content");
    content.innerHTML = message;
    const ctnWrap = UI.createEl("div");
    ctnWrap.classList.add("chat-modal", "content-wrap");
    ctnWrap.append(profile, content);
    const nextBtn = UI.createEl("button");
    nextBtn.classList.add("next-btn");
    const exitBtn = UI.createEl("button");
    exitBtn.classList.add("exit-btn");
    const btnWrap = UI.createEl("div");
    btnWrap.classList.add("chat-modal", "btn-wrap");
    btnWrap.append(nextBtn, exitBtn);

    modal.append(title, ctnWrap, btnWrap);

    function handleTalk(e: MouseEvent) {
      const target = e.target as HTMLButtonElement;
      if (target === nextBtn) {
        modal.remove();
        UNIT.NPC.forEach((npc) => {
          if (npc.id === id) {
            npc.talk();
          }
        });
        master.portals.forEach((npc) => {
          if (npc.id === id) {
            npc.talk();
          }
        });
      } else if (target === exitBtn) {
        modal.remove();
        UNIT.NPC.forEach((npc) => {
          if (npc.id === id) {
            npc.talkExit();
          }
        });
        master.portals.forEach((npc) => {
          if (npc.id === id) {
            npc.talkExit();
          }
        });
      }
    }

    nextBtn.addEventListener("click", handleTalk.bind(this), {
      once: true,
    });
    exitBtn.addEventListener("click", handleTalk.bind(this), {
      once: true,
    });

    if (message) {
      modal;
    }
    return modal;
  }

  static JOYSTICK() {
    const joystick = this.createEl("div");
    joystick.id = "joystick";
    joystick.classList.add("joystick");

    const ball = this.createEl("div");
    ball.id = "ball";

    joystick.append(ball);
    document.body.append(joystick);

    return [joystick, ball] as [HTMLDivElement, HTMLDivElement];
  }

  APP = document.getElementById("app") as HTMLDivElement;
  ball: HTMLDivElement;

  constructor() {
    this.showJoystick(!navigator.userAgent.match(/Win64/));
  }

  openInventory() {
    const inventory = UI.createEl("div");
    inventory.id = "inventory";
    inventory.classList.add("inventory", "open");
    const topBar = UI.createEl("div");
    topBar.id = "inventory-top-bar";
    // topBar.innerText = "Inventory";
    const title = UI.createEl("div");
    title.id = "inventory-title";
    title.innerText = "Inventory";
    const exitBtn = UI.createEl("button");
    exitBtn.id = "inventory-exit-btn";
    exitBtn.innerText = "❌";

    topBar.append(title, exitBtn);
    inventory.append(topBar);

    (master.me as Unit).inventory.bag.forEach((row, rowId) => {
      const rowEl = UI.createEl("div") as HTMLDivElement;
      rowEl.classList.add("row");
      rowEl.dataset.row = String(rowId);

      row.forEach((cell, cellId) => {
        const cellEl = UI.createEl("div") as HTMLDivElement;
        cellEl.dataset.cell = String(cellId);
        cellEl.classList.add("cell");
        if (cell === null) {
          cellEl.classList.add("empty");
        } else {
          cellEl.classList.add("item");
          cellEl.innerText = cell.name;
        }
        if (master.me) {
          if (
            rowId * SIZE.INVENTORY.X + cellId + 1 >=
            SIZE.INVENTORY.X * SIZE.INVENTORY.Y - master.me.inventory.lockCount
          ) {
            cellEl.classList.add("lock");
          }
        }
        rowEl.append(cellEl);
      });

      inventory.append(rowEl);
    });

    document.body.append(inventory);

    setTimeout(() => {
      if (inventory) {
        inventory.classList.remove("open");
      }
    }, 1000);
  }

  redrawInventory() {
    this.closeInventory();
    const inventory = UI.createEl("div");
    inventory.id = "inventory";
    inventory.classList.add("inventory");
    const topBar = UI.createEl("div");
    topBar.id = "inventory-top-bar";
    // topBar.innerText = "Inventory";
    const title = UI.createEl("div");
    title.id = "inventory-title";
    title.innerText = "Inventory";
    const exitBtn = UI.createEl("button");
    exitBtn.id = "inventory-exit-btn";
    exitBtn.innerText = "❌";

    topBar.append(title, exitBtn);
    inventory.append(topBar);

    (master.me as Unit).inventory.bag.forEach((row, rowId) => {
      const rowEl = UI.createEl("div") as HTMLDivElement;
      rowEl.classList.add("row");
      rowEl.dataset.row = String(rowId);

      row.forEach((cell, cellId) => {
        const cellEl = UI.createEl("div") as HTMLDivElement;
        cellEl.dataset.cell = String(cellId);
        cellEl.classList.add("cell");
        if (cell === null) {
          cellEl.classList.add("empty");
        } else {
          cellEl.classList.add("item");
          cellEl.innerText = cell.name;
        }
        if (master.me) {
          if (
            rowId * SIZE.INVENTORY.X + cellId + 1 >=
            SIZE.INVENTORY.X * SIZE.INVENTORY.Y - master.me.inventory.lockCount
          ) {
            cellEl.classList.add("lock");
          }
        }
        rowEl.append(cellEl);
      });

      inventory.append(rowEl);
    });

    document.body.append(inventory);
  }

  closeInventory() {
    document.querySelectorAll("#inventory").forEach((el) => el.remove());
  }

  showJoystick(isMobile: boolean) {
    document.querySelectorAll("#joystick").forEach((el) => el.remove());
    if (isMobile) {
      const [joystick, ball] = UI.JOYSTICK();
      this.ball = ball;
    }
  }

  append(ui: HTMLElement) {
    this.APP.append(ui);
  }

  openModal(id: number, name: string, type: string, message: string) {
    UI.clearChatModals();
    this.append(UI.CHAT_MODAL(id, name, type, message));
  }
}

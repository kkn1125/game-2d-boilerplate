import { UNIT } from "../util/global";

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

  static CHAT_MODAL = (id: number, name: string, message: string) => {
    const modal = UI.createEl("div");
    modal.classList.add("chat-modal", "modal");
    const title = UI.createEl("div");
    title.classList.add("chat-modal", "title");
    title.innerHTML = name;
    const content = UI.createEl("div");
    content.classList.add("chat-modal", "content");
    content.innerHTML = message;
    const nextBtn = UI.createEl("button");
    nextBtn.classList.add("next-btn");
    const exitBtn = UI.createEl("button");
    exitBtn.classList.add("exit-btn");
    const btnWrap = UI.createEl("div");
    btnWrap.classList.add("chat-modal", "btn-wrap");
    btnWrap.append(nextBtn, exitBtn);

    modal.append(title, content, btnWrap);

    function handleTalk(e: MouseEvent) {
      const target = e.target as HTMLButtonElement;
      modal.remove();
      if (target === nextBtn) {
        UNIT.NPC.forEach((npc) => {
          if (npc.id === id) {
            npc.talk();
          }
        });
      } else if (target === exitBtn) {
        UNIT.NPC.forEach((npc) => {
          if (npc.id === id) {
            npc.talkExit();
          }
        });
      }
    }

    modal.addEventListener("click", handleTalk.bind(this), {
      once: true,
    });

    if (message) {
      modal;
    }
    return modal;
  };

  APP = document.getElementById("app") as HTMLDivElement;

  constructor() {
    // this.openModal("test", "wow");
  }

  append(ui: HTMLElement) {
    this.APP.append(ui);
  }

  openModal(id: number, name: string, message: string) {
    UI.clearChatModals();
    this.append(UI.CHAT_MODAL(id, name, message));
  }
}

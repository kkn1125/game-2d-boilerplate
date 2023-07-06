import { DEFAULT_NPC_IMG, UNIT } from "../util/global";

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

  static CHAT_MODAL(id: number, name: string, message: string) {
    const modal = UI.createEl("div");
    modal.classList.add("chat-modal", "modal");
    const title = UI.createEl("div");
    title.classList.add("chat-modal", "title");
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
      } else if (target === exitBtn) {
        modal.remove();
        UNIT.NPC.forEach((npc) => {
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
    // this.openModal("test", "wow");

    this.showJoystick(!navigator.userAgent.match(/Win64/));
  }

  showJoystick(isMobile: boolean) {
    if (isMobile) {
      const [joystick, ball] = UI.JOYSTICK();
      this.ball = ball;
    } else {
      document.querySelector("#joystick")?.remove?.();
    }
  }

  append(ui: HTMLElement) {
    this.APP.append(ui);
  }

  openModal(id: number, name: string, message: string) {
    UI.clearChatModals();
    this.append(UI.CHAT_MODAL(id, name, message));
  }
}

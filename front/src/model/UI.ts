export default class UI {
  static createEl(elName: string) {
    return document.createElement(elName);
  }

  static CHAT_MODAL = (name: string, message: string) => {
    const modal = UI.createEl("div");
    modal.classList.add("chat-modal", "modal");
    const title = UI.createEl("div");
    title.classList.add("chat-modal title");
    title.innerHTML = name;
    const content = UI.createEl("div");
    content.classList.add("chat-modal", "content");
    content.innerHTML = message;
    const button = UI.createEl("button");
    button.classList.add("chat-modal", "next-btn");
    const btnWrap = UI.createEl("div");
    btnWrap.append(button);

    modal.append(title, content, btnWrap);

    function handleNextTalk(e: MouseEvent) {
      const target = e.target as HTMLButtonElement;
      if (!target.closest(".chat-modal.next-btn")) return;
      modal.remove();
    }

    modal.addEventListener("click", handleNextTalk, {
      once: true,
    });

    if (message) {
      modal;
    }
    return modal;
  };

  APP = document.getElementById("app") as HTMLDivElement;

  append(ui: HTMLElement) {
    this.APP.append(ui);
  }

  openModal(name: string, message: string) {
    this.append(UI.CHAT_MODAL(name, message));
  }
}

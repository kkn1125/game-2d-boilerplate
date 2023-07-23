import PageOff from "./PageOff";
import PageOn from "./PageOn";
import WordFloat from "./WordFloat";

export default {
  pageConvert: (word: string, cb: Function) => {
    PageOff.render().then(() => {
      cb();
      PageOn.render();
      WordFloat.setWord(word).render();
    });
  },
};

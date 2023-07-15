import Engine from "../../core/Engine";
import Building from "../../model/Building";
import { master } from "../../util/global";
import PageOff from "../effect/PageOff";
import PageOn from "../effect/PageOn";
import WordFloat from "../effect/WordFloat";
import MapInBCenter from "../map/MapInBCenter";
import NpcList from "../NpcList";

const Center = new Building("Center");

Center.width = 12;
Center.height = -15;

Center.setPosition(7.85, 5.9);

Center.addEventListener("nearby", (engine: Engine) => {
  PageOff.render(2.5).then(() => {
    WordFloat.setWord("센터")
      .render(1)
      .then(() => {
        WordFloat.reset();
      });
    PageOff.reset();
    engine.changeMap(MapInBCenter);
    master.me?.setLocate("bcenter");
    PageOn.render(2.5).then(() => {
      PageOn.reset();
    });
  });
});

export default Center;

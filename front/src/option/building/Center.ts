import Engine from "../../core/Engine";
import Building from "../../model/Building";
import { master } from "../../util/global";
import EffectList from "../effect/EffectList";
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
  EffectList.pageConvert("센터", () => {
    engine.changeMap(MapInBCenter);
    master.me?.setLocate("bcenter");
  });
});

export default Center;

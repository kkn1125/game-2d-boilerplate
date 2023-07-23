import Engine from "../../core/Engine";
import Portal from "../../model/Portal";
import { COLOR, master } from "../../util/global";
import EffectList from "../effect/EffectList";
import MapSunsetHill from "../map/MapSunsetHill";

const HomeToSunsetHill = new Portal("해가 지는 언덕1");
HomeToSunsetHill.setLocate("home");
HomeToSunsetHill.setPosition(5.7, -0.55);

HomeToSunsetHill.addStaticMessage(
  "<strong>해가 지는 언덕1</strong>로 진입하시겠습니까?"
);

HomeToSunsetHill.color = COLOR.PORTAL;
HomeToSunsetHill.setDestination("fsunsethill");

HomeToSunsetHill.addEventListener("nearby", (engine: Engine) => {
  EffectList.pageConvert("해가 지는 언덕1", () => {
    engine.changeMap(MapSunsetHill);
    master.me?.setLocate("fsunsethill");
  });
});

export default HomeToSunsetHill;

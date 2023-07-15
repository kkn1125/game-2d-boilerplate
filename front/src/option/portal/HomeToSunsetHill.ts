import Engine from "../../core/Engine";
import Portal from "../../model/Portal";
import { COLOR, master } from "../../util/global";
import PageOff from "../effect/PageOff";
import PageOn from "../effect/PageOn";
import WordFloat from "../effect/WordFloat";
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
  PageOff.render(2.5).then(() => {
    WordFloat.setWord("해가 지는 언덕1")
      .render(1)
      .then(() => {
        WordFloat.reset();
      });
    PageOff.reset();
    engine.changeMap(MapSunsetHill);
    master.me?.setLocate("fsunsethill");
    PageOn.render(2.5).then(() => {
      PageOn.reset();
    });
  });
});

export default HomeToSunsetHill;

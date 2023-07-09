import Engine from "../../core/Engine";
import Portal from "../../model/Portal";
import { COLOR, master } from "../../util/global";
import PageOff from "../effect/PageOff";
import PageOn from "../effect/PageOn";
import MapSunsetHill from "../map/MapSunsetHill";

const HomeToSunsetHill = new Portal("sunset hill");
HomeToSunsetHill.setLocate("home");
HomeToSunsetHill.setPosition(5.7, -0.55);

HomeToSunsetHill.addStaticMessage(
  "<strong>해가 지는 언덕1</strong>로 진입하시겠습니까?"
);

HomeToSunsetHill.color = COLOR.PORTAL;
HomeToSunsetHill.setDestination("fsunsethill");

HomeToSunsetHill.addEventListener("messageend", (engine: Engine) => {
  PageOff.render(2.5).then(() => {
    PageOff.reset();
    engine.changeMap(MapSunsetHill);
    master.me?.setLocate("fsunsethill");
    PageOn.render(2.5).then(() => {
      PageOn.reset();
    });
  });
});

export default HomeToSunsetHill;

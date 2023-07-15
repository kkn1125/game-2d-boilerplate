import Engine from "../../core/Engine";
import Portal from "../../model/Portal";
import { COLOR, master } from "../../util/global";
import PageOff from "../effect/PageOff";
import PageOn from "../effect/PageOn";
import WordFloat from "../effect/WordFloat";
import MapHome from "../map/MapHome";

const ToHome = new Portal("태초마을 입구");
ToHome.setLocate("fsunsethill");
ToHome.setPosition(10.7, 11.3);

ToHome.addStaticMessage("마을로 진입하시겠습니까?");

ToHome.color = COLOR.PORTAL;
ToHome.setDestination("home");

ToHome.addEventListener("nearby", (engine: Engine) => {
  PageOff.render(2.5).then(() => {
    WordFloat.setWord("태초마을")
      .render(1)
      .then(() => {
        WordFloat.reset();
      });
    PageOff.reset();
    engine.changeMap(MapHome);
    master.me?.setLocate("home-sunset1");
    PageOn.render(2.5).then(() => {
      PageOn.reset();
    });
  });
});

export default ToHome;

import Engine from "../../core/Engine";
import Portal from "../../model/Portal";
import { COLOR, master } from "../../util/global";
import PageOff from "../effect/PageOff";
import PageOn from "../effect/PageOn";
import MapHome from "../map/MapHome";

const ToHome = new Portal("home");
ToHome.setLocate("fsunsethill");
ToHome.setPosition(10.7, 11.3);

ToHome.addStaticMessage("마을로 진입하시겠습니까?");

ToHome.color = COLOR.PORTAL;
ToHome.setDestination("home");

ToHome.addEventListener("messageend", (engine: Engine) => {
  PageOff.render(2.5).then(() => {
    PageOff.reset();
    engine.changeMap(MapHome);
    master.me?.setLocate("home");
    PageOn.render(2.5).then(() => {
      PageOn.reset();
    });
  });
});

export default ToHome;

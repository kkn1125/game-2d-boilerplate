import Engine from "../../core/Engine";
import Portal from "../../model/Portal";
import { COLOR, master } from "../../util/global";
import EffectList from "../effect/EffectList";
import MapHome from "../map/MapHome";

const ToHome = new Portal("태초마을 입구");
ToHome.setLocate("fsunsethill");
ToHome.setPosition(10.7, 11.3);

ToHome.addStaticMessage("마을로 진입하시겠습니까?");

ToHome.color = COLOR.PORTAL;
ToHome.setDestination("home");

ToHome.addEventListener("nearby", (engine: Engine) => {
  EffectList.pageConvert("태초마을", () => {
    engine.changeMap(MapHome);
    master.me?.setLocate("home-sunset1");
  });
});

export default ToHome;

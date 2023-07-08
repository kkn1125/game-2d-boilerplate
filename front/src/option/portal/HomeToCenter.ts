import Portal from "../../model/Portal";
import { COLOR } from "../../util/global";

const HomeToPortal = new Portal("homeToCenter");
HomeToPortal.setLocate("home");
HomeToPortal.setPosition(25.9, 3.4);

HomeToPortal.addStaticMessage("센터 내부로 진입하시겠습니까?");

HomeToPortal.color = COLOR.PORTAL;

export default HomeToPortal;

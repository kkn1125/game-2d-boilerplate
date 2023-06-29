import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const Devian = new NPC("Devian");
Devian.setPosition(18, 5);
// Devian.addAutoMessage("hi");
// Devian.addAutoMessage("my name is kimson");
Devian.addStaticMessage(
  `안녕? 나는 ${Devian.name}이야! 지금은 NPC가 나 혼자뿐이지만 많은 친구들이 추가될거야!`
);
Devian.addStaticMessage("곧 거대한 2D 게임엔진이 되겠지?");
Devian.color = COLOR.DEVIAN

export default Devian;

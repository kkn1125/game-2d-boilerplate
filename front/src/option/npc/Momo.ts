import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const Momo = new NPC("Momo");
Momo.setPosition(22, 9);
// Momo.addAutoMessage("hi");
// Momo.addAutoMessage("my name is kimson");
Momo.addStaticMessage(
  `안녕? 나는 ${Momo.name}이야! Devian 다음으로 두번째 NPC지. 궁금한게 있으면 물어봐!`
);
Momo.color = COLOR.MOMO;

export default Momo;

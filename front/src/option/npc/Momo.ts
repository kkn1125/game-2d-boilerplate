import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const Momo = new NPC("Momo");
Momo.setLocate("home");
Momo.setPosition(12, 9);
// Momo.addAutoMessage("hi");
// Momo.addAutoMessage("my name is kimson");
Momo.addStaticMessage(
  `안녕? 나는 ${Momo.name}이야! Devian 다음으로 두번째 NPC지. 궁금한게 있으면 물어봐!`
);
Momo.addStaticMessage(
  `대화가 짧다고 생각해서 한 줄 더 추가 했어. 곧 있으면 세계관도 구축할 예정이래. 많이 기대 해 줘!`
);
Momo.color = COLOR.MOMO;

export default Momo;

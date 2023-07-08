import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const David = new NPC("David");
David.setLocate("bcenter");
David.setPosition(5, 4.5);
David.addStaticMessage(
  `${David.name}야. 센터가 지금은 이미지를 선택 못해서 황무지야. 개발자가 게을러서 그런것 같아.`
);
David.addStaticMessage(
  "왜 센터냐고? 건물 하나 쯤은 있어야 뭐라도 한 것 처럼 보이잖아. 건물 같은 내부가 아니라는게 함정이지만."
);
David.addStaticMessage("...");
David.addStaticMessage("다시 마을로 가고 싶구나?");
David.color = COLOR.DAVID;

export default David;

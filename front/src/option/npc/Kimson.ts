import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const Kimson = new NPC("Kimson");
Kimson.setPosition(28, 4);
// Kimson.addAutoMessage("hi");
// Kimson.addAutoMessage("my name is kimson");
Kimson.addStaticMessage(
  `안녕하세요. GM ${Kimson.name}입니다. 현재 보고 계신 2D 게임 엔진은 바닐라 타입스크립트로 제작되었습니다.`
);
Kimson.addStaticMessage(
  `포탈 맵이동이나 경제활동을 위한 재화, 거래 시스템은 개발 중에 있습니다. 많은 관심 가져주시기 바랍니다.`
);
Kimson.color = COLOR.KIMSON;

export default Kimson;

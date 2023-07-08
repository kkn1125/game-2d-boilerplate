import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const Kimson = new NPC("Kimson");
Kimson.setLocate("home");
Kimson.setPosition(22, 4);

Kimson.addStaticMessage(
  `안녕하세요. GM ${Kimson.name}입니다. 현재 보고 계신 2D 게임 엔진은 바닐라 타입스크립트로 제작되었습니다.`
);
Kimson.addStaticMessage(
  `포탈 맵이동 기능이 추가 되었습니다. 경제활동을 위한 재화, 거래 시스템은 개발 중에 있습니다.`
);
Kimson.addStaticMessage(
  `많은 관심 가져주시기 바랍니다.<br /><a href="https://github.com/kkn1125" target="_blank">개발자 깃허브 바로가기</a><br /><a href="https://kkn1125.github.io/portfolio" target="_blank">개발자 포트폴리오 보러가기</a>`
);

Kimson.color = COLOR.KIMSON;

export default Kimson;

import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const Ming = new NPC("Ming");
Ming.setLocate("home");
Ming.setPosition(11, 7);

Ming.addStaticMessage(
  `안녕! 매니저 ${Ming.name}이야. 첫 화면에서 그려지는 요소가 많아서 맵을 축소했지.`
);
Ming.addStaticMessage(
  `이제 <strong>해지는 언덕1</strong> 맵이 생겼어. <strong>북쪽</strong>으로 가보는게 어때?`
);
Ming.addStaticMessage(
  `Kimson 옆에 있는 Center 건물은 <strong>가까이</strong> 가면 <strong>자동 이동</strong>되니까 조심하라구.`
);

Ming.color = COLOR.MING;

export default Ming;

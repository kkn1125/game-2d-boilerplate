import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const Devian = new NPC("Devian");
Devian.setLocate("home");
Devian.setPosition(15, 8);
// Devian.addAutoMessage("hi");
// Devian.addAutoMessage("my name is kimson");
Devian.addStaticMessage(
  // `안녕? 나는 ${Devian.name}이야! 지금은 NPC가 나 혼자뿐이지만 많은 친구들이 추가될거야!`
  `안녕? 나는 ${Devian.name}이야! 이제 NPC는 나 혼자가 아니야! 많은 친구들이 추가 됐어!`
);
Devian.addStaticMessage(
  // `안녕? 나는 ${Devian.name}이야! 지금은 NPC가 나 혼자뿐이지만 많은 친구들이 추가될거야!`
  `맵 이전과 화면 전환 효과도 추가 됐다구! 이게 곧 아이템이 추가되고, 경제활동이랑 퀘스트가 추가될 예정이래! `
);
Devian.addStaticMessage("곧 거대한 2D 게임엔진이 되겠지?");
Devian.color = COLOR.DEVIAN

export default Devian;

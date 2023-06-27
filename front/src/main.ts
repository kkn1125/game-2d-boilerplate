import Engine from "./core/Engine";
import RayPointer from "./core/RayPointer";
import NPC from "./model/NPC";
import UI from "./model/UI";
import User from "./model/User";
import { master } from "./util/global";

const ui = new UI();
const rayPointer = new RayPointer();

const npc1 = new NPC("Devian");
npc1.setPosition(24, 5);
// npc1.addAutoMessage("hi");
// npc1.addAutoMessage("my name is kimson");
npc1.addStaticMessage(
  `안녕? 나는 ${npc1.name}이야! 지금은 NPC가 나 혼자뿐이지만 많은 친구들이 추가될거야!`
);
npc1.addStaticMessage("곧 거대한 2D 게임엔진이 되겠지?");

const testUser = new User("test");
master.me = testUser;

const engine = new Engine();
engine.activeGuideLine = true;
engine.initUI(ui);
engine.initRayPointer(rayPointer);
engine.addNpc(npc1);
engine.addPlayer(testUser);

// npc1.talk();
// npc1.talkExit();
// npc1.talk();
// npc1.talk();
// npc1.talk();
// npc1.talk();

export {};

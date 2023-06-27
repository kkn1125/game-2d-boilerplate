import Engine from "./core/Engine";
import RayPointer from "./core/RayPointer";
import UI from "./model/UI";
import User from "./model/User";
import NpcList from "./option/NpcList";
import { master } from "./util/global";

const ui = new UI();
const rayPointer = new RayPointer();

const testUser = new User("test");
master.me = testUser;

const engine = new Engine();
engine.activeGuideLine = false;
engine.initUI(ui);
engine.initRayPointer(rayPointer);
engine.addNpc(...NpcList);
engine.addPlayer(testUser);

// npc1.talk();
// npc1.talkExit();
// npc1.talk();
// npc1.talk();
// npc1.talk();
// npc1.talk();

export {};

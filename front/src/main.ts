import Engine from "./core/Engine";
import User from "./model/User";
import BuildingList from "./option/BuildingList";
import NpcList from "./option/NpcList";
import { master } from "./util/global";

const testUser = new User("test");
master.me = testUser;

const engine = new Engine();
engine.activeGuideLine = false;
engine.addNpc(...NpcList);
engine.addBuilding(...BuildingList);
engine.addPlayer(testUser);

// npc1.talk();
// npc1.talkExit();
// npc1.talk();
// npc1.talk();
// npc1.talk();
// npc1.talk();

export {};

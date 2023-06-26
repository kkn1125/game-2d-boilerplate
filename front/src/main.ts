import Engine from "./core/Engine";
import NPC from "./model/NPC";
import User from "./model/User";
import { master } from "./util/global";

const npc1 = new NPC("Devian");
npc1.setPosition(2, 9);
npc1.addStaticMessage("hi");
npc1.addStaticMessage("my name is kimson");

const testUser = new User("test");
master.me = testUser;

const engine = new Engine();
engine.addNpc(npc1);
engine.addPlayer(testUser);

// npc1.addAutoMessage("hi");
// npc1.addAutoMessage("my name is kimson");

// npc1.talk();
// npc1.talkExit();
// npc1.talk();
// npc1.talk();
// npc1.talk();
// npc1.talk();

export {};

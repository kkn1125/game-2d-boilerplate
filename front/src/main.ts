import Engine from "./core/Engine";
import User from "./model/User";
import BuildingList from "./option/BuildingList";
import RedHat from "./option/item/RedHat";
import NpcList from "./option/NpcList";
import { master } from "./util/global";

const testUser = new User("test");
master.me = testUser;
master.me.money = 1_500_000_000;

const engine = new Engine({
  render: {
    shadow: false,
    building: false,
    npc: true,
    player: true,
    minimap: true,
  },
  active: {
    guideLine: false,
  },
});
// engine.activeGuideLine = false;
engine.addNpc(...NpcList);
engine.addBuilding(...BuildingList);
engine.addPlayer(testUser);

master.me.getItem(RedHat);

// npc1.talk();
// npc1.talkExit();
// npc1.talk();
// npc1.talk();
// npc1.talk();
// npc1.talk();

export {};

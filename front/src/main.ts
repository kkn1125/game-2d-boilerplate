import Engine from "./core/Engine";
import Effector from "./model/Effector";
import User from "./model/User";
import BuildingList from "./option/BuildingList";
import PageOff from "./option/effect/PageOff";
import PageOn from "./option/effect/PageOn";
import RedHat from "./option/item/RedHat";
import MapHome from "./option/map/MapHome";
import MapInBCenter from "./option/map/MapInBCenter";
import NpcList from "./option/NpcList";
import HomeToPortal from "./option/portal/homeToCenter";
import PortalList from "./option/PortalList";
import { master } from "./util/global";

const testUser = new User("test");
master.me = testUser;
master.me.money = 1_500_000_000;

const engine = new Engine({
  render: {
    portal: true,
    shadow: false,
    building: true,
    npc: true,
    player: true,
    minimap: true,
  },
  active: {
    guideLine: false,
  },
});
// engine.activeGuideLine = false;
engine.changeMap(MapHome);
engine.addNpc(
  ...NpcList.map((npc) => {
    if (npc.name === "David") {
      npc.addEventListener("messageend", () => {
        PageOff.render(2.5).then(() => {
          engine.changeMap(MapHome);
          NpcList.forEach((npc) => {
            if (npc.locate === "home") {
              // npc.setLocate();
            }
          });
          master.me?.setLocate("home");
          PageOn.render(2.5);
        });
      });
    }

    return npc;
  })
);
engine.addPortal(
  ...PortalList.map((portal) => {
    if (portal.name === "homeToCenter") {
      portal.addEventListener("messageend", () => {
        PageOff.render(2.5).then(() => {
          engine.changeMap(MapInBCenter);
          NpcList.forEach((npc) => {
            if (npc.locate === "bcenter") {
              // npc.setLocate();
            }
          });
          master.me?.setLocate("bcenter");
          PageOn.render(2.5);
        });
      });
    }

    return portal;
  })
);
engine.addBuilding(...BuildingList);
engine.addPlayer(testUser);

master.me.getItem(RedHat);

// setTimeout(() => {
//   PageOff.render(2.5).then(() => {
//     engine.changeMap(MapInBCenter);
//     NpcList.forEach((npc) => {
//       if (npc.locate === "bcenter") {
//         // npc.setLocate();
//       }
//     });
//     master.me?.setLocate("bcenter");
//     PageOn.render(2.5);
//   });
// }, 1000);

// npc1.talk();
// npc1.talkExit();
// npc1.talk();
// npc1.talk();
// npc1.talk();
// npc1.talk();

export {};

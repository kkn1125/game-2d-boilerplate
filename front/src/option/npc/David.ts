import NPC from "../../model/NPC";
import { COLOR } from "../../util/global";

const David = new NPC("David");
David.setPosition(24, 4.5);
David.addStaticMessage(`나는 ${David.name}야.`);
David.addStaticMessage("...");
David.color = COLOR.DAVID;

export default David;

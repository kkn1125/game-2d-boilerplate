import Item from "../../model/Item";
import { master } from "../../util/global";

// const RedHat = new Item({
//   type: "wear",
//   name: "redhat",
//   price: 0,
//   wearPlace: "hat",
// });

// RedHat.addEventListener("nearby", () => {
//   console.log("near item");
//   master.me?.getItem(RedHat);
// });

export default () => {
  const RedHat = new Item({
    type: "wear",
    name: "redhat",
    price: 0,
    wearPlace: "hat",
  });

  RedHat.addEventListener("nearby", () => {
    console.log("near item");
    master.me?.getItem(RedHat);
  });

  return RedHat;
};

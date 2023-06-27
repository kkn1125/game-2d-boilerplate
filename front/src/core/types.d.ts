declare type OtherKeySet = " ";
declare type KeySet = "w" | "s" | "a" | "d";
declare type Joystick = {
  [key in KeySet & OtherKeySet]: boolean;
};

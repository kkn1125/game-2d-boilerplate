declare type KeySet = "w" | "s" | "a" | "d";
declare type Joystick = {
  [key in KeySet]: boolean;
};

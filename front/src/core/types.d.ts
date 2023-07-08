declare type OtherKeySet = " " | "Escape" | "+" | "-" | "i";
declare type KeySet = "w" | "s" | "a" | "d";
declare type Joystick = {
  [key in KeySet & OtherKeySet]: boolean;
};

declare type RenderOption = {
  [key in
    | "minimap"
    | "player"
    | "npc"
    | "building"
    | "shadow"
    | "portal"]: boolean;
};

declare interface EngineOption {
  render: RenderOption;
  active: {
    guideLine: boolean;
  };
}

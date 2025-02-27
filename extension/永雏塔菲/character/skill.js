import { lib, game, ui, get, ai, _status } from "../extension/noname.js";
import diy from "./skills/diy.js";
import oldOL from "./skills/oldOL.js";
import oldMB from "./skills/oldMB.js";
import oldDC from "./skills/oldDC.js";
import oldEtc from "./skills/oldEtc.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
  ...diy,
  ...oldOL,
  ...oldMB,
  ...oldDC,
  ...oldEtc,
};

export default skills;

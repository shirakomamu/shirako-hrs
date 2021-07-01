import HRBAC from "src/classes/Hrbac";
import opts from "src/config/hrbac";

const hrbac = new HRBAC(opts);

export default hrbac;
export * from "./hrbac.enums";
export * from "./hrbac.types";

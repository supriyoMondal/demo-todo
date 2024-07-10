import { Replicache } from "replicache";

const licenseKey = "la286d8bfcb014da1aa403846d791e32e";
const baseUrl = "http://localhost:3000/api";

export const replicache = new Replicache({
  licenseKey,
  pushURL: `${baseUrl}/push`,
  pullURL: `${baseUrl}/pull`,
  name: "supriyo07-todos",
  mutators: {},
});

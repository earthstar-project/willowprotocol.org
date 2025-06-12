import { Dir, File } from "macromania-outfs";
import { tutorial_paths } from "./tutorials/paths.tsx";

export const tutorials = (
  <Dir name="tutorials">
    {tutorial_paths}
  </Dir>
);

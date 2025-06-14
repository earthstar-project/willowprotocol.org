import { Dir, File } from "macromania-outfs";
import { tutorial_paths } from "./tutorials/paths.tsx";
import { tutorial_entry } from "./tutorials/entry.tsx";

export const tutorials = (
  <Dir name="tutorials">
    {tutorial_paths}
    {tutorial_entry}
  </Dir>
);

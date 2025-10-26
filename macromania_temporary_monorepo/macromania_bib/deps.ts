export * from "https://raw.githubusercontent.com/worm-blossom/macromania/main/mod.ts";
export * from "../macromania_logger/mod.tsx";
export * from "../macromania_config/mod.tsx";

import citeproc from "npm:citeproc@2.4.63";
export const CSL = citeproc;

import citationJs from "npm:citation-js@0.7.12";
export const CiteJs = citationJs;

export * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";
import { code, nav } from "../../h.ts";
import { link_name } from "../../linkname.ts";
import { def_type } from "../../pseudocode.ts";
import { Expression, surpress_output } from "../../tsgen.ts";
import { lis, pinformative, site_template } from "../main.ts";

export const specifications: Expression = site_template(
  {
    title: "Specifications",
    name: "specifications",
  },
  [
    // pinformative("A most pinformative introductory paragraph."),
    // nav(
    //   lis(
    //     link_name("data_model", "Data model"),
    //     lis(
    //       link_name("grouping_entries", "Grouping Entries"),
    //       link_name("encodings", "On Encodings"),
    //       link_name("e2e", "Encrypting Entries"),
    //     ),
    //     link_name("meadowcap", "Meadowcap capability system"),
    //     link_name("sync", "Synchronisation"),
    //     lis(
    //       link_name("access_control", "Access control"),
    //       link_name(
    //         "3d_range_based_set_reconciliation",
    //         "3d-range-based set reconciliation",
    //       ),
    //       link_name("psi", "Private set intersection"),
    //       link_name("resource_control", "Resource control"),
    //     ),
    //   ),
    // ),

    pinformative("Willow is a family of specifications:"),

    // nav(
      lis(
        [link_name("data_model", "Data model"), ": The fundamental data model, a system for giving structured names to bytestrings."],
        [link_name("meadowcap", "Meadowcap"), ": A capability system for controlling access to Willow data."],
        [link_name("sync", "Synchronisation"), ": A network protocol for efficiently and privately synchronizing Willow data."],
      ),
    // ),

    pinformative("These main specifications rely on several common concepts:"),

    nav(
      lis(
        link_name("grouping_entries", "Grouping Entries"),
        link_name("encodings", "On Encodings"),
        link_name("e2e", "Encrypting Entries"),
        link_name("private_set_intersection", "Private Set Intersection"),
        link_name("3d_range_based_set_reconciliation", "3d Range-Based Set Reconciliation"),
        link_name("resource_control", "Multiplexing and Flow Control"),
      ),
    ),

    surpress_output(def_type("U64", "U64", ["The type of unsigned 64 bit integers, that is, the type of natural numbers greater than or equal to ", code("0"), " and strictly less than ", code("2^64 - 1"), "."])),
    surpress_output(def_type("Bool", "Bool", ["The type of the two truth values ", code("true"), " and ", code("false"), "."])),
  ],
);

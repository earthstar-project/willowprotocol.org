import { def } from "../../defref.ts";
import { code, img, nav } from "../../h.ts";
import { link_name } from "../../linkname.ts";
import { marginale } from "../../marginalia.ts";
import { asset } from "../../out.ts";
import { def_type } from "../../pseudocode.ts";
import { Expression, surpress_output } from "../../tsgen.ts";
import { link, lis, pinformative, site_template } from "../main.ts";

export const specifications: Expression = site_template(
  {
    title: "Specifications",
    name: "specifications",
  },
  [
    marginale([
      img(asset("specs/emblems.png"), "An illustration of the four emblems of Willow's specifications laid out somewhat like playing cards.")
    ]),
    
    pinformative("Willow is a family of specifications:"),
    
    lis(
      [link_name("data_model", "Data Model"), ": The fundamental data model, a system for giving structured names to bytestrings."],
      [link_name("meadowcap", "Meadowcap"), ": A capability system for controlling access to Willow data."],
      [link_name("sync", "Synchronisation"), ": A network protocol for efficiently and privately synchronising Willow data."],
      [link_name("sideloading", "Sideloading"), ": A protocol for securely delivering Willow data by whatever means possible."]
    ),

    pinformative("These main specifications rely on several common concepts:"),

    nav(
      lis(
        link_name("grouping_entries", "Grouping Entries"),
        link_name("encodings", "On Encodings"),
        link_name("e2e", "Encrypting Entries"),
        link_name("access_control", "Access Control"),
        link_name("private_area_intersection", "Private Area Intersection"),
        link_name("d3_range_based_set_reconciliation", "3d Range-Based Set Reconciliation"),
        link_name("resource_control", "Multiplexing and Flow Control"),
      ),
    ),
    
    pinformative("And until we build our own fancy cross-domain referencing system, this site is the temporary home for:"),
    
    nav(
      lis(
        [link_name("es6_spec", "Earthstar"), ": a friendly set of parameters for the Willow protocol."]        
      )
    ),

    surpress_output(def_type("U64", "U64", ["The type of unsigned 64 bit integers, that is, the type of natural numbers greater than or equal to ", code("0"), " and strictly less than ", code("2^64"), "."])),
    surpress_output(def_type("U8", "U8", ["The type of unsigned 8 bit integers, that is, the type of natural numbers greater than or equal to ", code("0"), " and strictly less than ", code("256"), "."])),
    surpress_output(def_type("Bool", "Bool", ["The type of the two truth values ", code("true"), " and ", code("false"), "."])),
    surpress_output(def("iff", "iff", ["An abbreviation of ", link("if and only if", "https://en.wikipedia.org/wiki/If_and_only_if"), "."])),
  ],
);

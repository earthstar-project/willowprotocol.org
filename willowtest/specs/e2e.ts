import {
    def_parameter,
    def_value,
    link,
    lis,
    pinformative,
    site_template,
  } from "../main.ts";
  import {
    code,
    em,
    figcaption,
    figure,
    img,
    table,
    tbody,
    td,
    th,
    thead,
    tr,
  } from "../../h.ts";
  import { r, def, rs, Rs } from "../../defref.ts";
  import { asset } from "../../out.ts";
  import { marginale_inlineable, sidenote } from "../../marginalia.ts";
  import { Expression } from "../../tsgen.ts";
  
  export const e2e: Expression = site_template({
    name: "e2e",
    title: "Encrypted Willow",
  }, [
    pinformative("wip"),

    pinformative("Spoilers: ", rs("namespace_id"), " and ", rs("subspace_id"), " can be encrypted with any normal block cypher. ", Rs("path"), " require encryption with a prefix-preserving encryption ", sidenote("scheme", [link(`Xu, Jun, et al. "Prefix-preserving ip address anonymization: Measurement-based security evaluation and a new cryptography-based scheme." 10th IEEE International Conference on Network Protocols, 2002. Proceedings. IEEE, 2002.`, "https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=3d6387c053cc9f3fe153bbffc79b492f0775c354")]), ". ", Rs("timestamp"), " cannot be encrypted while preserving Willow semantics."),
  ]);
  
  /*
  
  */
  
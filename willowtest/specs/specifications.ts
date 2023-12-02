import { nav } from "../../h.ts";
import { link_name } from "../../linkname.ts";
import { Expression } from "../../tsgen.ts";
import { lis, pinformative, site_template } from "../main.ts";

export const specifications: Expression = site_template(
  {
    title: "Specifications",
    name: "specifications",
  },
  [
    pinformative("A most pinformative introductory paragraph."),
    nav(
      lis(
        link_name("data_model", "Data model"),
        lis(
          link_name("encodings", "What we mean when we talk about Encodings"),
          link_name("grouping_entries", "Grouping Entries"),
          link_name("e2e", "Encrypting Entries"),
        ),
        link_name("meadowcap", "Meadowcap capability system"),
        link_name("sync", "Synchronisation"),
        lis(
          link_name("access_control", "Access control"),
          link_name(
            "product_based_set_reconciliation",
            "Product-based set reconciliation",
          ),
          link_name("psi", "Private set intersection"),
          link_name("resource_control", "Resource control"),
        ),
      ),
    ),
  ],
);

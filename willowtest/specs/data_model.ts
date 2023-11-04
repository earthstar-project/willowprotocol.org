import { def } from "../../defref.ts";
import { p } from "../../h.ts";
import { Expression } from "../../tsgen.ts";
import { site_template } from "../main.ts";

export const data_model: Expression = site_template(
    {
        title: "Willow Data Model",
        name: "data_model",
    },
    [
        p("wip"),
        def("namespace"),
        def("payload"),
        def({ id: "payload_length", singular: "payload length" }),
        def({ id: "payload_hash", singular: "payload hash", plural: "payload hashes" }),
        def({ id: "entry", plural: "entries" }),
        def({ id: "3d_product", singular: "3d-product" }),
        def({ id: "aoi", singular: "area of interest", plural: "areas of interest"}),
        def({ id: "aoi_empty", singular: "empty"}),
        def({ id: "aoi_intersection", singular: "intersection"}),
        def({ id: "aoi_count_limit", singular: "count limit"}),
        def({ id: "aoi_size_limit", singular: "size limit"}),
    ],
);

// Peers need not synchronize full namespaces, they can specify parts of namespaces to synchronize instead. Essentially, both peers announce which data regions they are interested in, and then they perform data reconciliation on the intersection of these regions. This section describes which kinds of regions can be expressed.

// We call such a region an **area of interest**. The basis of every *area of interest* is a *3d product* (the same as those defined in the [meadowcap spec](./meadowcap)). This 3d product can be supplemented with additional constraints based on resource limits. For example, a peer can express that it only cares about the 100 newest (by timestamp) entries in some 3d product. We allow this additional expressivity so that resource-constrained peers that can only keep a fixed-size sliding window of entries can make meaningful requests that don't require them to throw away most of the response.

// More precisely, for each of the three dimensions (timestamp, path, subspace ID), an *area of interest* has an optional **count limit** and an optional **size limit**. A *count limit* of `cl` in dimension `d` restricts the *area of interest* to the `cl` many entries in the *3d product* that are greatest with respect to the dimension `d`. A *size limit* of `sl` in dimension `d` restricts the *area of interest* to the greatest (with respect to `d`) entries in the *3d product* whose accumulated *payload length* does not exceed `sl`. 

// <hidden>drawing</hidden>

// The various *count limits* and *size limits* of an *area of interest* are conjunctive. For example, if there is both a *timestamp count limit* `tcl` and a *timestamp size limit* `tsl`, the sizes of the payloads of the matched entries will add up to at most `tsl` *and* there can be at most `tcl` many entries. Similarly, if there is both a *timestamp count limit* `tcl` and a *path count limit* `pcl`, and entry needs to be among the `tcl` many entries with the greatest timestamps *and* among the `pcl` many entries with the greatest paths.

// <hidden>drawing</hidden>

// The **intersection** of two *areas of interest* consists of the *intersection* of their *3d products*, and the combined limits of both. If the same kind of limit occurs in both, the *intersection* uses the stricter (numerically lesser) limit.

// <hidden>drawing</hidden>

// Peers need only abide limits on a best-effort basis. Strict enforcement would not make any sense: imagine Betty has just transmitted her 100 newest entries to Alfie, only to then receive an even newer entry from Gemma. Betty should forward that entry to Alfie of course, despite that putting her total number of transmissions above the limit of 100.
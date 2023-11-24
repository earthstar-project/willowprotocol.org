import { R, def, r, rs } from "../../../defref.ts";
import { code, em, p } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { Expression } from "../../../tsgen.ts";
import { def_parameter, def_value, link, lis, pinformative, site_template } from "../../main.ts";

export const product_based_set_reconciliation: Expression = site_template(
    {
        title: "Product-Based Set Reconciliation",
        name: "product_based_set_reconciliation",
    },
    [
        pinformative("Given a ", r("3d_product"), ",that both peers in a sync session (Alfie and Betty) know, how can they efficiently update each other about their ", rs("entry"), " in that product? in this document we describe ", def({ id: "pbsr", singular: "product-based set reconciliation"}), ", a technique for solving this problem based on ", link("range-based set reconciliation", "https://arxiv.org/pdf/2212.13567.pdf"), "."),

        pinformative("The general idea of ", r("pbsr"), " is to have Alfie send a small ", def({ id: "entry_fingerprint", singular: "fingerprint"}), " over all his ", rs("entry"), " in the ", r("3d_product"), ". Upon receiving this ", r("entry_fingerprint"), ", Betty computes the ", r("entry_fingerprint"), " over all of ", em("her"), " ", rs("entry"), " in the ", r("entry_fingerprint"), ". If the ", rs("entry_fingerprint"), " match, she can conclude that no further data exchange is necessary."),

        pinformative("Otherwise, Betty splits the ", r("3d_product"), " into two smaller ", rs("3d_product"), " (call them ", def_value("sub1"), " and ", def_value("sub2"), ") that contain roughly half of her ", rs("entry"), " (from the original ", r("3d_product"), ") each and whose union gives the original ", r("3d_product"), " again. Then she computes the ", rs("entry_fingerprint"), " of all ", rs("entry"), " in ", r("sub1"), " and sends both ", r("sub1"), " (the ranges that make up the ", r("3d_product"), ", not its ", rs("entry"), ") and its ", r("entry_fingerprint"), " to Alfie. This combination of a ", r("3d_product"), " and a ", r("entry_fingerprint"), " is called a ", def({id: "product_fingerprint", singular: "product fingerprint"}), ". She also sends the ", r("product_fingerprint"), " for ", r("sub2"), ". Note that the initial mesage where Alfie sent his ", r("entry_fingerprint"), " for the initial ", r("3d_product"), " has been a ", r("product_fingerprint"), " as well."),

        pinformative("When Alfie receives these ", rs("product_fingerprint"), ", he can handle them in exactly the same way: he computes his local ", r("entry_fingerprint"), " over the same ", r("3d_product"), ", compares the ", rs("entry_fingerprint"), ", knows that no further work is necessary if they are equal, and otherwise processes the ", r("3d_product"), " by splitting it."),

        pinformative("At any point, a peer can opt to send a ", r("product_entry_set"), " instead of a ", r("product_fingerprint"), ". A ", def({id: "product_entry_set", singular: "product_entry_set"}), " consists of a ", r("3d_product"), ", the set of all ", rs("entry"), " that the peer has within that ", r("3d_product"), ", and a boolean flag to indicate whether the other peer should reply with its ", r("product_entry_set"), " for the same ", r("3d_product"), " as well. Such a reply should ", em("not"), " set that flag, and it should not contain any of the ", rs("entry"), " that were part of the ", r("product_entry_set"), " that it is replying to."),

        pinformative("By recursively splitting ", rs("3d_product"), " with non-equal ", rs("entry_fingerprint"), ", the peers can drill down to the subareas where actual reconciliation (by exchanging ", r("product_entry_set"), ") is required. Note that the peers need not agree on when to switch from ", rs("product_fingerprint"), " to ", rs("product_entry_said"), ", or into how many ", rs("3d_product"), " to subdivide in each recursion step. As long as they both make some kind of progress on every ", r("product_fingerprint"), " they receive, they will successfully reconcile their ", rs("entry"), "."),

        pinformative("In willow, it is possible for a peer to have an entry but to not hold its full payload. We can easily modify ", r("pbsr"), " to let peers detect partial payloads on which they could make progress, by incorporating the number of available payload bytes into each ", r("entry_fingerprint"), "."),

        hsection("pbsr_parameters", "Parameters", [
            pinformative(R("pbsr"), " requires the ability to hash arbitrary sets of ", rs("entry") , " (and their locally available payloads) into values of a type ", def_parameter({id: "pbsr_fingerprint", singular: "Fingerprint"}), " via a function ", def_parameter({id: "pbsr_fp", singular: "fingerprint"}), ". In order to allow for certain efficient implementation techniques, ", r("pbsr_fp"), " is not an arbitrary protocol parameter but is constructed from some other protocol parameters."),

            pinformative("First, we require a function ", def_parameter({id: "pbsr_fp_singleton", singular: "fingerprint_singleton"}), " that hashes pairs of individual ", rs("entry"), " and the number of available consecutive payload bytes from the start of the payload into the set ", r("pbsr_fingerprint"), ". This hash function should take into account all aspects of the entry: modifying its ", r("namespace_id"), ", ", r("subspace_id"), ", ", r("path"), ", ", r("timestamp"), ", ", r("entry_length"), ", ", r("entry_hash"), ", or the number of available bytes should result in a completely different ", r("entry_fingerprint"), "."),

            pinformative("Second, we require an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), ", ", link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), " function ", def_parameter({id: "pbsr_fp_combine", singular: "fingerprint_combine"}), " that maps two ", rs("pbsr_fingerprint"), " to a single new ", r("pbsr_fingerprint"), ", with a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " ", def({id: "pbsr_neutral", singular: "fingerprint_neutral"}), "."),

            pinformative("Given these protocol parameters, the function ", r("pbsr_fp"), " is defined as follows:"),

            lis(
                ["applying ", r("pbsr_fp"), " to the empty set yields ", r("pbsr_neutral"), ","],
                ["applying ", r("pbsr_fp"), " to a set containing exactly one ", r("entry"), " ", code("e"), " whose first ", code("l"), " payload bytes are available yields ", code(r("pbsr_fp_singleton"), "(e, l)"), ", and"],
                ["applying ", r("pbsr_fp"), " to any other set of ", rs("entry"), " and the lengths of their locally available payloads yields the result of applying ", r("pbsr_fp_singleton"), " to all members of the set individually and then combining the resulting ", rs("entry_fingerprint"), " with ", r("pbsr_fp_combine"), " (grouping and ordering do not matter because of associativity and commutativity respectively)."],
            ),
        ]),
    ],
);

import { def } from "../../../defref.ts";
import { p } from "../../../h.ts";
import { Expression } from "../../../tsgen.ts";
import { site_template } from "../../main.ts";

export const product_based_set_reconciliation: Expression = site_template(
    {
        title: "Product-Based Set Reconciliation",
        name: "product_based_set_reconciliation",
    },
    [
        p("wip"),
        def({ id: "pbsr", singular: "product-based set reconciliation"}),
        def({ id: "entry_fingerprint", singular: "fingerprint"}),
    ],
);

// ### Product-Based Set Reconciliation

// The WGPS allows peers to employ a variant of [range-based set reconciliation](TODO) to efficiently synchronize their data. Suppose Alfie and Betty have exchanged areas of interest, and they found a non-empty intersection between two of them. Call this intersection the *aaoi* (the *actual area of interest*). The simplemost reconciliation protocol consists of Alfie sending all his entries in the aaoi, and Betty responding with everything else she has.

// This is inefficient if the *aaoi* is large but Alfie's and Betty's local copies differ by only a small number of entries. The general idea of the **product-based set reconciliation** of the WGPS is to instead have Alfie send a small fingerprint over all his entries in the *aaoi*. Upon receiving this fingerprint, Betty computes the fingerprint over all of *her* entries in the *aaoi*. If the fingerprints match, she can conclude that no further data exchange is necessary.

// Otherwise, Betty splits the *aaoi* into two smaller 3d products (call them *sub1* and *sub2*) that contain roughly half of her entries (from the *aaoi*) each and whose union gives the original *aaoi* again. Then she computes the fingerprints of all entries in *sub1* and sends both *sub1* (the ranges that make up the 3d product, not its entries) and the fingerprint to Alfie. This combination of a 3d product and a fingerprint is called a **product fingerprint**. She also sends the *product fingerprint* for *sub2*. Note that the initial mesage where Alfie sent his fingerprint for the *aaoi* has been a *product fingerprint* as well.

// When Alfie receives these *product fingerprints*, he can handle them in exactly the same way: he computes his local fingerprint over the same 3d product, compares the fingerprints, knows that no further work was necessary if they are equal, and otherwise processes the product by splitting it.

// At any point, a peer can opt to send a **product item set** instead of a *product fingerprint*. A *product items set* consists of a 3d product, the set of all entries that the peer has within that product, and a boolean flag to indicate whether the other peer should reply with its *product item set* for the same 3d product as well. Such a reply should *not* set that flag, and it should not contain any of the entries that were part of the *product item set* that it is replying to.

// By recursively splitting *product fingerprints*, the peers can drill down to the subareas where actual reconciliation (by exchanging *product item sets*) is required. Note that the peers need not agree on when to switch from *product fingerprints* to *product item sets*, or into how many *product fingerprints* to subdivide in each recursion step. As long as they both make some kind of progress on every *product fingerprint* they receive, they will successfully reconcile their entries.

// The WGPS does not even enforce any hierarchy between successive reconciliation messages. It is up to the peers to initiate and react to the reconciliation messages in any way they see fit.

// <aside class="long">

// The tricky part is that Alfie might receive a new entry in some *aaoi* from Gemma *while* performing product-based set reconciliation for this *aaoi* with Betty. If Alfie has not yet sent a *product items set* for a product containing the new entry, no further action is required, reconciliation is self-stabilizing in that scenario. But if Alfie has already sent a *product items set* for a product containing that new entry, Alfie needs to take action to ensure the new entry makes it to Betty.

// Alfie can immediately transmit such entries to Betty. If the communication channel is too slow to keep up with such entries, Alfie needs to buffer these entries however. The recommended procedure is for Alfie to keep a queue of bounded capacity in which he inserts all entries that he needs to specifically transmit to Betty. If the queue capacity does not suffice to keep track of all entries that require transmission, Alfie gives up on tracking the entries. Once reconciliation has finished, he simply initiates reconciliation for the same product again.

// Alfie and Betty repeat reconciliation sessions until they manage to complete a session without a queue overflow. Once they have reached that state, they can immediately push any future entries they might receive to each other (except those received from the other of course). If at any point one of them receives entries faster than they can be forwarded again, that peer can again keep them in a queue, and initiate a new reconciliation pass if that queue overflows.
// </aside>

// <!-- Product-based set reconciliation requires the ability to hash arbitrary sets of entries into values of a type `Fingerprint` via a function `fingerprint(Set<Entry>) -> Fingerprint`. In order to allow for certain efficient implementation techniques, `fingerprint` is not an arbitrary protocol parameter but is constructed from some other protocol parameters.

// First, we require a function `fingerprint_singleton(Entry) -> Fingerprint` that hashes an individual entry into the set `Fingerprint`. This hash function should take into account all aspects of the entry: modifying its *namespace ID*, *subspace ID*, *path*, *timestamp*, *length*, or *hash* should result in a completely different fingerprint.

// <aside>The original paper on range-based set reconciliation does not require commutativity, because it only deals with one-dimensional data. In a multidimensional setting, there is no natural total ordering on the data space, so we cannot constrain the order in which the fingerprints of individual items are combined to a non-arbitrary order.</aside>

// Second, we require an [associative](https://en.wikipedia.org/wiki/Associative_property), [commutative](https://en.wikipedia.org/wiki/Commutative_property) function `fingerprint_combine(Fingerprint, Fingerprint) -> Fingerprint` with a [neutral element](https://en.wikipedia.org/wiki/Identity_element) `fingerprint_neutral`.

// Given these protocol parameters, the function `fingerprint` is defined as follows:

// - applying `fingerprint` to the empty set yields `fingerprint_neutral`,
// - applying `fingerprint` to a set containing exactly one entry `e` yields `fingerprint_singleton(e)`, and
// - applying `fingerprint` to any other set yields the result of applying `fingerprint_singleton` to all members of the set individually and then combining the resulting fingerprints with `fingerprint_combine` (grouping and ordering do not matter because of associativity and commutativity respectively). -->
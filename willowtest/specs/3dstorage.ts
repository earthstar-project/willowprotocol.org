import {
    aside_block,
        def_value,
        link,
        lis,
        path,
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
import { marginale, marginale_inlineable, sidenote } from "../../marginalia.ts";
import { Expression } from "../../tsgen.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { function_call } from "../../pseudocode.ts";

export const threedstorage: Expression = site_template({
name: "3dstorage",
title: "Three-Dimensional Data Storage",
}, [
    pinformative("Most peers will wish to (persistently) store ", rs("Entry") , ". In this document, we give a bit of context on this task, because it turns out to be quite tricky. We cannot give any definite solutions or even a full picture, but we can give some initial pointers to bootstrap a more thorough immersion in the problem space."),

]);
    
// # Partial Sync in Willow

// One of the goals of willow is expressive yet efficient partial replication. Turns out there are some challenges associated with that.

// Willow organizes arbitrary payloads in three dimensions: path, author, and timestamp. Once you start thinking about the data as points in a three-dimensional space, there is a fairly natural choice of granularity for partial replication. Peers exchange sets of rectangular cuboids that indicate which parts of the space they care about ("I only care about  records at paths between `/foo/bar` and `/fooa`, created before time `3000`, by any author; also about everything created after time `4000`."). The volumes which *both* peers care about are again rectangular cuboids, and the peers then sync only the data they have in those shared cuboids. So in order to do partial sync, we first need to figure out how to sync an individual given rectangular cuboid.

// The good news is that such cuboids are also the default form of queries that apps would make to the willow database, so efficiently obtaining all the data in a cuboid is something we need to solve anyways. The bad news is that it's still a difficult problem for the database layer, and that it seems to be difficult to find a vocabulary by which the sync protocol talks about those cuboids which does not prescribe certain implementation choices for the database layer.

// Our three-dimensional willowverse is a quite peculiar space. Authors are public keys and as such essentially integers of bounded width, but their ordering is mostly meaningless. You would rarely say "I only care about records whose author has a pulic key that is numerically greater than or equal to `725654685534534` and less than `725654936751132`", although such ranges might appear as an implementation detail of data structures or replication techniques. Timestamps are a more traditional dimension, 64-bit unsigned integers with a meaningful order. We do know however that for a given pair of path and author, only a single timestamp exists - a constraint we might want to leverage for optimization. And finally, paths are lexicographically sorted strings of bounded length. Since willow allows to set the bound of that length arbitrarily high, a useful shortcut is to think of them as a strings of arbitrary length. Unlike author and timestamp, that means that between any pair of paths lie infinitely many other paths - the path dimension is [dense](https://en.wikipedia.org/wiki/Dense_order) (but still [discrete](https://en.wikipedia.org/wiki/Discrete_mathematics)) when assuming unbounded length. This heterogenity and the effectively dense dimension rule out some off-the-shelf solutions to data storage.

// There are also dark rumors of a fourth dimension, the *namespace*, but for this write-up I will assume that namespaces are handled at a different part of the system(s). Treating the namespace as a regular dimension leads down a route of privacy-preserving multidimensional range intersections, a subfield of cryptography that doesn't even exist yet (please prove me wrong if you know of something beyond generic [2PC](https://en.wikipedia.org/wiki/Secure_two-party_computation) approaches).

// Data structures for efficient multi-dimensional range queries are a surprisingly tricky topic, with a large number of options (particularly for low-dimensional cases like ours) with different trade-offs. Unlike the one-dimensional case where self-balancing search trees provide acceptable worst-case bounds, multi-dimensional data structures rely on heuristics for the most part. For a more thorough introduction, I recommend chapter 16 of the [Handbook of Data Structures and Applications](https://www.google.com/search?q=handbook+of+data+structures+and+applications+pdf) (chapter 55 and most of section IV are quite informative on this topic as well).

// [Octrees](https://en.wikipedia.org/wiki/Octree) recursively split the space into eight subspaces of equal size until every subspace contains exactly one data point. This can lead to deep tree structures for points that lie close together but whose coordinate takes many bits to represent. Willow paths are highly likely to trigger that behavior (think `/somelongpath/a` and `/somelongpath/b`), ruling out octrees (and pretty much all techniques based on partitioning space independent of the date of distribution).

// [K-D trees](https://en.wikipedia.org/wiki/K-d_tree) are a natural choice in theory, but balancing and/or space utilization can degrade. Any practically useful variation, like the [Bkd-trees](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=7c0b56504aef0a908f6dcb5d916aa1268f716443) are rather complicated.

// [R-trees](https://en.wikipedia.org/wiki/R-tree) are the basis for most "real" systems as far as I can tell, the canonic choice being a [R*-tree](https://en.wikipedia.org/wiki/R*-tree). As with the kd-tree family of solutions, there exist many heuristics and optimizations.

// Another option is to maintain several (three) one-dimensional search trees of the data set, each using different linearizations of the three dimensions: one sorts by author first, using paths as tiebreakers, and using timestamps as final tiebreaker; the next has path first, timestamp second, author third; the last has timestamp first, author second, path third. Every cuboid query can be efficiently answered by one of those trees, regardless of which dimensions are left unconstrained. This pattern is fairly common for [RDF triple stores](https://en.wikipedia.org/wiki/Triplestore), used for example by the [Rya store](https://www.csd.uoc.gr/~hy561/papers/storageaccess/largescale/Rya-%20A%20Scalable%20RDF%20Triple%20Store%20for%20the%20Clouds.pdf).

// [UB-trees](https://en.wikipedia.org/wiki/UB-tree) linearize the multidimensional data according to its [Z-order](https://en.wikipedia.org/wiki/Z-order_curve) (or alternatively [Hilbert order](https://en.wikipedia.org/wiki/Hilbert_curve)) and store it in a search tree. Cuboid queries can be answered in logarithmic time most of the time, although the theoretical worst-case behavior is worse.

// None of these is ideal, but all (excluding octrees) are feasible in principle. Willow has two additional constraints on the choice of data structure. First, we will not have the resources to "properly" implement any of these from scratch. We'll likely implement a tree on top of either sqlite or a key-value store (and by "tree" I mean "tree or skip-llist"). Such implementations are less efficient than implementations that talk directly to a file system or disk, but they should be sufficiently performed for a first version.

// The second constraint is compatibility with the [range-based set reconciliation](https://arxiv.org/pdf/2212.13567.pdf) approach. All of these trees are easily extended to summarize the required monoid metadata. For the true multi-dimensional approaches (k-d trees and R-trees), the monoid must be commutative, but that's fine.

// On the communication protocol side of things, I see two possibilities for doing multi-dimensional range-based reconciliation. The natural option is to use rectangular cuboids for range item sets and range fingerprints. The other option is to do one-dimensional reconciliation but filtering out everything outside the cuboid in question. The first option works well for k-d trees and R-trees, whereas the triple tree solution and UB-trees suggest using the second option. The latter would be easier to implement, but the first option is arguably the "right way" of doing things. I'm still in the process of figuring out which of the data structures can support both kinds of conciliation protocols. Ideally, the protocol should not prescribe any particular type of data structure.
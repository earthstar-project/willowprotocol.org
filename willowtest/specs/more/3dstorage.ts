import {
        link,
        lis,
        pinformative,
        site_template,
      } from "../../main.ts";

import { r, rs } from "../../../defref.ts";
import { sidenote } from "../../../marginalia.ts";
import { Expression } from "../../../tsgen.ts";
import { hsection } from "../../../hsection.ts";
import { link_name } from "../../../linkname.ts";
import { em } from "../../../h.ts";

export const threedstorage: Expression = site_template({
name: "d3storage",
title: "Three-Dimensional Data Storage",
}, [
    pinformative(em("Author’s note: this is one of the more esoteric documents on this site, and presumes a cosy familiarity with the ", link_name('specifications', "Willow specifications"), " for any of it to be useful.")),
    
    pinformative("Most implementations of Willow will centre around a (persistent) database of ", rs("Entry") , ". In this document, we give some context on building such a data store. We cannot possibly give a complete account, think of this document more as a tour guide to an extensive, partially unexplored rabbit hole."),

    hsection("d3storage_requirements", "Requirements", [
        pinformative("The difficult part in storing any kind of data is to enable efficient access and manipulation. The patterns of data access that a Willow implementation needs to support are primarily determined by two factors: how do applications access the data, and how do several data stores sync their contents?"),

        pinformative("The bare minimum functionality that a Willow database has to provide to applications is the creation of new ", rs("Entry"), ", and retrieval of ", rs("Payload"), " by ", r("Entry"), ". The ", link_name("grouping_entries", "three-dimensionality"), " of Willow suggests a natural way for applications to access data in bulk: by querying for all ", rs("Entry"), " in an ", sidenote(r("Area"), [
            "Queries for ", rs("D3Range"), " are not particularly meaningful in the face of end-to-end encrypted data; we recommend to always use ", rs("Area"), " in human-facing components such as programming APIs.",
        ]), "."),

        pinformative("As for the requirements of syncing, we shall use the ", link_name("sync", "WGPS"), " as a (somewhat demanding) baseline. The WGPS needs to compute ", rs("Fingerprint"), " for arbitrary ", rs("D3Range"), ", to split arbitrary ", rs("D3Range"), " into multiple, roughly equally-sized subranges, and to constrain ", rs("Area"), " to a number of newest ", rs("Entry"), " (to work with ", rs("AreaOfInterest"), ")."),

        pinformative("This gives us a fairly compact feature set, revolving around spatially constrained access to a three-dimensional arrangement of ", rs("Entry"), "."),
    ]),

    hsection("d3storage_multidimensions", "Multidimensional Data Structures", [
        pinformative("Multidimensional search data structures have been studied for decades, whether in database research, computer graphics, geoinformatics, or several other fields of computer science. The bad news is that — unlike one-dimensional search data structures such as self-balancing search trees — no one-size-fits-all data structures with acceptable worst-case complexity profiles are known. The good news, however, is that this has not stopped decades worth of engineering power to develop systems that easily satisfy all practical requirements."),

        pinformative("Unfortunately, Willow requires some features not found in off-the-shelf solutions. While there exist several solutions for managing and querying multidimensional data indexed by fixed-width integers or floating point numbers, lexicographically sorted strings of strings (i.e., ", rs("Path"), ") are a different beast. ", r("Fingerprint"), " aggregation is another feature you will not find in SQLite."),

        pinformative("Hence, we now give pointers to some standard implementation techniques for multi-dimensional data structures. For more in-depth introductory coverage, we recommend part four of the Handbook of Data Structures and ", sidenote("Applications", [link(`Mehta, Dinesh P., and Sartaj Sahni. Handbook of data structures and applications. Chapman and Hall/CRC, 2004.`, "https://bjpcjp.github.io/pdfs/math/book-Data_Structures_and_Apps-DSA.pdf#page=311")]), "."),

        lis(
            [
                link("Octrees", "https://en.wikipedia.org/wiki/Octree"), " recursively split three-dimensional volumes into eight equally-sized sub-volumes, until every leaf volume contains at most one data point. This can lead to deep tree structures for points that lie close together but whose coordinates take many bits to represent. ", rs("Path"), " are fairly likely to trigger these cases, so octrees (and any other space-partitioning techniques) should be enjoyed with caution.",
            ],
            [
                link("K-D trees", "https://en.wikipedia.org/wiki/K-d_tree"), " are search-trees where each node splits items along a single dimension, cycling through the different dimensions based on the depth of the nodes. Unlike one-dimensional search trees, balancing and space utilisation of K-D trees tend to degrade over time. Practically useful variations, such as ", sidenote("Bkd-trees", [link(`Procopiuc, Octavian, et al. "Bkd-tree: A dynamic scalable kd-tree." Advances in Spatial and Temporal Databases: 8th International Symposium, SSTD 2003, Santorini Island, Greece, July 2003. Proceedings 8. Springer Berlin Heidelberg, 2003.`, "https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=7c0b56504aef0a908f6dcb5d916aa1268f716443")]), " can quickly become rather complicated.",
            ],
            [
                link("R-trees", "https://en.wikipedia.org/wiki/R-tree"), " arrange data in a containment hierarchy of minimum bounding boxes. Their performance hinges on heuristic choices in maintaining the containment hierarchy under insertions and deletions, with ", link("R*-rtees", "https://en.wikipedia.org/wiki/R*-tree"), " being a popular, efficient choice."
            ],
            [
                "A more simplistic option is to maintain three one-dimensional search trees of the same ", r("Entry"), " set, each using different linearisations of the three dimensions: one sorts by ", r("entry_subspace_id"), " first, using ", rs("entry_path"), " as tiebreakers, and using ", rs("entry_timestamp"), " as final tiebreaker; the next tree has ", rs("entry_path"), " first, ", rs("entry_timestamp"), " second, ", r("entry_subspace_id"), " third; the final tree has ", rs("entry_timestamp"), " first, ", r("entry_subspace_id"), " second, ", rs("entry_path"), " third. This technique is often used by ", link("RDF triple stores", "https://en.wikipedia.org/wiki/Triplestore"), ", for example by the Rya ", sidenote("store", [link(`Punnoose, Roshan, Adina Crainiceanu, and David Rapp. "Rya: a scalable RDF triple store for the clouds." Proceedings of the 1st International Workshop on Cloud Intelligence. 2012.`, "https://www.csd.uoc.gr/~hy561/papers/storageaccess/largescale/Rya-%20A%20Scalable%20RDF%20Triple%20Store%20for%20the%20Clouds.pdf")]), ".",
            ],
            [
                link("UB-trees", "https://en.wikipedia.org/wiki/UB-tree"), " linearise multidimensional data according to its ", link("Z-order", "https://en.wikipedia.org/wiki/Z-order_curve"), " (or, alternatively, its ", link("Hilbert order", "https://en.wikipedia.org/wiki/Hilbert_curve"), "), and then store it in a one-dimensional search tree. The theoretical worst-case behavior is subpar, but in practise, these data structures perform well on reasonably distributed data.",
            ],
        ),

        pinformative("All of these data structures are tree-based, so they can readily be adapted to store the ", rs("Fingerprint"), " of the items of each subtree in every tree node, hence allowing for efficient ", r("Fingerprint"), " computation. Similarly, storing the total number of items in each node allows for efficiently working with ", rs("AreaOfInterest"), ", and can guide the splitting of ", rs("D3Range"), " for set reconciliation. Adopting the corresponding one-dimensional algorithms to the multidimensional tree structures is far from trivial, but ultimately doable. At the end of the day, a Willow implementation will thus rise and fall with the quality of its three-dimensional range queries."),

        pinformative("Engineering a three-dimensional data store is no easy feat, but the existence of numerous production-quality systems for working with multidimensional data shows that it is feasible. The whole design of Willow rests on this assumption, as well as on the assumption that three-dimensional data organisation suffices for building useful applications. While knowing full well that most contemporary peer-to-peer projects settle for more simple and less expressive data models, we believe that Willow hits a sweet(er) spot between expressivity and implementability."),
    ]),

    hsection("d3storage_beginning", "Just the Beginning...", [
        pinformative("Three-dimensional storage lies at the heart of a performant Willow database, but any implementation effort must ask several further questions. How do applications interface with the data store? Can they subscribe to updates in real time? Or even request replays of changes after reconnecting to the database after a longer time span? Who controls which payloads should be requested, persisted, deleted? Can applications issue atomic transactions? Should there be indexes for efficient access beyond the three-dimensional data model, based on payload contents?"),

        pinformative("Each of these questions is an exciting project on its own, and we are committed to exploring them further."),
    ]),

]);

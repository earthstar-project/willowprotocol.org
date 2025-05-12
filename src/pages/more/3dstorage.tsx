import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, I, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { Bib } from "macromania-bib/mod.tsx";

export const threedstorage = (
  <Dir name="3dstorage">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Three-Dimensional Data Storage"
        headingId="d3storage"
        heading={"Three-Dimensional Data Storage"}
        bibliography
      >
        <P>
          <Em>
            Author’s note: this is one of the more esoteric documents on this
            site, and presumes a cosy familiarity with the{" "}
            <R n="specifications">Willow specifications</R>{" "}
            for any of it to be useful.
          </Em>
        </P>

        <P>
          Most implementations of Willow will centre around a (persistent)
          database of{" "}
          <Rs n="Entry" />. In this document, we give some context on building
          such a data store. We cannot possibly give a complete account, think
          of this document more as a tour guide to an extensive, partially
          unexplored rabbit hole.
        </P>

        <Hsection n="d3storage_requirements" title="Requirements">
          <P>
            The difficult part in storing any kind of data is to enable
            efficient access and manipulation. The patterns of data access that
            a Willow implementation needs to support are primarily determined by
            two factors: how do applications access the data, and how do several
            data stores sync their contents?
          </P>

          <P>
            The bare minimum functionality that a Willow database has to provide
            to applications is the creation of new{" "}
            <Rs n="Entry" />, and retrieval of <Rs n="Payload" /> by{" "}
            <R n="Entry" />. The{" "}
            <R n="grouping_entries">three-dimensionality</R>{" "}
            of Willow suggests a natural way for applications to access data in
            bulk: by querying for all <Rs n="Entry" /> in an{" "}
            <Sidenote
              note={
                <>
                  Queries for <Rs n="D3Range" />{" "}
                  are not particularly meaningful in the face of end-to-end
                  encrypted data; we recommend to always use <Rs n="Area" />
                  {" "}
                  in human-facing components such as programming APIs.
                </>
              }
            >
              <R n="Area" />
            </Sidenote>.

            <P>
              As for the requirements of syncing, we shall use the{" "}
              <R n="sync">WGPS</R>{" "}
              as a (somewhat demanding) baseline. The WGPS needs to compute{" "}
              <Rs n="Fingerprint" /> for arbitrary{" "}
              <Rs n="D3Range" />, to split arbitrary <Rs n="D3Range" />{" "}
              into multiple, roughly equally-sized subranges, and to constrain
              {" "}
              <Rs n="Area" /> to a number of newest <Rs n="Entry" />{" "}
              (to work with <Rs n="AreaOfInterest" />).
            </P>

            <P>
              This gives us a fairly compact feature set, revolving around
              spatially constrained access to a three-dimensional arrangement of
              {" "}
              <Rs n="Entry" />.
            </P>
          </P>
        </Hsection>

        <Hsection
          n="d3storage_multidimensions"
          title="Multidimensional Data Structures"
        >
          <P>
            Multidimensional search data structures have been studied for
            decades, whether in database research, computer graphics,
            geoinformatics, or several other fields of computer science. The bad
            news is that — unlike one-dimensional search data structures such as
            self-balancing search trees — no one-size-fits-all data structures
            with acceptable worst-case complexity profiles are known. The good
            news, however, is that this has not stopped decades worth of
            engineering power to develop systems that easily satisfy all
            practical requirements.
          </P>

          <P>
            Unfortunately, Willow requires some features not found in
            off-the-shelf solutions. While there exist several solutions for
            managing and querying multidimensional data indexed by fixed-width
            integers or floating point numbers, lexicographically sorted strings
            of strings (i.e., <Rs n="Path" />) are a different beast.{" "}
            <R n="Fingerprint" />{" "}
            aggregation is another feature you will not find in SQLite.
          </P>

          <P>
            Hence, we now give pointers to some standard implementation
            techniques for multi-dimensional data structures. For more in-depth
            introductory coverage, we recommend part four of the{" "}
            <I>Handbook of Data Structures and Applications</I>
            <Bib item="mehta2004handbook" />.
          </P>

          <Ul>
            <Li>
              <AE href="https://en.wikipedia.org/wiki/Octree">Octrees</AE>{" "}
              recursively split three-dimensional volumes into eight
              equally-sized sub-volumes, until every leaf volume contains at
              most one data point. This can lead to deep tree structures for
              points that lie close together but whose coordinates take many
              bits to represent. <Rs n="Path" />{" "}
              are fairly likely to trigger these cases, so octrees (and any
              other space-partitioning techniques) should be enjoyed with
              caution.
            </Li>

            <Li>
              <AE href="https://en.wikipedia.org/wiki/K-d_tree">K-D trees</AE>
              {" "}
              are search-trees where each node splits items along a single
              dimension, cycling through the different dimensions based on the
              depth of the nodes. Unlike one-dimensional search trees, balancing
              and space utilisation of K-D trees tend to degrade over time.
              Practically useful variations, such as
              Bkd-trees<Bib item="procopiuc2003bkd" />{" "}
              can quickly become rather complicated.
            </Li>

            <Li>
              <AE href="https://en.wikipedia.org/wiki/R-tree">R-trees</AE>{" "}
              arrange data in a containment hierarchy of minimum bounding boxes.
              Their performance hinges on heuristic choices in maintaining the
              containment hierarchy under insertions and deletions, with{" "}
              <AE href="https://en.wikipedia.org/wiki/R*-tree">R*-trees</AE>
              {" "}
              being a popular, efficient choice.
            </Li>

            <Li>
              A more simplistic option is to maintain three one-dimensional
              search trees of the same <R n="Entry" />{" "}
              set, each using different linearisations of the three dimensions:
              one sorts by <R n="entry_subspace_id" /> first, using{" "}
              <Rs n="entry_path" /> as tiebreakers, and using{" "}
              <Rs n="entry_timestamp" /> as final tiebreaker; the next tree has
              {" "}
              <Rs n="entry_path" /> first, <Rs n="entry_timestamp" /> second,
              {" "}
              <R n="entry_subspace_id" /> third; the final tree has{" "}
              <Rs n="entry_timestamp" /> first, <R n="entry_subspace_id" />{" "}
              second, <Rs n="entry_path" />{" "}
              third. This technique is often used by{" "}
              <AE href="https://en.wikipedia.org/wiki/Triplestore">
                RDF triple stores
              </AE>, for example by the Rya store<Bib item="punnoose2012rya" />.
            </Li>

            <Li>
              <AE href="https://en.wikipedia.org/wiki/UB-tree">UB-trees</AE>
              {" "}
              linearise multidimensional data according to its{" "}
              <AE href="https://en.wikipedia.org/wiki/Z-order_curve">
                Z-order
              </AE>{" "}
              (or, alternatively, its{" "}
              <AE href="https://en.wikipedia.org/wiki/Hilbert_curve">
                Hilbert order
              </AE>, and then store it in a one-dimensional search tree. The
              theoretical worst-case behavior is subpar, but in practise, these
              data structures perform well on reasonably distributed data.
            </Li>
          </Ul>

          <P>
            All of these data structures are tree-based, so they can readily be
            adapted to store the <Rs n="Fingerprint" />{" "}
            of the items of each subtree in every tree node, hence allowing for
            efficient <R n="Fingerprint" />{" "}
            computation. Similarly, storing the total number of items in each
            node allows for efficiently working with{" "}
            <Rs n="AreaOfInterest" />, and can guide the splitting of{" "}
            <Rs n="D3Range" />{" "}
            for set reconciliation. Adopting the corresponding one-dimensional
            algorithms to the multidimensional tree structures is far from
            trivial, but ultimately doable. At the end of the day, a Willow
            implementation will thus rise and fall with the quality of its
            three-dimensional range queries.
          </P>

          <P>
            Engineering a three-dimensional data store is no easy feat, but the
            existence of numerous production-quality systems for working with
            multidimensional data shows that it is feasible. The whole design of
            Willow rests on this assumption, as well as on the assumption that
            three-dimensional data organisation suffices for building useful
            applications. While knowing full well that most contemporary
            peer-to-peer projects settle for more simple and less expressive
            data models, we believe that Willow hits a sweet(er) spot between
            expressivity and implementability.
          </P>
        </Hsection>

        <Hsection n="d3storage_beginning" title="Just the Beginning...">
          <P>
            Three-dimensional storage lies at the heart of a performant Willow
            database, but any implementation effort must ask several further
            questions. How do applications interface with the data store? Can
            they subscribe to updates in real time? Or even request replays of
            changes after reconnecting to the database after a longer time span?
            Who controls which payloads should be requested, persisted, deleted?
            Can applications issue atomic transactions? Should there be indexes
            for efficient access beyond the three-dimensional data model, based
            on payload contents?
          </P>

          <P>
            Each of these questions is an exciting project on its own, and we
            are committed to exploring them further.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);

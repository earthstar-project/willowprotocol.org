import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Img, Li, P, Ul } from "macromania-html";
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

export const data_model = (
  <Dir name="data-model">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Data Model"
        headingId="data_model"
        heading={"Data Model"}
        status="final"
        toc
      >
        <P>
          <Alj inline>TODO: introductory text</Alj>

          Here is an example Path macro usage:{" "}
          <Path components={["blog", "idea", "1"]} />.

          And an example image:

          <Img
            src={<ResolveAsset asset={["data_model", "paths.png"]} />}
            alt={`A (one-dimensional) list containing the two paths "blog/idea/1" and "blog/idea/2", with a stylised file next to each path. Idea 1 shows a lightbulb, idea 2 shows a deeply smug expression.`}
          />
        </P>
{/* 
        pinformative("Willow is a system for giving meaningful, hierarchical names to arbitrary sequences of bytes (called ", em("payloads"), "), not unlike a filesystem. For example, you might give the name ", path("blog", "idea", "1"), " to the bytestring ", code("Dear reader, I've got a great idea"), "."),

pinformative("You also give the name ", path("blog", "idea", "2"), " to the bytestring ", code("(watch this space)"), "."),

figure(img(asset("data_model/paths.png"), `A (one-dimensional) list containing the two paths "blog/idea/1" and "blog/idea/2", with a stylised file next to each path. Idea 1 shows a lightbulb, idea 2 shows a deeply smug expression.`)),

pinformative("A little later you overwrite the existing entry at path ", path("blog", "idea", "2"), " with ", code("I've made a mistake"), ". Willow tracks the timestamp of each assignment, and the new entry overwrites the old one."),

figure(img(asset("data_model/timestamps.png"), "The same visualization of paths as before, but now with second dimension, a time axis. The smug-faced file disappears in the first time step, being replaced by a sweating face at a second timestep.")),

pinformative("That night you decide it would be best if everyone forgot about the whole thing. By writing a new entry at ", path("blog", "idea"), ", our previous entries are deleted. Think of it as overwriting a directory in a file system with an empty file. We call this mechanism ", def({id: "prefix_pruning", singular: "prefix pruning"}), "."),

figure(
  img(asset("data_model/prefix_pruning.png"), `The same visualization as before, but both paths and files got deleted by adding the third path "blog/idea" with a stylised file whistling in a totally inconspicuous way.`),
  figcaption("The entries ", em("prefixed"), " by ", path('blog', 'idea'), " are deleted by a newer entry at that prefix.")
),

pinformative("Things would be rather chaotic if everyone wrote to the same blog. Instead, entries live in separate ", em("subspaces"), " — intuitively, each user writes to their own, separate universe of data. Willow allows for various ways of controlling who gets to write to which subspace, from simple per-user access control to sophisticated capability systems."),

figure(
  img(asset("data_model/subspaces.png"), `Stylised files with friendly icons arranged in a now three-dimensional space. Adding to the path and time dimensions of the preceeding drawings, a depth dimension shows three different people to signify different subspaces. They look happy, one waves to the viewer, good vibes all around.`),
  figcaption("The three dimensions of Willow’s data model: paths, timestamps, and subspaces.")
),

pinformative("Willow further allows the aggregation of subspaces into completely independent ", em("namespaces"), ". Data from a public wiki should live in a separate namespace than data from a photo-sharing application for my family. Some namespaces should allow anyone to set up subspaces within them, others might require authorisation from a trusted manager. Willow offers a flexible mechanism for using different policies on a per-namespace basis."),

figure(
  img(asset("data_model/namespaces.png"), `Three simplified three-dimensional visualisations of namespaces, each shaded in a different color. One is labeled "family", one "wiki", and one "project".`),
  figcaption("Three completely independent namespaces.")
),

pinformative("This constitutes a full overview of the data model of Willow. Applications read and write payloads from and to subspaces, addressing via hierarchical paths. Willow tracks timestamps of write operations, newer writes replace older writes in the manner of a traditional file system. These data collections live in namespaces; read and write access to both namespaces and subspaces can be controlled through a variety of policies."),

pinformative( "Now we can ", em("almost"), " delve into the precise definition of these concepts."),
*/}

        <Hsection n="willow_parameters" title="Parameters">
          <P>
            <Alj inline>TODO: introductory text</Alj>
          </P>
{/* 
          pinformative("Some questions in protocol design have no clear-cut answer. Should namespaces be identified via human-readable strings, or via the public keys of some digital signature scheme? That depends entirely on the use-case. To sidestep such questions, the Willow data model is ", em("generic"), " over certain choices of parameters. You can instantiate Willow to use strings as the identifiers of namespaces, or you could have it use 256 bit integers, or urls, or iris scans, etc."),

pinformative("This makes Willow a higher-order protocol: you supply a set of specific choices for its parameters, and in return you get a concrete protocol that you can then use. If different systems instantiate Willow with non-equal parameters, the results will not be interoperable, even though both systems use Willow."),
*/}


          <P>
            <Marginale>
              We give precise semantics to these parameters in the spec proper,
              the list need not fully make sense on the first read-through.
            </Marginale>
            An instantiation of Willow must define concrete choices of the
            following parameters:
          </P>

          <Ul>
            <Li>
              A type{" "}
              <DefType
                n="NamespaceId"
                rs="NamespaceIds"
                preview={
                  <P>
                    A protocol parameter of Willow, the type of{" "}
                    <Rs n="entry_namespace_id" />.
                  </P>
                }
              />{" "}
              for identifying namespaces.
            </Li>
            <Li>
              A type{" "}
              <DefType
                n="SubspaceId"
                rs="SubspaceIds"
                preview={
                  <P>
                    A protocol parameter of Willow, the type of{" "}
                    <Rs n="entry_subspace_id" />.
                  </P>
                }
              />{" "}
              for identifying subspaces.
            </Li>
            <Li>
              A natural number{" "}
              <DefValue
                n="max_component_length"
                math="max\\_component\\_length"
                preview={
                  <P>
                    A protocol parameter of Willow, the maximal length of
                    individual <Rs n="Component" />.
                  </P>
                }
              />{" "}
              for limiting the length of path components.
            </Li>
            <Li>
              A natural number{" "}
              <DefValue
                n="max_component_count"
                math="max\\_component\\_count"
                preview={
                  <P>
                    A protocol parameter of Willow, the maximal number of{" "}
                    <Rs n="Component" /> in a single <R n="Path" />.
                  </P>
                }
              />{" "}
              for limiting the number of path components in a single path.
            </Li>
            <Li>
              A natural number{" "}
              <DefValue
                n="max_path_length"
                math="max\\_path\\_length"
                preview={
                  <P>
                    A protocol parameter of Willow, the maximal sum of the
                    lengths of the <Rs n="Component" /> of a single{" "}
                    <R n="Path" /> in bytes.
                  </P>
                }
              />{" "}
              for limiting the overall size of paths.
            </Li>
            <Li>
              A{" "}
              <AE href="https://en.wikipedia.org/wiki/Total_order">
                totally ordered
              </AE>{" "}
              type{" "}
              <DefType
                n="PayloadDigest"
                preview={
                  <P>
                    A protocol parameter of Willow, the totally ordered type of
                    {" "}
                    <Rs n="entry_payload_digest" />.
                  </P>
                }
              />{" "}
              for{" "}
              <AE href="https://en.wikipedia.org/wiki/Content_addressing">
                content-addressing
              </AE>{" "}
              the data that Willow stores.
            </Li>
            <Li>
              <Marginale>
                Since this function provides the only way in which Willow tracks
                payloads, you probably want to use a{" "}
                <AE href="https://en.wikipedia.org/wiki/Secure_hash_function">
                  secure hash function
                </AE>.
              </Marginale>
              A function{" "}
              <DefFunction
                n="hash_payload"
                preview={
                  <P>
                    A protocol parameter of Willow, a function for computing
                    {" "}
                    <Rs n="PayloadDigest" /> from <Rs n="Payload" />.
                  </P>
                }
              />{" "}
              that maps bytestrings (of length at most{" "}
              <M>
                2^<Curly>64</Curly> - 1
              </M>) into <R n="PayloadDigest" />.
            </Li>
            <Li>
              A type{" "}
              <DefType
                n="AuthorisationToken"
                preview={
                  <P>
                    A protocol parameter of Willow, required to define{" "}
                    <Rs n="PossiblyAuthorisedEntry" />.
                  </P>
                }
              />{" "}
              for proving write permission.
            </Li>
            <Li>
              <Marginale>
                <Rb n="meadowcap" />{" "}
                is our bespoke capability system for handling authorisation. But
                any system works, as long as it defines a type of{" "}
                <Rs n="AuthorisationToken" /> and an{" "}
                <R n="is_authorised_write" /> function.
              </Marginale>
              A function{" "}
              <DefFunction
                n="is_authorised_write"
                preview={
                  <P>
                    A protocol parameter of Willow, required to define{" "}
                    <Rs n="AuthorisedEntry" />.
                  </P>
                }
              />{" "}
              that maps an <R n="Entry" /> (defined later) and an{" "}
              <R n="AuthorisationToken" /> to a{" "}
              <R n="Bool" />, indicating whether the{" "}
              <R n="AuthorisationToken" /> does prove write permission for the
              {" "}
              <R n="Entry" />.
            </Li>
          </Ul>
        </Hsection>

        <Hsection n="data_model_concepts" title="Concepts">
          <P>
            Willow can store arbitrary bytestrings of at most{" "}
            <M>
              2^<Curly>64</Curly> - 1
            </M>{" "}
            bytes. We call such a bytestring a{" "}
            <DefType
              n="Payload"
              preview={
                <P>
                  A <DefType fake n="Payload" /> is a bytestring of at most{" "}
                  <M>
                    2^<Curly>64</Curly> - 1
                  </M>{" "}
                  bytes.
                </P>
              }
            />.
          </P>

          <PreviewScope>
            <P>
              A <DefType n="Path" rs="Paths" /> is a sequence of at most{" "}
              <R n="max_component_count" /> many bytestrings, each of at most
              {" "}
              <R n="max_component_length" />{" "}
              bytes, and whose total number of bytes is at most{" "}
              <R n="max_path_length" />. The bytestrings that make up a{" "}
              <R n="Path" /> are called its{" "}
              <DefType n="Component" rs="Components">Components</DefType>.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              A <DefType n="Timestamp" rs="Timestamps" /> is a{" "}
              <R n="U64" />, that is, a natural number between zero (inclusive)
              and{" "}
              <M>
                2^<Curly>64</Curly> - 1
              </M>{" "}
              (exclusive). <Rs n="Timestamp" />{" "}
              are to be interpreted as a time in microseconds since the{" "}
              <AE href="https://en.wikipedia.org/wiki/Unix_epoch">
                Unix epoch
              </AE>.
            </P>
          </PreviewScope>

          <P>
            The metadata associated with each <R n="Payload" /> is called an
            {" "}
            <R n="Entry" />:
          </P>

          <Pseudocode n="entry_definition">
            <StructDef
              comment={
                <>
                  The metadata for identifying a <R n="Payload" />.
                </>
              }
              id={["Entry", "Entry", "Entries"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        The identifier of the <R n="namespace" /> to which the
                        {" "}
                        <R n="Entry" /> belongs.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["namespace_id", "entry_namespace_id"],
                      <R n="NamespaceId" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        The identifier of the <R n="subspace" /> to which the
                        {" "}
                        <R n="Entry" /> belongs.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["subspace_id", "entry_subspace_id"],
                      <R n="SubspaceId" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        The <R n="Path" /> to which the <R n="Entry" />{" "}
                        was written.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [["path", "entry_path"], <R n="Path" />],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        The claimed creation time of the <R n="Entry" />.
                        <Marginale>
                          <Alj inline>TODO fix rendering</Alj>
                          Wall-clock timestamps may come as a surprise. We are
                          cognisant of their limitations, and use them anyway.
                          To learn why, please see{" "}
                          <R n="timestamps_really">Timestamps, really?</R>
                        </Marginale>
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["timestamp", "entry_timestamp"],
                      <R n="Timestamp" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        The length of the <R n="Payload" /> in bytes.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["payload_length", "entry_payload_length"],
                      <R n="U64" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        The result of applying <R n="hash_payload" /> to the
                        {" "}
                        <R n="Payload" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["payload_digest", "entry_payload_digest"],
                      <R n="PayloadDigest" />,
                    ],
                  },
                },
              ]}
            />
          </Pseudocode>

          <PreviewScope>
            <P>
              A{" "}
              <DefType
                n="PossiblyAuthorisedEntry"
                rs="PossiblyAuthorisedEntries"
              />{" "}
              is a pair of an <R n="Entry" /> and an{" "}
              <R n="AuthorisationToken" />. An{" "}
              <DefType n="AuthorisedEntry" rs="AuthorisedEntries" /> is a{" "}
              <R n="PossiblyAuthorisedEntry" /> for which{" "}
              <R n="is_authorised_write" /> returns{" "}
              <Code>true</Code>.<Alj>TODO better inline code tag styling</Alj>
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Marginale>
                <Path components={["a"]} /> is a <R n="path_prefix" /> of{" "}
                <Path components={["a"]} /> and of{" "}
                <Path components={["a", "b"]} />, but not of{" "}
                <Path components={["ab"]} />.
              </Marginale>
              A <R n="Path" /> <DefValue n="prefix_s" r="s" /> is a{" "}
              <Def n="path_prefix" r="prefix" rs="prefixes" /> of a{" "}
              <R n="Path" /> <DefValue n="prefix_t" r="t" /> if the first{" "}
              <Rs n="Component" /> of <R n="prefix_t" /> are exactly the{" "}
              <Rs n="Component" /> of{" "}
              <R n="prefix_s" />. Conversely, we then call <R n="prefix_t" /> an
              {" "}
              <Def n="path_extension" r="extension" rs="extensions" /> of{" "}
              <R n="prefix_s" />. The{" "}
              <Def n="path_difference" r="difference" rs="differences" />{"  "}
              from
              <R n="prefix_s" /> to <R n="prefix_t" /> is the <R n="Path" />
              {" "}
              whose concatenation to <R n="prefix_s" /> yields{" "}
              <R n="prefix_t" />. Any two <Rs n="Path" /> are{" "}
              <Def n="path_related" r="related" /> is one is a <R n="prefix" />
              {" "}
              of the other.
            </P>
          </PreviewScope>

          <P>
            We can now formally define which <Rs n="Entry" />{" "}
            overwrite each other and which can coexist.
          </P>

          <PreviewScope>
            <P>
              An <R n="Entry" /> <DefValue n="new_e1" r="e1" /> is{" "}
              <Def n="entry_newer" r="newer" /> than another <R n="Entry" />
              {" "}
              <DefValue n="new_e2" r="e2" /> if

              <Ul>
                <Li>
                  <Code>
                    <AccessStruct field="entry_timestamp">
                      <R n="new_e2" />
                    </AccessStruct>
                    {" < "}
                    <AccessStruct field="entry_timestamp">
                      <R n="new_e2" />
                    </AccessStruct>
                  </Code>, or
                </Li>
                <Li>
                  <NoWrap>
                    <Code>
                      <AccessStruct field="entry_timestamp">
                        <R n="new_e2" />
                      </AccessStruct>
                      {" == "}
                      <AccessStruct field="entry_timestamp">
                        <R n="new_e2" />
                      </AccessStruct>
                    </Code>
                  </NoWrap>{" "}
                  and{" "}
                  <Marginale>
                    This comparison is why we require <R n="PayloadDigest" />
                    {" "}
                    to be{" "}
                    <AE href="https://en.wikipedia.org/wiki/Total_order">
                      totally ordered
                    </AE>.
                  </Marginale>
                  <NoWrap>
                    <Code>
                      <AccessStruct field="entry_payload_digest">
                        <R n="new_e2" />
                      </AccessStruct>
                      {" < "}
                      <AccessStruct field="entry_payload_digest">
                        <R n="new_e2" />
                      </AccessStruct>
                    </Code>
                  </NoWrap>, or
                </Li>
                <Li>
                  <NoWrap>
                    <Code>
                      <AccessStruct field="entry_timestamp">
                        <R n="new_e2" />
                      </AccessStruct>
                      {" == "}
                      <AccessStruct field="entry_timestamp">
                        <R n="new_e2" />
                      </AccessStruct>
                    </Code>
                  </NoWrap>{" "}
                  and{" "}
                  <NoWrap>
                    <Code>
                      <AccessStruct field="entry_payload_digest">
                        <R n="new_e2" />
                      </AccessStruct>
                      {" == "}
                      <AccessStruct field="entry_payload_digest">
                        <R n="new_e2" />
                      </AccessStruct>
                    </Code>
                  </NoWrap>{" "}
                  and{" "}
                  <NoWrap>
                    <Code>
                      <AccessStruct field="entry_payload_length">
                        <R n="new_e2" />
                      </AccessStruct>
                      {" < "}
                      <AccessStruct field="entry_payload_length">
                        <R n="new_e2" />
                      </AccessStruct>
                    </Code>
                  </NoWrap>.
                </Li>
              </Ul>
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              A <Def n="store" /> is a set of <Rs n="AuthorisedEntry" />{" "}
              such that
            </P>
            <Ul>
              <Li>
                all its <Rs n="Entry" /> have the same{" "}
                <R n="entry_namespace_id" />, and
              </Li>
              <Li>
                there are no two of its <Rs n="Entry" />{" "}
                <DefValue n="store_old" r="old" /> and{" "}
                <DefValue n="store_new" r="new" />
                <Alj>
                  TODO proper fonts for defined values (and other kinds of
                  defined entities as well).
                </Alj>{" "}
                such that
                <Ul>
                  <Li>
                    <NoWrap>
                      <Code>
                        <AccessStruct field="entry_subspace_id">
                          <R n="store_old" />
                        </AccessStruct>
                        {" == "}
                        <AccessStruct field="entry_subspace_id">
                          <R n="store_new" />
                        </AccessStruct>
                      </Code>
                    </NoWrap>, and
                  </Li>
                  <Li>
                    <NoWrap>
                      <Code>
                        <AccessStruct field="entry_path">
                          <R n="store_new" />
                        </AccessStruct>
                      </Code>
                    </NoWrap>{" "}
                    is a <R n="path_prefix" />
                    <Marginale>
                      This is the point where we formally define{" "}
                      <R n="prefix_pruning" />.
                    </Marginale>{" "}
                    of{" "}
                    <NoWrap>
                      <Code>
                        <AccessStruct field="entry_path">
                          <R n="store_old" />
                        </AccessStruct>
                      </Code>
                    </NoWrap>, and
                    <Li>
                      <R n="store_new" /> is <R n="entry_newer" /> than{" "}
                      <R n="store_old" />.
                    </Li>
                  </Li>
                </Ul>
              </Li>
            </Ul>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Marginale>
                When two peers connect and wish to update each other, they
                compute the <Rs n="store_join" /> of all their <Rs n="store" />
                {" "}
                with equal{" "}
                <Rs n="NamespaceId" />. Doing so efficiently and in a
                privacy-preserving way can be quite challenging, we recommend
                our <R n="sync">Willow General Purpose Sync</R> protocol.
              </Marginale>

              <Marginale>
                Formally, adding a new <R n="Entry" /> to a <R n="store" />{" "}
                consists of computing the <R n="store_join" /> of the original
                {" "}
                <R n="store" /> and a singleton <R n="store" />{" "}
                containing only the new <R n="Entry" />.
              </Marginale>

              The <Def n="store_join" r="join" rs="joins" /> of two{" "}
              <Rs n="store" /> that store <Rs n="Entry" /> of the same{" "}
              <R n="entry_namespace_id" /> is the <R n="store" />{" "}
              obtained as follows:
            </P>
            <Ul>
              <Li>
                Start with the union of the two <Rs n="store" />.
              </Li>
              <Li>
                Then, remove all <Rs n="Entry" /> with a <R n="entry_path" />
                {" "}
                <DefValue n="join_def_p" r="p" /> whose{" "}
                <R n="entry_timestamp" /> is strictly less than the{" "}
                <R n="entry_timestamp" /> of any other <R n="Entry" />{" "}
                of the same <R n="entry_subspace_id" /> whose{" "}
                <R n="entry_path" /> is a prefix of <R n="join_def_p" />.
              </Li>
              <Li>
                Then, for each subset of <Rs n="Entry" /> with equal{" "}
                <Rs n="entry_subspace_id" />, equal{" "}
                <Rs n="entry_path" />, and equal{" "}
                <Rs n="entry_timestamp" />, remove all but those with the
                greatest <R n="entry_payload_digest" />.
              </Li>
              <Li>
                Then, for each subset of <Rs n="Entry" /> with equal{" "}
                <Rs n="entry_subspace_id" />, equal <Rs n="entry_path" />, equal
                {" "}
                <Rs n="entry_timestamp" />, and equal{" "}
                <Rs n="entry_payload_digest" />, remove all but those with the
                greatest <R n="entry_payload_length" />.
              </Li>
            </Ul>
          </PreviewScope>

          <PreviewScope>
            <P>
              A <Def n="namespace" rs="namespaces" /> is the{" "}
              <R n="store_join" /> over <Sidenote note={<></>}>all</Sidenote>
              {" "}
              <Rs n="store" /> in existence of a given{" "}
              <R n="NamespaceId" />. This concept only makes sense as an
              abstract notion, since no participant in a distributed system can
              ever be certain that it has (up-to-date) information about all
              existing <Rs n="store" />. A <Def n="subspace" rs="subspaces" />
              {" "}
              is teh set of all <Rs n="Entry" /> of a given <R n="SubspaceId" />
              {" "}
              in a given{" "}
              <R n="namespace" />. This again is more of a conceptual notion
              than a computer-friendly one.
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection n="data_further" title="Further Reading">
          <P>
            <Alj inline>TODO</Alj>
          </P>
{/* 
          pinformative("The Willow data model stays fairly compact by deliberately sidestepping some rather important questions. In this section, we point to our answers for the most important ones."),

      pinformative("How can we precisely delimit meaningful groups of ", rs("Entry"), ", for example, all recipes that Alex posted on their blog in the past three months? Grouping ", rs("Entry"), " always incurs a tradeoff between ", em("expressivity"), " (which sets of ", rs("Entry"), " can be characterised) and ", em("efficiency"), " (how quickly a database can retrieve all its ", rs("Entry"), " of an arbitrary grouping). We present a carefully crafted selection of ways of grouping ", rs("Entry"), " ", link_name("grouping_entries", "here"), "."),

      pinformative("How should we encode the concepts of Willow for storage or network transmission? Due to the parameterised nature of Willow, there can be no overarching answer, but we cover some recurring aspects of the question ", link_name("encodings", "here"), "."),

      pinformative("How should we select the ", r("AuthorisationToken"), " and ", r("is_authorised_write"), " parameters? Different deployments of Willow will have different needs. We provide ", link_name("meadowcap", "Meadowcap"), ", a capability-based solution that should be suitable for most use-cases."),

      pinformative("How do we efficiently and securely compute ", rs("store_join"), " over a network to synchronise data between peers? Again, different settings require different answers, but we provide the ", link_name("sync", "Willow General Purpose Sync"), " protocol as a well-engineered, privacy-preserving solution that should be applicable to a wide range of scenarios."),

      pinformative("How can we encrypt ", rs("Entry"), " while retaining the semantics of the original, unencrypted data? This question lies at the heart of end-to-end encryption for Willow, and we discuss our findings ", link_name("e2e", "here"), "."),

      pinformative("How can a database provide efficient access to ", rs("Entry"), "? We give an introduction to the types of queries that a data store for Willow should support, and present some data structures for supporting them efficiently ", link_name("d3storage", "here"), "."),

      pinformative("How can I contribute to Willow and support it? So glad you asked — we have prepared a collection of pointers ", link_name("projects_and_communities", "here"), "."),
    */}

        </Hsection>

        <Img
          src="/assets/emblem.png"
          alt={`A Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word "Willow".`}
        />
      </PageTemplate>
    </File>
  </Dir>
);

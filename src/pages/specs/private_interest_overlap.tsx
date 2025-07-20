import { Dir, File } from "macromania-outfs";
import { AE, AsideBlock, Gwil, Path, Purple } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import {
  Blockquote,
  Code,
  Details,
  Div,
  Em,
  Figcaption,
  Figure,
  Hr,
  Img,
  Li,
  Ol,
  P,
  Summary,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
  Ul,
} from "macromania-html";
import { Bib } from "macromania-bib";
import { Marginale, Sidenote, Sidenotes } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rs } from "macromania-defref";
import {
  AccessStruct,
  ChoiceType,
  DefFunction,
  DefValue,
  SliceType,
  StructDef,
  TupleType,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { Expression, Expressions } from "macromaniajsx/jsx-dev-runtime";
import { CodeFor, Encoding } from "../../encoding_macros.tsx";
import { ResolveAsset } from "macromania-assets";

function PiiExample(
  {
    children,
    leftPath,
    rightPath,
    leftSs,
    rightSs,
    overlap,
    imageName,
  }: {
    children?: Expressions;
    leftPath: Expression[];
    rightPath: Expression[];
    leftSs?: Expressions;
    rightSs?: Expressions;
    overlap?: boolean;
    imageName: string;
  },
): Expression {
  return (
    <Figure>
      <Img
        src={
          <ResolveAsset
            asset={["pio", "overlap_examples", `${imageName}.png`]}
          />
        }
      />
      <Marginale inlineable>
        <Figcaption>
          <Div clazz="piiExample">
            <Div clazz="piiExampleLeft">
              Left: {leftSs === undefined ? <R n="ss_any" /> : (
                <Purple>
                  <exps x={leftSs} />
                </Purple>
              )} subspace, path <Path components={leftPath} />
            </Div>
            <Div clazz="piiExampleRight">
              Right: {rightSs === undefined ? <R n="ss_any" /> : (
                <Purple>
                  <exps x={rightSs} />
                </Purple>
              )} subspace, path <Path components={rightPath} />
            </Div>
            <Div clazz="piiExampleCaption">
              {overlap
                ? (
                  <>
                    The <Rs n="PrivateInterest" /> are not{" "}
                    <R n="pi_disjoint" />.
                  </>
                )
                : (
                  <>
                    The <Rs n="PrivateInterest" /> are <R n="pi_disjoint" />.
                  </>
                )} <exps x={children} />
            </Div>
          </Div>
        </Figcaption>
      </Marginale>
      <Hr />
    </Figure>
  );
}

export const private_interest_overlap = (
  <Dir name="pio">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Read Access and Confidentiality"
        headingId="private_interest_overlap"
        heading="Read Access and Confidentiality"
        toc
        bibliography
        parentId="specifications"
      >
        <P>
          <Marginale>
            <Img
              src={<ResolveAsset asset={["pio", "capability_gotcha.png"]} />}
              alt="A ticket representing a capability, detailing the capability's receiver (Betty), and that it grants write access to a path named 'organising'. Someone has circled these details messily with a red marker."
            />
          </Marginale>
          This document details a mechanism for implementing capability-enforced
          read-access-control when synchronising data between two Willow peers.
          This is more complex than simply defining a type of read access
          capabilities and then exchanging those in the open, because such a
          process would leak information such as <Rs n="NamespaceId" />,{" "}
          <Rs n="SubspaceId" />, and <Rs n="Path" />{" "}
          to peers without read-access. We describe a more sophisticated
          technique that does not leak such information, even in realistic
          adversarial settings.
        </P>

        <Hsection n="pio_goals" title="Setting and Goals">
          <P>
            We want to allow peers to specify pairs of <Rs n="namespace" /> and
            {" "}
            <Rs n="AreaOfInterest" />, and then synchronise the{" "}
            <Rs n="aoi_intersection" />. Furthermore, a peer should only be
            given access to information for which it can prove that the original
            author allows them to access it. To this end, we start by defining
            the notion of a <R n="read_capability" />.
          </P>

          <PreviewScope>
            <P>
              A{" "}
              <Def
                n="read_capability"
                r="read capability"
                rs="read capabilities"
              />{" "}
              is an unforgeable token that grants read access to some data to
              the holder of some secret key. More formally, a{" "}
              <R n="read_capability" />{" "}
              must be a piece of data for which three types of semantics are
              defined:<Marginale>
                <R n="meadowcap">
                  Meadowcap
                </R>, our bespoke capability system for Willow, just so happens
                to provide these semantics with its <Rs n="Capability" /> of
                {" "}
                <R n="cap_mode" /> <R n="access_read" />.
              </Marginale>
            </P>
            <Ul>
              <Li>
                each <R n="read_capability" /> must have a single{" "}
                <Def n="access_receiver" r="receiver" rs="receivers" /> (a{" "}
                <R n="dss_pk" /> of some <R n="signature_scheme" />),
              </Li>
              <Li>
                it must have a single{" "}
                <Def n="granted_area" r="granted area" rs="granted areas" /> (an
                {" "}
                <R n="Area" />), and
              </Li>
              <Li>
                it must have a single{" "}
                <Def
                  n="granted_namespace"
                  r="granted namespace"
                  rs="granted namespaces"
                />{" "}
                (a <R n="NamespaceId" />).
              </Li>
            </Ul>

            <P>
              Access control can then be implemented by answering only requests
              for <Rs n="Entry" /> in the <R n="granted_namespace" /> and{" "}
              <R n="granted_area" /> of some <R n="read_capability" /> whose
              {" "}
              <R n="access_receiver" /> is the peer in question.
            </P>
          </PreviewScope>

          <P>
            The simplemost solution consists in the peers openly exchanging{" "}
            <Rs n="read_capability" /> and then specifying their{" "}
            <Rs n="AreaOfInterest" />, which must be fully{" "}
            <R n="area_include_area">included</R> in the <Rs n="granted_area" />
            {" "}
            of the{" "}
            <Rs n="read_capability" />. This works well for managing read access
            control and determining which <Rs n="Entry" />{" "}
            to synchronise, but it leaks some potentially sensitive information.
            Two examples:
          </P>

          <P>
            First, suppose that Alfie creates an <R n="Entry" /> at{" "}
            <R n="Path" /> <Path components={["gemma_stinks"]} />, and gives a
            {" "}
            <R n="read_capability" /> for this <R n="Path" />{" "}
            to Betty. Later, Betty connects to Gemma's machine for syncing, and
            asks for <Path components={["gemma_stinks"]} /> in Alfie’s{" "}
            <R n="subspace" />. In sending her{" "}
            <R n="read_capability" />, she hands a signed proof to Gemma that
            Alfie{" "}
            <Sidenotes
              notes={[
                "Gemma does not, in fact, stink.",
                <>
                  Also, Alfie is really very nice and would never say such a
                  thing outside of thought experiments for demonstrating the
                  dangers of leaking <Rs n="Path" />.
                </>,
              ]}
            >
              thinks
            </Sidenotes>{" "}
            she stinks. Not good.
          </P>

          <P>
            Second, suppose a scenario where everyone{" "}
            <R n="e2e_paths">uses encrypted paths</R>, with individual
            encryption keys per{" "}
            <R n="subspace" />. Alfie synchronises with Betty, asking her for
            random-looking <Rs n="Path" />{" "}
            of the same structure in ten different{" "}
            <Rs n="subspace" />. Betty has the decryption keys for all but one
            of the{" "}
            <Rs n="subspace" />. All the paths she can decrypt happen to decrypt
            to{" "}
            <Path components={["gemma_stinks"]} />. This gives Betty a strong
            idea about what the tenth person thinks of Gemma, despite the fact
            that Betty cannot decrypt the <R n="Path" />. Not good.
          </P>

          <P>
            Ideally, we would like to employ a mechanism where peers cannot
            learn any information beyond the <Rs n="granted_area" /> of the{" "}
            <Rs n="read_capability" />{" "}
            which they hold at the start of the process. Unfortunately, such a
            mechanism would have to involve privacy-preserving verification of
            cryptographic signatures, and any suitable primitives are
            exceedingly complicated.
          </P>

          <P>
            Instead, we design solutions which do not allow peers to learn about
            the existence of any <R n="NamespaceId" />, <R n="SubspaceId" />, or
            {" "}
            <R n="Path" />{" "}
            which they did not know about already. If, for example, both peers
            knew about a certain{" "}
            <R n="namespace" />, they should both get to know that the other
            peer also knows about that <R n="namespace" />. But for a{" "}
            <R n="namespace" />{" "}
            which only one of the peers knows about, the other peer should not
            learn its <R n="NamespaceId" />.
          </P>

          <P>
            Such solutions cannot prevent peers from confirming guesses about
            data they shouldn't know about. Hence, it is important that{" "}
            <Rs n="NamespaceId" /> and <Rs n="SubspaceId" />{" "}
            are sufficiently long and random-looking. Similarly, encrypting{" "}
            <Rs n="Component" /> with different encryption keys for different
            {" "}
            <Rs n="subspace" /> can ensure that <Rs n="Path" />{" "}
            are unguessable. Because valid <Rs n="Timestamp" />
            <Marginale>
              Finding efficient encryption schemes and privacy-preserving
              synchronisation techniques that work for <Rs n="Timestamp" />{" "}
              is an interesting research endeavour, but out of scope for us.
            </Marginale>{" "}
            can easily be guessed, we do not try to hide information about them.
          </P>

          <P>
            In addition to withholding information from unauthorised peers, we
            also wish to defend against{" "}
            <AE href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">
              active eavesdroppers
            </AE>. An active eavesdropper is an attacker who can read and modify
            all transmissions by the two peers. There exist{" "}
            <AE href="https://en.wikipedia.org/wiki/Key-agreement_protocol#Authentication">
              well-known protections
            </AE>{" "}
            for settings where the two peers have prior knowledge about each
            other before they start the connection, but we also want to allow
            for sync between anonymous peers who do not know each other at all.
            Hence, even after the other peer has proven to us that they have
            access to some data, we still must be careful about what we send (or
            rather, how we encrypt it).
          </P>
        </Hsection>

        <Hsection n="sync_confidentiality_overview" title="Techniques Overview">
          <P>
            At a high level, we employ three mechanism for preserving{" "}
            <R n="Entry" /> confidentiality:
          </P>
          <Ul>
            <Li>
              peers demand a proof that their sync partner is the{" "}
              <R n="access_receiver" /> of a <R n="read_capability" />{" "}
              before handing over data,
            </Li>
            <Li>
              communication sessions are encrypted such that they can only be
              decrypted by the <R n="access_receiver" /> of the{" "}
              <Rs n="read_capability" />, and
            </Li>
            <Li>
              peers exchange (salted) hashes of <Rs n="Area" /> instead of the
              {" "}
              <Rs n="Area" /> themselves.
            </Li>
          </Ul>

          <P>
            The first bullet point should be straightforward: no requested data
            is explicitly handed over, unless the sync partner demonstrates that
            it was granted read access.
          </P>

          <P>
            The second bullet point serves to defend against{" "}
            <AE href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">
              active eavesdroppers
            </AE>. At the start of the sync session, the two peers perform a
            handshake in which they negotiate how to encrypt their
            communication. A typical choice would be a{" "}
            <AE href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange">
              Diffie–Hellman key exchange
            </AE>, which results in a shared secret, which can be used as the
            shared key for symmetric encryption of the communication session.
            Crucially, as part of the handshake, the peers prove to each other
            knowledge of the secret key corresponding to some public key they
            transmit. We require those to be <Rs n="dss_pk" /> and{" "}
            <Rs n="dss_sk" /> for the <R n="signature_scheme" />{" "}
            that denotes the <Rs n="access_receiver" /> of{" "}
            <Sidenote
              note={
                <>
                  All <Rs n="read_capability" />{" "}
                  that a single peer presents in a sync session must have the
                  same{" "}
                  <R n="access_receiver" />. This is not a restriction in
                  practice when capabilities can be delegated. Peers can even
                  create ephemeral keypairs per sync session and create valid
                  capabilities by delegation which they discard after the
                  session.
                </>
              }
            >
              <Rs n="read_capability" />
            </Sidenote>. The peers only accept <Rs n="read_capability" /> whose
            {" "}
            <R n="access_receiver" /> is the <R n="dss_pk" />{" "}
            for which the other other peer proved it has the{" "}
            <R n="correspond">corresponding</R> <R n="dss_sk" />.
          </P>

          <P>
            An active eavesdropper faces a dilemma: if they do not manipulate
            the handshake, they cannot derive the decryption secret and cannot
            listen in on the sync session. If they do manipulate the handshake
            by replacing the exchanged <Rs n="dss_pk" />{" "}
            with ones for which they have the{" "}
            <R n="correspond">corresponding</R>{" "}
            <Rs n="dss_sk" />, then they will later have to produce{" "}
            <Rs n="read_capability" /> for those{" "}
            <Rs n="dss_pk" />. Since a good capability system makes forgery
            impossible, they will not be able to do so. The peers, then, will
            not transmit any sensitive data.
          </P>

          <P>
            <Marginale>
              <Img
                src={<ResolveAsset asset={["pio", "which_salt.png"]} />}
                alt={"A comic showing two characters creating hashes of a common piece of information using their own salt. When they receive each others' hashes, they compare it with a hash generated using their partner's salt."}
              />
            </Marginale>
            Telling a peer directly about which <Rs n="Area" /> in which{" "}
            <Rs n="namespace" /> you are interested in leaks{" "}
            <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, and{" "}
            <Rs n="Path" />. Instead, the peers merely transmit secure hashes of
            certain combinations of these. Intuitively, if both peers send the
            same hash, then they both know that they are interested in the same
            things. This is easily attackable however: one peer can simply
            mirror back hashes sent by the other, tricking them into beleaving
            that they have shared knowledge. For this reason, each peer is
            assigned a random bitstring to use as a salt for the hash function.
            A peer <Em>transmits</Em> hashes salted with <Em>its own</Em>{" "}
            salt, but compares the hashes it <Em>receives</Em>{" "}
            against hashes that it computes locally with the{" "}
            <Em>other peer’s salt</Em>.
          </P>

          <AsideBlock>
            <P>
              A reader well-versed in the literature on{" "}
              <AE href="https://en.wikipedia.org/wiki/Private_set_intersection">
                private set intersection (PSI)
              </AE>{" "}
              might be irritated at this point. The literature is full of papers
              that point out the exchange of (salted) hashes as a rookie
              mistake. A fairly representative example{" "}
              <Bib item="freedman2016efficient" />:
            </P>

            <Blockquote>
              This simple solution is unfortunately{" "}
              <Em>insecure</Em>. The reason is that given Alice’s hashed values
              Bob can test whether an element <M>x</M>{" "}
              appears in her set by searching for <M>H(x)</M>{" "}
              in Alice’s hashed set. In particular, when Alice’s set comes from
              a polynomial domain, Bob can recover her entire input set.
            </Blockquote>

            <P>
              A peer can check for membership of a value which it itself has not
              submitted to the PSI session, which goes against the typical
              definition of PSI.
            </P>

            <P>
              We argue that this strong notion of PSI misses the point in our
              setting: if a malicious peer wants to learn about any value, then
              it can simply submit it as part of its input set, whether the
              value actually fits semantically into its set or not (in our case,
              whether the peer is actually interested in the data or not). Since
              academia mostly works by appeals to authority, here is a
              widely-cited paper that presents the same argument{" "}
              <Bib item="de2010linear"></Bib>:
            </P>

            <Blockquote>
              Malicious parties cannot be prevented from modifying their input
              sets, even if a protocol is proven secure in the malicious model.
              [...] We claim that this issue cannot be effectively addressed
              without some mechanism to authorize client inputs. Consequently, a
              trusted certification authority (CA) is needed to certify input
              sets, [...].
            </Blockquote>

            <P>
              Any notion of a trusted certification authority of the inputs that
              peers bring to their sync sessions goes widely beyond the
              scenarios in which we want to enable secure syncing. Hence, we can
              reject the overly strict definition of PSI in the academic
              literature, and solve our problem via the simple technique of
              exchanging salted hashes.
            </P>
          </AsideBlock>

          <P>
            Before we go into the details of which data precisely to hash, we
            want to point out that peers must use references to the common
            hashes instead of mentioning the underlying <Rs n="NamespaceId" />,
            {" "}
            <Rs n="SubspaceId" />, and{" "}
            <Rs n="Path" />. In particular, when transmitting{" "}
            <Rs n="read_capability" />, peers must encode them in a special
            format that omits the confidential data.
          </P>
        </Hsection>

        <Hsection n="sync_confidentiality_details" title="All the Details">
          <P>
            We now switch from the preceding informational style to a more
            precise specification of how one can sync Willow data with untrusted
            peers while keeping most metadata confidential.
          </P>

          <PreviewScope>
            <P>
              We shall assume that the connection between the two syncing peers
              is established via a handshake. We refer to the two peers as the
              {" "}
              <Def n="pio_initiator" r="initiator" rs="initiators" /> and the
              {" "}
              <Def n="pio_responder" r="responder" rs="responders" />{" "}
              respectively to break symmetry. We require the handshake to have
              the following properties:<Marginale>
                These properties are more or less the bread-and-butter
                properties of authenticated Diffie-Hellman key exchanges; the
                {" "}
                <AE href="https://noiseprotocol.org/noise.html">
                  noise framework XX handshake
                </AE>, for example, fulfils them.
              </Marginale>
            </P>
            <Ul>
              <Li>
                all communication over the connection after the handshake is
                encrypted, using a symmetric key known two both participants of
                the handshake,
              </Li>
              <Li>
                the symmetric key depends to some degree on two inputs{" "}
                <DefValue n="ini_pk" /> and{" "}
                <DefValue n="res_pk" />, which are public keys submitted by the
                {" "}
                <R n="pio_initiator" /> and the <R n="pio_responder" />{" "}
                respectively,
              </Li>
              <Li>
                during the handshake, the peers prove to each other knowledge of
                the respective secret keys for <R n="pio_initiator" /> and{" "}
                <R n="pio_responder" />, and
              </Li>
              <Li>
                the two peers arrive at a random bytestring<Marginale>
                  In the noise framework, this corresponds to the{" "}
                  <Code>GetHandshakeHash()</Code> function.
                </Marginale>{" "}
                <DefValue n="pio_rnd" r="rnd" />{" "}
                which cannot be dictated by any one peer alone.
              </Li>
            </Ul>
          </PreviewScope>

          <P>
            Peers must reject any <Rs n="read_capability" />{" "}
            presented to them whose <R n="access_receiver" /> is not the{" "}
            <R n="ini_pk" /> or <R n="res_pk" />{" "}
            respectively. This ensures that the information they exchange can
            only be decrypted by the receiver of the capabilities.
          </P>

          <PreviewScope>
            <P>
              The <R n="pio_rnd" /> bytestring{" "}
              forms the basis for the two peers to salt their hashes. We define
              {" "}
              <DefValue n="pio_ini_salt" r="ini_salt" /> as equal to{" "}
              <R n="pio_rnd" />, and <DefValue n="pio_res_salt" r="res_salt" />
              {" "}
              as the bytestring obtained by flipping every bit of{" "}
              <R n="pio_rnd" />.
            </P>
          </PreviewScope>

          <Hsection n="pio_private_interests" title="Private Interests">
            <P>
              <Marginale>
                <Img
                  src={
                    <ResolveAsset asset={["pio", "capability_redacted.png"]} />
                  }
                  alt={"A ticket representing a capability, detailing the capability's receiver (Betty), and that it grants write access to a path named 'organising'. Someone has circled these details messily with a red marker."}
                />
              </Marginale>
              Before we go into further details, we introduce some compact
              terminology around the data we want to keep confidential
              (<Rs n="NamespaceId" />, <Rs n="SubspaceId" />, and{" "}
              <Rs n="Path" />), starting by giving such triplets a name:
            </P>

            <Pseudocode n="pi_definition">
              <StructDef
                comment={
                  <>
                    Confidential data that relates to determining the{" "}
                    <Rs n="AreaOfInterest" />{" "}
                    that peers might be interested in synchronising.
                  </>
                }
                id={["PrivateInterest", "PrivateInterest", "PrivateInterests"]}
                fields={[
                  [
                    ["namespace_id", "pi_ns", "namespace_ids"],
                    <R n="NamespaceId" />,
                  ],
                  {
                    commented: {
                      comment: (
                        <>
                          <R n="ss_any" /> denotes interest in <Em>all</Em>{" "}
                          <Rs n="subspace" /> of the <R n="namespace" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["subspace_id", "pi_ss", "subspace_ids"],
                        <ChoiceType
                          types={[<R n="SubspaceId" />, <R n="ss_any" />]}
                        />,
                      ],
                    },
                  },
                  [
                    ["path", "pi_path", "paths"],
                    <R n="Path" />,
                  ],
                ]}
              />
            </Pseudocode>

            <PreviewScope>
              <P>
                Let <DefValue n="pi1" r="p1" /> and <DefValue n="pi2" r="p2" />
                {" "}
                be <Rs n="PrivateInterest" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say <R n="pi1" /> is{" "}
                <Def n="pi_more_specific" r="more specific" /> than{" "}
                <R n="pi2" /> if
              </P>
              <Ul>
                <Li>
                  <Code>
                    <AccessStruct field="pi_ns">
                      <R n="pi1" />
                    </AccessStruct>{" "}
                    =={" "}
                    <AccessStruct field="pi_ns">
                      <R n="pi2" />
                    </AccessStruct>
                  </Code>, and
                </Li>
                <Li>
                  <Code>
                    <AccessStruct field="pi_ss">
                      <R n="pi2" />
                    </AccessStruct>{" "}
                    == <R n="ss_any" />
                  </Code>{" "}
                  or{" "}
                  <Code>
                    <AccessStruct field="pi_ss">
                      <R n="pi1" />
                    </AccessStruct>{" "}
                    =={" "}
                    <AccessStruct field="pi_ss">
                      <R n="pi2" />
                    </AccessStruct>
                  </Code>, and
                </Li>
                <Li>
                  <AccessStruct field="pi_path">
                    <R n="pi1" />
                  </AccessStruct>{" "}
                  is an <R n="path_extension" /> of{" "}
                  <AccessStruct field="pi_ss">
                    <R n="pi2" />
                  </AccessStruct>.
                </Li>
              </Ul>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say that <R n="pi1" /> is{" "}
                <Def n="pi_strictly_more_specific" r="strictly more specific" />
                {" "}
                than <R n="pi2" /> if <R n="pi1" /> is{" "}
                <R n="pi_more_specific" /> than <R n="pi2" />{" "}
                and they are not equal.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say that <R n="pi1" /> is{" "}
                <Def n="pi_less_specific" r="less specific" /> than{" "}
                <R n="pi2" /> if <R n="pi2" /> is <R n="pi_more_specific" />
                {" "}
                than <R n="pi1" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say that <R n="pi1" /> and <R n="pi2" /> are{" "}
                <Def n="pi_comparable" r="comparable" /> if <R n="pi1" /> is
                {" "}
                <R n="pi_more_specific" /> than <R n="pi2" />or <R n="pi2" /> is
                {" "}
                <R n="pi_more_specific" /> than <R n="pi1" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say that <R n="pi1" />{" "}
                <Def n="pi_include_entry" r="include">includes</Def> an{" "}
                <R n="Entry" /> <DefValue n="pi_e" r="e" /> if
              </P>
              <Ul>
                <Li>
                  <Code>
                    <AccessStruct field="pi_ns">
                      <R n="pi1" />
                    </AccessStruct>{" "}
                    =={" "}
                    <AccessStruct field="entry_namespace_id">
                      <R n="pi_e" />
                    </AccessStruct>
                  </Code>, and
                </Li>
                <Li>
                  <Code>
                    <AccessStruct field="pi_ss">
                      <R n="pi1" />
                    </AccessStruct>{" "}
                    == <R n="ss_any" />
                  </Code>{" "}
                  or{" "}
                  <Code>
                    <AccessStruct field="pi_ss">
                      <R n="pi1" />
                    </AccessStruct>{" "}
                    =={" "}
                    <AccessStruct field="entry_subspace_id">
                      <R n="pi_e" />
                    </AccessStruct>
                  </Code>, and
                </Li>
                <Li>
                  <AccessStruct field="pi_path">
                    <R n="pi1" />
                  </AccessStruct>{" "}
                  is a <R n="path_prefix" /> of{" "}
                  <AccessStruct field="entry_path">
                    <R n="pi_e" />
                  </AccessStruct>.
                </Li>
              </Ul>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say that <R n="pi1" /> and <R n="pi2" /> are{" "}
                <Def n="pi_disjoint" r="disjoint" /> there can be no{" "}
                <R n="Entry" /> which is <R n="pi_include_entry">included</R>
                {" "}
                in both <R n="pi1" /> and <R n="pi2" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say that <R n="pi1" /> and <R n="pi2" /> are{" "}
                <Def n="pi_awkward" r="awkward" /> if they are neither{" "}
                <R n="pi_comparable" /> nor{" "}
                <R n="pi_disjoint" />. This is the case if and only if one of
                them has <R n="pi_ss" /> <R n="ss_any" /> and a{" "}
                <R n="pi_path" />{" "}
                <DefValue n="pi_awkward_p" r="p" />, and the other has a
                non-<R n="ss_any" /> <R n="pi_ss" /> and a <R n="pi_path" />
                {" "}
                which is a strict <R n="path_prefix" /> of{" "}
                <R n="pi_awkward_p" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                We say that <R n="pi1" />{" "}
                <Def n="pi_include_area" r="include">includes</Def> an{" "}
                <R n="Area" /> <DefValue n="pi_a" r="a" /> if
              </P>
              <Ul>
                <Li>
                  <Code>
                    <AccessStruct field="pi_ss">
                      <R n="pi1" />
                    </AccessStruct>{" "}
                    == <R n="ss_any" />
                  </Code>{" "}
                  or{" "}
                  <Code>
                    <AccessStruct field="pi_ss">
                      <R n="pi1" />
                    </AccessStruct>{" "}
                    =={" "}
                    <AccessStruct field="AreaSubspace">
                      <R n="pi_a" />
                    </AccessStruct>
                  </Code>, and
                </Li>
                <Li>
                  <AccessStruct field="pi_path">
                    <R n="pi1" />
                  </AccessStruct>{" "}
                  is a <R n="path_prefix" /> of{" "}
                  <AccessStruct field="AreaPath">
                    <R n="pi_a" />
                  </AccessStruct>.
                </Li>
              </Ul>
            </PreviewScope>

            <PreviewScope>
              <P>
                If <R n="pi1" /> has a <R n="pi_ss" /> that is not{" "}
                <R n="ss_any" />, then we call the <R n="PrivateInterest" />
                {" "}
                that is equal to <R n="pi1" /> except its <R n="pi_ss" /> is
                {" "}
                <R n="ss_any" /> the <Def n="pi_relaxation" r="relaxation" /> of
                {" "}
                <R n="pi1" />.
              </P>
            </PreviewScope>
          </Hsection>

          <Hsection
            n="pio_pio"
            title="Private Interest Overlap"
            shortTitle="Private Overlap"
          >
            <PreviewScope>
              <P>
                Peers want to find the non-empty <Rs n="aoi_intersection" />
                {" "}
                of their{" "}
                <Rs n="AreaOfInterest" />. We reduce this to first finding their
                {" "}
                <R n="pi_disjoint">non-disjoint</R>{" "}
                <Rs n="PrivateInterest" />, and assume that <Rs n="TimeRange" />
                {" "}
                and <R n="AreaOfInterest" /> limits<Marginale>
                  Combining confidential <R n="PrivateInterest" />{" "}
                  information with limits and <Rs n="TimeRange" />{" "}
                  in the clear might allow malicious peers to track
                  correlations. We choose to err on the side of caution here.
                </Marginale>{" "}
                will be taken into consideration in a separate, later stage. The
                challenge then becomes to find overlapping{" "}
                <Rs n="PrivateInterest" />{" "}
                by comparing only small numbers of salted hashes. We assume
                there is a secure hash function <DefFunction n="pio_h" r="h" />
                {" "}
                that maps pairs of salts (bytestrings) and{" "}
                <Rs n="PrivateInterest" /> to bytestrings of some fixed width.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                <Marginale>
                  Explaining in advance how this solution came about is a bit
                  difficult. So we are simply going to define it, and then argue
                  that it is correct, without any real explanation. If that
                  leaves you unhappy, you can at least take comfort in the fact
                  that you did not have to <Em>come up</Em>{" "}
                  with the solution yourself.
                </Marginale>
                For reasons that will become apparent later (spoiler:{" "}
                <R n="pi_awkward" /> <Rs n="PrivateInterest" />{" "}
                deserve their name), the peers exchange pairs of a salted hash
                and a boolean each, according to the following rules:
              </P>
              <Ul>
                <Li>
                  For each <R n="PrivateInterest" />{" "}
                  <DefValue n="pio_hashing_p0" r="p" /> with a <R n="pi_ss" />
                  {" "}
                  of <R n="ss_any" />,
                  <Ul>
                    <Li>
                      the <R n="pio_initiator" /> transmits the pair{" "}
                      <Code>
                        (<R n="pio_h" />(<R n="pio_ini_salt" />,{" "}
                        <R n="pio_hashing_p0" />), true)
                      </Code>, and
                    </Li>
                    <Li>
                      the <R n="pio_responder" />
                      <Marginale>
                        Here and below, <R n="pio_responder" /> and{" "}
                        <R n="pio_initiator" />{" "}
                        send the same pairs, except they salt differently.
                      </Marginale>{" "}
                      transmits the pair{" "}
                      <Code>
                        (<R n="pio_h" />(<R n="pio_res_salt" />,{" "}
                        <R n="pio_hashing_p0" />), true)
                      </Code>.
                    </Li>
                  </Ul>
                </Li>
                <Li>
                  For each <R n="PrivateInterest" />{" "}
                  <DefValue n="pio_hashing_p1" r="p" /> with a <R n="pi_ss" />
                  {" "}
                  that is not <R n="ss_any" />, let{" "}
                  <DefValue n="pio_hashing_p_relaxed" r="p_relaxed" />{" "}
                  denote the <R n="pi_relaxation" /> of{" "}
                  <R n="pio_hashing_p1" />. Then each peer transmits{" "}
                  <Em>two</Em> pairs:
                  <Ul>
                    <Li>
                      the <R n="pio_initiator" /> transmits the pair{" "}
                      <Code>
                        (<R n="pio_h" />(<R n="pio_ini_salt" />,{" "}
                        <R n="pio_hashing_p1" />), true)
                      </Code>{" "}
                      and the pair{" "}
                      <Code>
                        (<R n="pio_h" />(<R n="pio_ini_salt" />,{" "}
                        <R n="pio_hashing_p_relaxed" />), false)
                      </Code>, and
                    </Li>
                    <Li>
                      the <R n="pio_responder" /> transmits the pair{" "}
                      <Code>
                        (<R n="pio_h" />(<R n="pio_res_salt" />,{" "}
                        <R n="pio_hashing_p1" />), true)
                      </Code>{" "}
                      and the pair{" "}
                      <Code>
                        (<R n="pio_h" />(<R n="pio_res_salt" />,{" "}
                        <R n="pio_hashing_p_relaxed" />), false)
                      </Code>.
                    </Li>
                  </Ul>
                </Li>
                <Li>
                  Peers that wish to hide how many of their{" "}
                  <Rs n="PrivateInterest" /> have a <R n="pi_ss" /> of{" "}
                  <R n="ss_any" />{" "}
                  can further send a pair of a random hash and the boolean{" "}
                  <Code>false</Code> for each of their{" "}
                  <Rs n="PrivateInterest" /> with a <R n="pi_ss" /> of{" "}
                  <R n="ss_any" />.
                </Li>
              </Ul>
            </PreviewScope>

            <P>
              The boolean, in other words, is <Code>true</Code>{" "}
              if the hash corresponds to a <R n="PrivateInterest" />{" "}
              that the sending peer is actually interested in, and{" "}
              <Code>false</Code> if the hash corresponds merely to a{" "}
              <R n="pi_relaxation" /> that must be sent for technical reasons.
            </P>

            <P>
              Each peer locally computes some further pairs of salted hashes and
              booleans: the computations follow the same rules as for sending,
              except that
            </P>
            <Ul>
              <Li>
                the <R n="pio_initiator" /> now salts with{" "}
                <R n="pio_res_salt" /> and the <R n="pio_responder" />{" "}
                now salts with <R n="pio_ini_salt" />, and
              </Li>
              <Li>
                whenever a peer computes the pair for a{" "}
                <R n="PrivateInterest" />, it also computes the pairs for the
                {" "}
                <Rs n="PrivateInterest" /> obtained by replacing the{" "}
                <R n="pi_path" /> of the original <R n="PrivateInterest" />{" "}
                with any of its <Rs n="path_prefix" />{" "}
                (for example, if I am interested in <R n="Path" />{" "}
                <Path components={["blog", "recipies"]} /> in some{" "}
                <R n="namespace" /> and{" "}
                <R n="subspace" />, then I also compute the hashes for{" "}
                <Path components={["blog"]} /> and the empty <R n="Path" />{" "}
                for the same <R n="namespace" /> and <R n="subspace" />).
              </Li>
            </Ul>

            <P>
              Whenever a peer receives a hash-boolean pair, it compares it
              against its locally computed pairs. If it locally computed a pair
              with the same hash, and at least one of the two pairs has a
              boolean value of{" "}
              <Code>true</Code>, then the peer knows that there is an overlap
              between its own <R n="PrivateInterest" />{" "}
              that resulted in the matching pair and some{" "}
              <R n="PrivateInterest" /> of the other peer. For each of its{" "}
              <Rs n="PrivateInterest" />{" "}
              that did not give rise to any matching pair, the peer knows it to
              be <R n="pi_disjoint" /> from all <Rs n="PrivateInterest" />{" "}
              of the other peer.
            </P>

            <Hsection n="pio_examples" title="Examples and proof sketches">
              <P>
                The following examples show which data the peers compute and
                exchange in various situations. We assume the{" "}
                <R n="NamespaceId" />{" "}
                to always be equal for both peers (all involved hashes will
                trivially be distinct for <Rs n="PrivateInterest" /> of distinct
                {" "}
                <Rs n="pi_ns" />) and omit them.
              </P>

              <P>
                <Marginale>
                  If you replace the concrete examples with the equivalence
                  classes that they represent, you obtain a proof sketch for the
                  correctness of this approach.
                </Marginale>
                The examples cover the nine different (up to symmetry)
                combinations of how <Rs n="pi_ss" /> and <Rs n="pi_path" />{" "}
                can related to each other (equal, non-equal, or <R n="ss_any" />
                {" "}
                for <Rs n="pi_ss" />, <R n="path_prefix" />,{" "}
                <R n="path_extension" />, or <R n="path_related">unrelated</R>
                {" "}
                for{" "}
                <Rs n="pi_path" />). Note that in all examples, both peers also
                locally compute hashes for <Rs n="PrivateInterest" />{" "}
                with the empty{" "}
                <R n="Path" />. For brevity we do not depict those, since in
                these examples they never match any transmitted hashes.
              </P>

              <PiiExample
                leftPath={["a"]}
                rightPath={["a"]}
                leftSs="Gemma"
                rightSs="Gemma"
                imageName="gemma-a_gemma-a"
                overlap
              >
                Both peers detect an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                rightPath={["b"]}
                imageName="any-a_any-b"
              >
                None of the hashes match.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                rightPath={["a", "b"]}
                overlap
                imageName="any-a_any-a-b"
              >
                The right peer detects an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                rightPath={["b"]}
                rightSs="Gemma"
                imageName="any-a_gemma-b"
              >
                None of the hashes match.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                rightPath={["a", "b"]}
                rightSs="Gemma"
                overlap
                imageName="any-a_gemma-a-b"
              >
                The right peer detects an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a", "b"]}
                rightPath={["a"]}
                rightSs="Gemma"
                overlap
                imageName="any-a-b_gemma-a"
              >
                The left peer detects an overlap. This example represents the
                case of <R n="pi_awkward" />{" "}
                <Rs n="PrivateInterest" />; this is the only case in which a
                transmitted hash-boolean pair with a boolean of{" "}
                <Code>false</Code> is involved in detecting an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["b"]}
                rightSs="Gemma"
                imageName="gemma-a_gemma-b"
              >
                None of the hashes match.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["a", "b"]}
                rightSs="Gemma"
                overlap
                imageName="gemma-a_gemma-a-b"
              >
                The right peer detects an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["b"]}
                rightSs="Dalton"
                imageName="gemma-a_dalton-b"
              >
                None of the hashes match.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["a", "b"]}
                rightSs="Dalton"
                imageName="gemma-a_dalton-a-b"
              >
                The only matching hashes are <Em>both</Em>{" "}
                accompanied by a boolean of <Code>false</Code>.
              </PiiExample>
            </Hsection>
          </Hsection>

          <Hsection n="pio_caps" title="Exchanging Capabilities">
            <P>
              The previous scheme ensures that whenever two{" "}
              <Rs n="PrivateInterest" /> submitted by different peers are{" "}
              <R n="pi_disjoint">not disjoint</R>, one peer becomes aware of
              that fact. The next step is to let the peers exchange their
              corresponding{" "}
              <Rs n="read_capability" />. This requires some care, however,
              since no information must be leaked if the other peer merely{" "}
              <Em>knew</Em> or <Em>guessed</Em> a <R n="PrivateInterest" />{" "}
              but does not have a <R n="read_capability" />{" "}
              that certifies that the peer may learn information about
              corresponding <Rs n="Area" />.
            </P>

            <P>
              An example: Muriarty submits a <R n="PrivateInterest" /> with{" "}
              <R n="pi_path" />{" "}
              <Path components={["a"]} />, and Alfie detects an overlap with his
              {" "}
              <R n="PrivateInterest" /> of <R n="pi_path" />{" "}
              <Path components={["a"]} /> (and the same <Rs n="pi_ns" /> and
              {" "}
              <R n="pi_ss" />). But Muriarty does not actually have a{" "}
              <R n="read_capability" /> for and <R n="Area" /> with the{" "}
              <R n="AreaPath" />{" "}
              <Path components={["a"]} />. If Alfie simply transmitted his{" "}
              <R n="read_capability" /> first, then Muriarty would learn that
              {" "}
              <Path components={["b"]} /> is a meaningful <R n="Path" />{" "}
              suffix in an <R n="Area" />{" "}
              in which he should not be able to learn anything.
            </P>

            <PreviewScope>
              <P>
                In general, whenever there is an overlap in the two peer’s{" "}
                <Rs n="PrivateInterest" />, one of three situations occurs:
              </P>
              <Ol>
                <Li>
                  One of the <Rs n="PrivateInterest" /> is{" "}
                  <R n="pi_strictly_more_specific" />{" "}
                  than the other. The peer who has the{" "}
                  <R n="pi_more_specific" /> <R n="PrivateInterest" />{" "}
                  is the one to detect the overlap. This peer sends an{" "}
                  <Def
                    n="overlap_announcement"
                    r="overlap announcement"
                    rs="overlap announcements"
                  />{" "}
                  message to the other peer to announce the overlap, the other
                  peer then sends its <Rs n="read_capability" />{" "}
                  which certify read access to <Rs n="Area" />{" "}
                  <R n="pi_include_area">included in</R> the{" "}
                  <R n="pi_more_specific">less specific</R>{" "}
                  <R n="PrivateInterest" />.
                </Li>
                <Li>
                  Both <Rs n="PrivateInterest" />{" "}
                  are equal. Both peers are able to detect this — the matching
                  hashes correspond to a <R n="PrivateInterest" /> with a{" "}
                  <R n="pi_path" />{" "}
                  in which they are themselves directly interested in. Both
                  peers can and should immediately send their{" "}
                  <Rs n="read_capability" />.
                </Li>
                <Li>
                  The two <Rs n="PrivateInterest" /> are{" "}
                  <R n="pi_awkward" />. We discuss this case later and ignore it
                  for now.
                </Li>
              </Ol>
            </PreviewScope>

            <P>
              Upon receiving an <R n="overlap_announcement" />, a peer sends its
              {" "}
              <Rs n="read_capability" /> whose <Rs n="granted_area" /> are{" "}
              <R n="pi_include_area">included</R> in the{" "}
              <Rs n="PrivateInterest" /> in question. Upon receiving such a{" "}
              <R n="read_capability" />, a peer answers with its own{" "}
              <R n="area_intersection">intersecting</R>{" "}
              <Rs n="read_capability" />{" "}
              (if it hadn’t sent them for other reasons already).
            </P>

            <PreviewScope>
              <P>
                The scheme of replying with sensitive information to{" "}
                <Rs n="overlap_announcement" />{" "}
                is obviously broken if peers can simply claim an overlap for
                {" "}
                <Em>arbitrary</Em>{" "}
                hashes. But we can prevent this by mandating that every{" "}
                <R n="overlap_announcement" /> contains an{" "}
                <Def
                  n="announcement_authentication"
                  r="announcement authentication"
                  rs="announcement authentications"
                />{" "}
                in the form of the hash of the corresponding{" "}
                <R n="PrivateInterest" />{" "}
                salted with the announcer’s salt. So when the{" "}
                <R n="pio_initiator" /> announces an overlap, that{" "}
                <R n="overlap_announcement" /> must contain the hash salted with
                {" "}
                <R n="pio_ini_salt" />, and <Rs n="overlap_announcement" />{" "}
                by the <R n="pio_responder" /> must contain the hash salted with
                {" "}
                <R n="pio_res_salt" />. These salted hashes can only be produced
                by somebody who actually knows the <R n="PrivateInterest" />
                {" "}
                in question.
              </P>
            </PreviewScope>

            <P>
              Naively transmitting <Rs n="read_capability" />{" "}
              would allow an active eavesdropper to learn the information in the
              capabilities. Hence, the transmission of the capabilities must
              omit all sensitive information. This is possible because the two
              peers a have a shared context — the{" "}
              <R n="pi_more_specific">less specific</R> of the{" "}
              <R n="pi_disjoint">non-disjoint</R> <Rs n="PrivateInterest" />
              {" "}
              — whose information can be omitted from the capability encoding.
              We provide a{" "}
              <Sidenote
                note={
                  <>
                    Our encoding also includes the well-known{" "}
                    <R n="access_receiver" />{" "}
                    in the shared context, in the form of a{" "}
                    <R n="PersonalPrivateInterest" />. This is simply an
                    optimisation to shave off a few more bytes, not a critical
                    security feature. Things work out quite nicely here:
                    omitting the shared information not only secures
                    confidentiality, but also means transmitting fewer bytes.
                  </>
                }
              >
                <R n="enc_private_mc_capabilities">suitable encoding</R>
              </Sidenote>{" "}
              for{" "}
              <R n="Capability">Meadowcap capabilities</R>, users of different
              capability systems need to define their own encodings.
            </P>

            <P>
              Note that peers need to store a potentially unbounded number of
              hash-boolean pairs that they receive, but they do not have an
              unbounded amount of memory. In the <R n="sync">WGPS</R>, we employ
              {" "}
              <R n="lcmux">LCMUX</R> and the notion of{" "}
              <Rs n="resource_handle" />{" "}
              to deal with this problem. When resource limits are communicated
              and enforced, how should peers select which{" "}
              <Rs n="PrivateInterest" /> they submit?
            </P>

            <P>
              Imagine two peers, with the exact same 400{" "}
              <Rs n="PrivateInterest" />, but they can each submit only 20 into
              the private overlap detection process due to resource limits. If
              they each selected 20 of their interests at random, they would
              likely part ways thinking they don't share any common interests.
              If they both sorted their <Rs n="PrivateInterest" />{" "}
              (say, lexicographically according to some agreed-upon encoding)
              and transmitted the first 20 ones, then observers might be able to
              reconstruct some information about their interests.
            </P>

            <P>
              As a solution, both peers should send the{" "}
              <Rs n="PrivateInterest" /> whose hashes, salted with{" "}
              <R n="pio_ini_salt" />, are their numerically least hashes. This
              way, the sorting order is an independent, random permutation in
              each session, yet peers with large overlaps in their{" "}
              <Rs n="PrivateInterest" /> are likely to detect that overlap.
            </P>
          </Hsection>

          <Hsection
            n="dealing_with_awkwardness"
            title="Dealing With Awkwardness"
            shortTitle="Awkwardness"
          >
            <P>
              The exchange of <Rs n="read_capability" />{" "}
              that we have described so far works for pairs of{" "}
              <Rs n="PrivateInterest" /> where one is <R n="pi_more_specific" />
              {" "}
              than the other. This is not the case for <R n="pi_awkward" />{" "}
              pairs, however. The peer who detects the overlap cannot send its
              own <R n="read_capability" />{" "}
              for the same reason as in all other cases: the <R n="Path" />{" "}
              is an <R n="path_extension" /> of the <R n="Path" />{" "}
              that the other peer knows about, so it must not be transmitted
              blindly. But the other peer cannot send its{" "}
              <R n="read_capability" /> either, because it contains a{" "}
              <R n="SubspaceId" /> that must not be disclosed blindly.
            </P>

            <P>
              To resolve this standoff, we allow the peer who detected the
              overlap to prove that it is allowed to learn about arbitrary{" "}
              <Rs n="SubspaceId" /> that are in use in some{" "}
              <R n="namespace" />, without leaking any specific{" "}
              <Rs n="Path" />. To this end, we introduce a separate kind of
              capability: the <R n="enumeration_capability" />.
            </P>

            <PreviewScope>
              <P>
                An{" "}
                <Def
                  n="enumeration_capability"
                  r="enumeration capability"
                  rs="enumeration capabilities"
                />{" "}
                is an unforgeable token with two types of semantics:
              </P>
              <Ul>
                <Li>
                  each <R n="enumeration_capability" /> must have a single{" "}
                  <Def n="enumeration_receiver" r="receiver" rs="receivers" />
                  {" "}
                  (a <R n="dss_pk" /> of some <R n="signature_scheme" />),
                </Li>
                <Li>
                  it must have a single{" "}
                  <Def
                    n="enumeration_granted_namespace"
                    r="granted namespace"
                    rs="granted namespaces"
                  />{" "}
                  (a <R n="NamespaceId" />).
                </Li>
              </Ul>
            </PreviewScope>

            <P>
              Whenever some entity is granted a{" "}
              <R n="read_capability" />, it should{" "}
              <Sidenote
                note={
                  <>
                    This is not necessary if the <R n="read_capability" />{" "}
                    is of a form that makes it impossible to be part of an{" "}
                    <R n="pi_awkward" /> pair.
                  </>
                }
              >
                also
              </Sidenote>{" "}
              be granted an <R n="enumeration_capability" /> with the same{" "}
              <R n="enumeration_receiver" />. When, during sync, a peer detects
              an <R n="pi_awkward" /> pair, it attaches to its{" "}
              <R n="overlap_announcement" /> its{" "}
              <R n="enumeration_capability" /> for the <R n="namespace" />{" "}
              in question, using an encoding that omits all sensitive{" "}
              <Sidenote
                note={
                  <>
                    We provide a{" "}
                    <R n="meadowcap">Meadowcap</R>-like capability type at the
                    {" "}
                    <R n="mc_enumeration_cap">end of this document</R>, and a
                    suitable, confidentiality-preserving{" "}
                    <R n="enc_private_enumeration_capabilities">
                      encoding here
                    </R>.
                  </>
                }
              >
                information
              </Sidenote>{" "}
              (i.e., typically, the <R n="NamespaceId" /> of the{" "}
              <R n="enumeration_granted_namespace" />). The other peer replies
              to the <R n="overlap_announcement" /> only if the{" "}
              <R n="enumeration_receiver" /> matches the <R n="ini_pk" /> or the
              {" "}
              <R n="res_pk" /> (depending on role) and the{" "}
              <R n="enumeration_granted_namespace" /> matches the{" "}
              <R n="pi_ns" /> of the <R n="PrivateInterest" />.
            </P>

            <P>
              Since the announcer does not know the <R n="pi_ss" />{" "}
              of the other peer’s <R n="PrivateInterest" />{" "}
              in this case, the announcer cannot provide the correctly salted
              hash of the other’s <R n="PrivateInterest" /> as a{" "}
              <R n="announcement_authentication" />. For <R n="pi_awkward" />
              {" "}
              pairs, the <R n="announcement_authentication" />{" "}
              is thus the salted hash over the <R n="PrivateInterest" />{" "}
              that was submitted by the other peer, except its <R n="pi_ss" />
              {" "}
              is replaced with <R n="ss_any" />.
            </P>
          </Hsection>
        </Hsection>

        <Hsection n="pio_security_model" title="Security Properties">
          <P>
            We now lay out out the security model of this approach: which data
            gets exposed in which scenarios? We do not have formal proofs for
            any of these claims, these are merely our design goals (which we
            believe to have achieved).
          </P>

          <P>
            Throughout the following, Alfie and Betty are honest peers, Muriarty
            is a malicious peer who may deviate arbitrarily from the WGPS, and
            Epson is an active eavesdropper on the networking layer who can
            read, modify, drop, or insert arbitrary bytes on a WGPS
            communication channel.
          </P>

          <Hsection n="pio_threat_model" title="Threat Model">
            <P>
              We consider two primary scenarios:
            </P>

            <Ul>
              <Li>
                Alfie and Muriarty sync, and Muriarty tries to glean as much
                information from/about Alfie as possible.
              </Li>
              <Li>
                Alfie and Betty sync without knowing any long-term secrets of
                each other, and Epson attacks the session and tries to glean as
                much information from/about Alfie and Betty.
              </Li>
            </Ul>

            <P>
              Note that Epson can simulate a Muriarty, or they could even be the
              same person. Epson is only interesting for cases where Alfie syncs
              with somebody who has more knowledge than Epson, so we do not
              consider the cases where Muriarty and Epson collaborate.
            </P>

            <P>
              If Alfie and Betty know longterm public keys, they can exclude an
              active attacker during the handshake. If only one of them knows a
              longterm secret of the other, Epson is less powerful than in the
              setting where neither knows a longterm secret of the other; hence
              we only analyze the prior scenario.
            </P>
          </Hsection>

          <Hsection n="pio_scope" title="Scope">
            <P>
              We now list the information we wish to keep confidential. We group
              it in four levels, based on which kind of peer or attacker is
              allowed to glean which information.
              <Gwil>
                Worst table styling ever, Alj asks for help. Might need multiple
                rows instead of nested lists?
              </Gwil>
            </P>

            <PreviewScope>
              <Table>
                <Tbody>
                  <Tr>
                    <Th scope="row">
                      <Def n="l0" r="L0" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          <Rs n="Payload" /> of actual <Rs n="Entry" />
                        </Li>
                        <Li>
                          <Rs n="entry_namespace_id" />,{" "}
                          <Rs n="entry_subspace_id" />, <Rs n="entry_path" />
                          {" "}
                          of actual <Rs n="Entry" />
                        </Li>
                        <Li>
                          <Rs n="entry_timestamp" />,{" "}
                          <Rs n="entry_payload_length" />,{" "}
                          <Rs n="entry_payload_digest" /> of actual{" "}
                          <Rs n="Entry" />
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th scope="row">
                      <Def n="l1" r="L1" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          <Rs n="NamespaceId" />, <Rs n="SubspaceId" />,{" "}
                          <Rs n="Path" /> occuring in a{" "}
                          <R n="read_capability" />{" "}
                          that Alfie or Betty transmits.
                        </Li>
                        <Li>
                          <Rs n="NamespaceId" />, <Rs n="SubspaceId" />,{" "}
                          <Rs n="Path" /> in which Alfie or Betty is interested.
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th scope="row">
                      <Def n="l2" r="L2" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          Information occuring in a <R n="read_capability" />
                          {" "}
                          that Alfie or Betty transmits which is neither{" "}
                          <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, nor
                          {" "}
                          <Rs n="Path" />. Examples include:
                          <Ul>
                            <Li>
                              <Rs n="Timestamp" />,
                            </Li>
                            <Li>
                              The <Rs n="dss_pk" /> and <Rs n="dss_signature" />
                              {" "}
                              involved in delegating{" "}
                              <Rs n="read_capability" />. Those{" "}
                              <Rs n="dss_pk" /> which correspond to{" "}
                              <Rs n="NamespaceId" />, <Rs n="SubspaceId" />{" "}
                              are excluded (they belong to <R n="l1" />).
                            </Li>
                          </Ul>
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th scope="row">
                      <Def n="l3" r="L3" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          Fingerprintable session behaviour, such as resource
                          control, error handling, etc. Virtually impossible to
                          list exhaustively.
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </PreviewScope>

            <P>
              We consider fingerprinting, tracking, and deanonymisation based on
              information from <R n="l3" /> to be out of scope of this document.
            </P>
          </Hsection>

          <Hsection n="goals" title="Goals">
            <P>
              We now describe which kind of information can be learned by which
              kind of attacker. A rough summary:
            </P>
            <Ul>
              <Li>
                With a valid{" "}
                <R n="read_capability" />, you can access all corresponding
                information (<R n="l0" /> and below). This is a feature.
              </Li>
              <Li>
                If you know or guess a <R n="PrivateInterest" />{" "}
                without holding a corresponding{" "}
                <R n="read_capability" />, you can access information at{" "}
                <R n="l1" /> and below.
              </Li>
              <Li>
                An active eavesdropper can access everything at <R n="l2" />
                {" "}
                without holding a corresponding <R n="read_capability" />.
              </Li>
            </Ul>

            <P>
              Consequently, <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, and
              {" "}
              <Rs n="Path" />{" "}
              that cannot be guessed are never leaked by using the WGPS.
              Conversely, attackers <Em>can</Em> confirm their guesses about
              {" "}
              <Rs n="PrivateInterest" />{" "}
              to some degree. Hence, it is important to keep{" "}
              <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, and <Rs n="Path" />
              {" "}
              unguessable by introducing sufficient entropy.
            </P>

            <Hsection
              n="sync_with_muriarty"
              title="Syncing with Muriarty"
              shortTitle="Muriarty"
            >
              <PreviewScope>
                <P>
                  When Alfie syncs with a malicious peer Muriarty, Muriarty is
                  able to glean the following information:
                </P>

                <Ul>
                  <Li>
                    If Muriarty has a <R n="read_capability" /> for some{" "}
                    <R n="PrivateInterest" /> <DefValue n="ppi_m_p0" r="p" />:
                    <Ul>
                      <Li>
                        Muriarty can learn all information from <R n="l0" />
                        {" "}
                        and below that pertains to the intersection of{" "}
                        <R n="ppi_m_p0" /> and any <R n="PrivateInterest" />
                        {" "}
                        of Alfie. Muriarty is <Em>allowed</Em>{" "}
                        to access this information, there is nothing malicious
                        about this.
                      </Li>
                    </Ul>
                  </Li>

                  <Li>
                    If Muriarty knows or guesses a <R n="PrivateInterest" />
                    {" "}
                    <DefValue n="ppi_m_p1" r="p" /> which he does not have a
                    {" "}
                    <R n="read_capability" /> for:
                    <Ul>
                      <Li>
                        Muriarty can learn the number of{" "}
                        <R n="pi_more_specific" /> <Rs n="PrivateInterest" />
                        {" "}
                        of Alfie, but nothing else about them.
                      </Li>
                      <Li>
                        Muriarty can learn all <R n="pi_less_specific" />{" "}
                        <Rs n="PrivateInterest" />{" "}
                        of Alfie, as well as all information of <R n="l1" />
                        {" "}
                        and below for those <Rs n="PrivateInterest" />.
                      </Li>
                      <Li>
                        For every <R n="PrivateInterest" />{" "}
                        <DefValue n="ppi_m_pa" r="p_alfie" /> of Alfie such that
                        {" "}
                        <R n="ppi_m_p1" /> and <R n="ppi_m_pa" /> are{" "}
                        <R n="pi_awkward" />:
                        <Ul>
                          <Li>
                            If{" "}
                            <Code>
                              <AccessStruct field="pi_ss">
                                <R n="ppi_m_pa" />
                              </AccessStruct>{" "}
                              == <R n="ss_any" />
                            </Code>, Muriarty learns Alfie’s{" "}
                            <R n="enumeration_capability" /> for the{" "}
                            <R n="namespace" />.
                          </Li>
                          <Li>
                            Otherwise:
                            <Ul>
                              <Li>
                                If Muriarty has an{" "}
                                <R n="enumeration_capability" /> for the{" "}
                                <R n="namespace" />, he learns all information
                                of <R n="l1" /> and below pertaining to{" "}
                                <R n="ppi_m_pa" />.
                              </Li>
                              <Li>
                                If Muriarty does not have an{" "}
                                <R n="enumeration_capability" /> for the{" "}
                                <R n="namespace" />, he learns that{" "}
                                <R n="ppi_m_pa" />{" "}
                                exists, but nothing more about it.
                              </Li>
                            </Ul>
                          </Li>
                        </Ul>
                      </Li>
                    </Ul>
                  </Li>
                </Ul>
              </PreviewScope>
            </Hsection>

            <Hsection
              n="sync_with_epson"
              title="Syncing Attacked By Epson"
              shortTitle="Epson"
            >
              <PreviewScope>
                <P>
                  If Alfie syncs with an honest peer Betty, but an active
                  attacker Epson can read and manipulate the communication
                  channel, that attacker can glean the following information:
                </P>
                <Ul>
                  <Li>
                    Epson can glean anything that a Muriarty can glean.
                  </Li>
                  <Li>
                    If Betty has a <R n="read_capability" /> for some{" "}
                    <R n="PrivateInterest" />{" "}
                    <DefValue n="ppi_e_p0" r="p" />, which Epson has no
                    knowledge about:
                    <Ul>
                      <Li>
                        For every intersecting <R n="PrivateInterest" />{" "}
                        of Alfie’s, Epson can glean the information at{" "}
                        <R n="l2" /> and below.
                      </Li>
                    </Ul>
                  </Li>
                  <Li>
                    If Betty has a <R n="read_capability" /> for some{" "}
                    <R n="PrivateInterest" />{" "}
                    <DefValue n="ppi_e_p1" r="p" />, and Epson knows{" "}
                    <R n="ppi_e_p1" /> but does not have a{" "}
                    <R n="read_capability" /> for it:
                    <Ul>
                      <Li>
                        Epson can learn exactly the same information as if Epson
                        was a Muriarty who guessed <R n="ppi_e_p1" />{" "}
                        but does not have a <R n="read_capability" /> for it.
                      </Li>
                    </Ul>
                  </Li>
                </Ul>
              </PreviewScope>
            </Hsection>
          </Hsection>
        </Hsection>

        <Hsection
          n="mc_enumeration_cap"
          title="Meadowcap Enumeration Capabilities"
        >
          <P>
            We conclude by presenting a datatype that implements{" "}
            <Rs n="enumeration_capability" />, nicely complementing{" "}
            <R n="meadowcap">Meadowcap</R>. Note that in Meadowcap,{" "}
            <Rs n="read_capability" /> for all <Rs n="subspace" /> of a{" "}
            <R n="namespace" /> can only exist in <Rs n="owned_namespace" />.
          </P>

          <Pseudocode n="mc_enumcap_def">
            <StructDef
              comment={
                <>
                  A capability that certifies read access to arbitrary{" "}
                  <Rs n="SubspaceId" /> at some unspecified <R n="Path" />.
                </>
              }
              id={[
                "McEnumerationCapability",
                "McEnumerationCapability",
                "McEnumerationCapabilities",
              ]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        The <R n="namespace" /> for which this grants access.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["namespace_key", "enumcap_namespace"],
                      <R n="NamespacePublicKey" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        The user to whom this initially grants access (the
                        starting point for any further{" "}
                        <R n="enumcap_delegations" />).
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["user_key", "enumcap_user"],
                      <R n="UserPublicKey" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        Authorisation of the <R n="enumcap_user" /> by the{" "}
                        <R n="enumcap_namespace" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      [
                        "initial_authorisation",
                        "enumcap_initial_authorisation",
                      ],
                      <R n="NamespaceSignature" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        Successive authorisations of new{" "}
                        <Rs n="UserPublicKey" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["delegations", "enumcap_delegations"],
                      <SliceType>
                        <TupleType
                          types={[
                            <R n="UserPublicKey" />,
                            <R n="UserSignature" />,
                          ]}
                        />
                      </SliceType>,
                    ],
                  },
                },
              ]}
            />
          </Pseudocode>

          <P>
            The <R n="enumeration_receiver" /> of a{" "}
            <R n="McEnumerationCapability" />{"  "}is the final{" "}
            <R n="UserPublicKey" /> in the <R n="enumcap_delegations" />, or the
            {" "}
            <R n="enumcap_user" /> if the <R n="enumcap_delegations" />{" "}
            are empty.
          </P>

          <P>
            The <R n="enumeration_granted_namespace" /> of a{" "}
            <R n="McEnumerationCapability" /> is its{" "}
            <R n="enumcap_namespace" />.
          </P>

          <P>
            <R n="enumeration_cap_valid">Validity</R> governs how{" "}
            <Rs n="McEnumerationCapability" /> can be delegated. We define{" "}
            <Def
              n="enumeration_cap_valid"
              r="valid"
              preview={
                <>
                  <P>
                    A <R n="McEnumerationCapability" /> is{" "}
                    <Def fake n="enumeration_cap_valid">valid</Def> if its{" "}
                    <R n="enumcap_delegations" /> form a correct chain of{" "}
                    <Rs n="dss_signature" /> over <Rs n="UserPublicKey" />.
                  </P>
                  <P>
                    For the formal definition, click the reference, the proper
                    definition does not fit into a tooltip.
                  </P>
                </>
              }
            >
              validity
            </Def>{" "}
            based on the number of <R n="enumcap_delegations" />:
          </P>

          <P>
            A <R n="McEnumerationCapability" /> with zero{" "}
            <R n="enumcap_delegations" /> is <R n="enumeration_cap_valid" /> if
            {" "}
            <R n="enumcap_initial_authorisation" /> is a{" "}
            <R n="NamespaceSignature" /> issued by the{" "}
            <R n="enumcap_namespace" /> over the byte{" "}
            <Code>0x04</Code>, followed by the <R n="enumcap_user" />{" "}
            (encoded via <R n="encode_user_pk" />).
          </P>

          <PreviewScope>
            <P>
              For a <Rs n="McEnumerationCapability" />{" "}
              <DefValue n="enumcap_defvalid" r="cap" /> with more than zero{" "}
              <R n="enumcap_delegations" />, let{" "}
              <Code>
                (<DefValue n="enumcap_new_user" r="new_user" />,{" "}
                <DefValue n="enumcap_new_signature" r="new_signature" />)
              </Code>{" "}
              be the final pair of{" "}
              <AccessStruct field="enumcap_delegations">
                <R n="enumcap_defvalid" />
              </AccessStruct>, and let{" "}
              <DefValue n="enumcap_prev_cap" r="prev_cap" /> be the{" "}
              <R n="McEnumerationCapability" />{" "}
              obtained by removing the last pair from{" "}
              <AccessStruct field="enumcap_delegations">
                <R n="enumcap_defvalid" />
              </AccessStruct>. Denote the <R n="enumeration_receiver" /> of{" "}
              <R n="enumcap_prev_cap" /> as{" "}
              <DefValue n="enumcap_prev_receiver" r="prev_receiver" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Then <R n="enumcap_defvalid" /> is <R n="enumeration_cap_valid" />
              {" "}
              if <R n="enumcap_prev_cap" /> is{" "}
              <R n="enumeration_cap_valid" />, and{" "}
              <R n="enumcap_new_signature" /> is a <R n="UserSignature" />{" "}
              issued by the <R n="enumcap_prev_receiver" /> over the bytestring
              {" "}
              <Def n="enumcap_handover" r="handover" />, which is defined as
              follows:
            </P>

            <Ul>
              <Li>
                If{" "}
                <AccessStruct field="enumcap_delegations">
                  <R n="enumcap_prev_cap" />
                </AccessStruct>{" "}
                is empty, then <R n="enumcap_handover" />{" "}
                is the concatenation of the following bytestrings:

                <Encoding
                  standalone
                  idPrefix="enumcap_handover1"
                  bitfields={[]}
                  contents={[
                    <CodeFor enc="encode_namespace_sig" isFunction>
                      <AccessStruct field="enumcap_initial_authorisation">
                        <R n="enumcap_prev_cap" />
                      </AccessStruct>
                    </CodeFor>,
                    <CodeFor enc="encode_user_pk" isFunction>
                      <R n="enumcap_new_user" />
                    </CodeFor>,
                  ]}
                />
              </Li>
              <Li>
                Otherwise, let{" "}
                <DefValue n="enumcap_prev_signature" r="prev_signature" />{" "}
                be the <R n="UserSignature" /> in the last pair of{" "}
                <AccessStruct field="enumcap_delegations">
                  <R n="enumcap_prev_cap" />
                </AccessStruct>. Then <R n="enumcap_handover" />{" "}
                is the concatenation of the following bytestrings:

                <Encoding
                  standalone
                  idPrefix="enumcap_handover2"
                  bitfields={[]}
                  contents={[
                    <CodeFor enc="encode_user_sig" isFunction>
                      <R n="enumcap_prev_signature" />
                    </CodeFor>,
                    <CodeFor enc="encode_user_pk" isFunction>
                      <R n="enumcap_new_user" />
                    </CodeFor>,
                  ]}
                />
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);

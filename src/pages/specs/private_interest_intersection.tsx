import { Dir, File } from "macromania-outfs";
import {
  AE,
  Alj,
  AsideBlock,
  Curly,
  NoWrap,
  Path,
  Purple,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import {
  Blockquote,
  Code,
  Details,
  Div,
  Em,
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
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  ChoiceType,
  DefFunction,
  DefType,
  DefValue,
  SliceType,
  StructDef,
  Tuple,
  TupleType,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { Expression, Expressions } from "macromaniajsx/jsx-dev-runtime";

function PiiExample(
  {
    children,
    leftPath,
    rightPath,
    leftSs,
    rightSs,
    overlap,
  }: {
    children?: Expressions;
    leftPath: Expression[];
    rightPath: Expression[];
    leftSs?: Expressions;
    rightSs?: Expressions;
    overlap?: boolean;
  },
): Expression {
  return (
    <Div clazz="piiExample" style="padding: 1rem;">
      <Div clazz="piiExampleLeft">
        {leftSs === undefined ? <R n="area_any" /> : (
          <Purple>
            <exps x={leftSs} />
          </Purple>
        )}
        <Path components={leftPath} />
      </Div>
      <Div clazz="piiExampleRight">
        {rightSs === undefined ? <R n="area_any" /> : (
          <Purple>
            <exps x={rightSs} />
          </Purple>
        )}
        <Path components={rightPath} />
      </Div>
      <Alj inline>TODO: visualise the example.</Alj>
      <Div clazz="piiExampleCaption">
        {overlap
          ? (
            <>
              The <Rs n="PrivateInterest" /> are not <R n="pi_disjoint" />.
            </>
          )
          : (
            <>
              The <Rs n="PrivateInterest" /> are <R n="pi_disjoint" />.
            </>
          )} <exps x={children} />
      </Div>
    </Div>
  );
}

export const private_interest_intersection = (
  <Dir name="pii">
    <File name="index.html">
      <PageTemplate
        htmlTitle="WGPS Confidentiality"
        headingId="private_interest_intersection"
        heading={"WGPS Confidentiality"}
        toc
        bibliography
      >
        <P>
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

        <Hsection n="pii_goals" title="Setting and Goals">
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
                  Meadowcap, our bespoke capability system for Willow, just so
                  happens to provide these semantics with its{" "}
                  <Rs n="Capability" /> of <R n="cap_mode" />{" "}
                  <R n="access_read" />.
                </R>
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
            other before they start the connection, but we also want to be able
            to enable sync between anonymous peers who do not know each other at
            all. Hence, even after the other peer has proven to us that they
            have access to some data, we still must be careful about what we
            send (or rather, how we encrypt it).
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
            it was granted read access. We describe mechanisms for enforcing
            {" "}
            <R n="access_control">read access control here</R>.
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
            A peer <Em>transmits</Em>
            <Alj>This would be nice to have an illustration for.</Alj>{" "}
            hashes salted with <Em>its own</Em> salt, but compares the hashes it
            {" "}
            <Em>receives</Em> against hashes that it computes locally with the
            {" "}
            <Em>other peer’s salt</Em>.
          </P>

          <AsideBlock>
            <P>
              <Alj>
                I think the aside styling could/should scream a lot more loudly
                that this is an aside.
              </Alj>
              A reader well-versed in the literature on{" "}
              <AE href="https://en.wikipedia.org/wiki/Private_set_intersection">
                private set intersection (PSI)
              </AE>{" "}
              might be irritated at this point. The literature is full of papers
              that point out the exchange of (salted) hashes as a rookie
              mistake. A fairly representative example{" "}
              <Bib item="freedman2016efficient"></Bib>:
              <Alj>More obvious blockquote styling</Alj>
              <Alj>
                Citation styling, paper preview styling, bibliography styling(?)
              </Alj>
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
              <Def n="pii_initiator" r="initiator" rs="initiators" /> and the
              {" "}
              <Def n="pii_responder" r="responder" rs="responders" />{" "}
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
                <R n="pii_initiator" /> and the <R n="pii_responder" />{" "}
                respectively,
              </Li>
              <Li>
                during the handshake, the peers prove to each other knowledge of
                the respective secret keys for <R n="pii_initiator" /> and{" "}
                <R n="pii_responder" />, and
              </Li>
              <Li>
                the two peers arrive at a random bytestring<Marginale>
                  In the noise framework, this corresponds to the{" "}
                  <Code>GetHandshakeHash()</Code> function.
                </Marginale>{" "}
                <DefValue n="pii_rnd" r="rnd" />{" "}
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
              The <R n="pii_rnd" /> bytestring{" "}
              forms the basis for the two peers to salt their hashes. We define
              {" "}
              <DefValue n="pii_ini_salt" r="ini_salt" /> as equal to{" "}
              <R n="pii_rnd" />, and <DefValue n="pii_res_salt" r="res_salt" />
              {" "}
              as the bytestring obtained by flipping every bit of{" "}
              <R n="pii_rnd" />.
            </P>
          </PreviewScope>

          <Hsection n="pii_private_interests" title="Private Interests">
            <P>
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
                          <R n="area_any" /> denotes interest in <Em>all</Em>
                          {" "}
                          <Rs n="subspace" /> of the <R n="namespace" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["subspace_id", "pi_ss", "subspace_ids"],
                        <ChoiceType
                          types={[<R n="SubspaceId" />, <R n="area_any" />]}
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
                    == <R n="area_any" />
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
                    == <R n="area_any" />
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
                them has <R n="pi_ss" /> <R n="area_any" /> and a{" "}
                <R n="pi_path" />{" "}
                <DefValue n="pi_awkward_p" r="p" />, and the other has a
                non-<R n="area_any" /> <R n="pi_ss" /> and a <R n="pi_path" />
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
                    == <R n="area_any" />
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
                <R n="area_any" />, then we call the <R n="PrivateInterest" />
                {" "}
                that is equal to <R n="pi1" /> except its <R n="pi_ss" /> is
                {" "}
                <R n="area_any" /> the <Def n="pi_relaxation" r="relaxation" />
                {" "}
                of <R n="pi1" />.
              </P>
            </PreviewScope>
          </Hsection>

          <Hsection
            n="pii_pii"
            title="Private Interest Intersection"
            shortTitle="Private Intersection"
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
                there is a secure hash function <DefFunction n="pii_h" r="h" />
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
                  <DefValue n="pii_hashing_p0" r="p" /> with a <R n="pi_ss" />
                  {" "}
                  of <R n="area_any" />,
                  <Ul>
                    <Li>
                      the <R n="pii_initiator" /> transmits the pair{" "}
                      <Code>
                        (<R n="pii_h" />(<R n="pii_ini_salt" />,{" "}
                        <R n="pii_hashing_p0" />), true)
                      </Code>, and
                    </Li>
                    <Li>
                      the <R n="pii_responder" />
                      <Marginale>
                        Here and below, <R n="pii_responder" /> and{" "}
                        <R n="pii_initiator" />{" "}
                        send the same pairs, except they salt differently.
                      </Marginale>{" "}
                      <Alj>
                        TODO: fix li widths and effects on marginale
                        positioning.
                      </Alj>
                      transmits the pair{" "}
                      <Code>
                        (<R n="pii_h" />(<R n="pii_res_salt" />,{" "}
                        <R n="pii_hashing_p0" />), true)
                      </Code>.
                    </Li>
                  </Ul>
                </Li>
                <Li>
                  For each <R n="PrivateInterest" />{" "}
                  <DefValue n="pii_hashing_p1" r="p" /> with a <R n="pi_ss" />
                  {" "}
                  that is not <R n="area_any" />, let{" "}
                  <DefValue n="pii_hashing_p_relaxed" r="p_relaxed" />{" "}
                  denote the <R n="pi_relaxation" /> of{" "}
                  <R n="pii_hashing_p1" />. Then each peer transmits{" "}
                  <Em>two</Em> pairs:
                  <Ul>
                    <Li>
                      the <R n="pii_initiator" /> transmits the pair{" "}
                      <Code>
                        (<R n="pii_h" />(<R n="pii_ini_salt" />,{" "}
                        <R n="pii_hashing_p1" />), true)
                      </Code>{" "}
                      and the pair{" "}
                      <Code>
                        (<R n="pii_h" />(<R n="pii_ini_salt" />,{" "}
                        <R n="pii_hashing_p_relaxed" />), false)
                      </Code>, and
                    </Li>
                    <Li>
                      the <R n="pii_responder" /> transmits the pair{" "}
                      <Code>
                        (<R n="pii_h" />(<R n="pii_res_salt" />,{" "}
                        <R n="pii_hashing_p1" />), true)
                      </Code>{" "}
                      and the pair{" "}
                      <Code>
                        (<R n="pii_h" />(<R n="pii_res_salt" />,{" "}
                        <R n="pii_hashing_p_relaxed" />), false)
                      </Code>.
                    </Li>
                  </Ul>
                </Li>
                <Li>
                  Peers that wish to hide how many of their{" "}
                  <Rs n="PrivateInterest" /> have a <R n="pi_ss" /> of{" "}
                  <R n="area_any" />{" "}
                  can further send a pair of a random hash and the boolean{" "}
                  <Code>false</Code> for each of their{" "}
                  <Rs n="PrivateInterest" /> with a <R n="pi_ss" /> of{" "}
                  <R n="area_any" />.
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
                the <R n="pii_initiator" /> now salts with{" "}
                <R n="pii_res_salt" /> and the <R n="pii_responder" />{" "}
                now salts with <R n="pii_ini_salt" />, and
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
              <Alj>
                TODO <Code>details</Code> tag styling
              </Alj>
            </P>

            <Details>
              <Summary>
                Examples and Proof Sketch
              </Summary>

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
                can related to each other (equal, non-equal, or{" "}
                <R n="area_any" /> for <Rs n="pi_ss" />, <R n="path_prefix" />,
                {" "}
                <R n="path_extension" />, or <R n="path_related">unrelated</R>
                {" "}
                for <Rs n="pi_path" />).<Alj>TODO: example styling</Alj>
              </P>

              <PiiExample leftPath={["a"]} rightPath={["b"]}>
                None of the hashes match.
              </PiiExample>

              <PiiExample leftPath={["a"]} rightPath={["a", "b"]} overlap>
                The right peer detects an overlap.
              </PiiExample>

              <PiiExample leftPath={["a"]} rightPath={["b"]} rightSs="Gemma">
                None of the hashes match.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                rightPath={["a", "b"]}
                rightSs="Gemma"
                overlap
              >
                The right peer detects an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a", "b"]}
                rightPath={["a"]}
                rightSs="Gemma"
                overlap
              >
                The left peer detects an overlap. This example represents the
                case of <Rs n="pi_awkward" />{" "}
                <Rs n="PrivateInterest" />; this is the onl case in which a
                transmitted hash-boolean pair with a boolean of{" "}
                <Code>false</Code> is involved in detecting an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["b"]}
                rightSs="Gemma"
              >
                None of the hashes match.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["a", "b"]}
                rightSs="Gemma"
                overlap
              >
                The right peer detects an overlap.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["b"]}
                rightSs="Dalton"
              >
                None of the hashes match.
              </PiiExample>

              <PiiExample
                leftPath={["a"]}
                leftSs="Gemma"
                rightPath={["a", "b"]}
                rightSs="Dalton"
              >
                The only matching hashes are <Em>both</Em>{" "}
                accompanied by a boolean of <Code>false</Code>.
              </PiiExample>
            </Details>
          </Hsection>

          <Hsection n="pii_caps" title="Exchanging Capabilities">
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

            <P>
              In general, whenever there is an overlap in the two peer’s{" "}
              <Rs n="PrivateInterest" />, one of three situations occurs:
            </P>
            <Ol>
              <Li>
                One of the <Rs n="PrivateInterest" /> is{" "}
                <R n="pi_strictly_more_specific" />{" "}
                than the other. The peer who has the <R n="pi_more_specific" />
                {" "}
                <R n="PrivateInterest" />{" "}
                is the one to detect the overlap. This peer sends a message to
                the other peer, requesting the <Rs n="read_capability" />{" "}
                that certify read access to the <R n="Area" />{" "}
                <R n="pi_include_area">included in</R> the{" "}
                <R n="pi_more_specific">less specific</R>{" "}
                <R n="PrivateInterest" />.
              </Li>
              <Li>
                Both <Rs n="PrivateInterest" />{" "}
                are equal. Both peers are able to detect this — the matching
                hashes correspond to a <R n="PrivateInterest" /> with a{" "}
                <R n="pi_path" />{" "}
                in which they are themselves directly interested in. The{" "}
                <R n="pii_initiator" /> sends its{" "}
                <Rs n="read_capability" />, the <R n="pii_responder" />{" "}
                does not send anything proactively.
              </Li>
              <Li>
                The two <Rs n="PrivateInterest" /> are{" "}
                <R n="pi_awkward" />. We discuss this case later and ignore it
                for now.
              </Li>
            </Ol>

            <P>
              Upon receiving a request for <Rs n="read_capability" />{" "}
              (case one) or being the <R n="pii_initiator" />{" "}
              and detecting equal <Rs n="PrivateInterest" />{" "}
              (case two), a peer sends its <Rs n="read_capability" /> whose{" "}
              <Rs n="granted_area" /> are <R n="pi_include_area">included</R>
              {" "}
              in the <Rs n="PrivateInterest" />{" "}
              in question. Upon receiving such a{" "}
              <R n="read_capability" />, a peer answers with its own,{" "}
              <R n="area_intersection">intersecting</R>{" "}
              <Rs n="read_capability" />.
            </P>

            <P>
              This scheme is obviously broken if peers can simply request{" "}
              <Rs n="read_capability" /> for <Em>arbitrary</Em>{" "}
              hashes. But we can prevent this by mandating that every request
              contains a{" "}
              <Def
                n="request_authentication"
                r="request authentication"
                rs="request authentications"
              />{" "}
              in the form of the hash of the corresponding{" "}
              <R n="PrivateInterest" />{" "}
              salted with the requester’s salt. So if the{" "}
              <R n="pii_initiator" /> requests{" "}
              <Rs n="read_capability" />, that request must contain the hash
              salted with <R n="pii_ini_salt" />, and requests by the{" "}
              <R n="pii_responder" /> must contain the hash salted with{" "}
              <R n="pii_res_salt" />. These salted hashes can only be produced
              by somebody who actually knows the <R n="PrivateInterest" />{" "}
              in question.
            </P>

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
              and enofreced, how should peers select which{" "}
              <Rs n="PrivateInterest" /> they submit?
            </P>

            <P>
              Imagine two peers, with the exact same 400{" "}
              <Rs n="PrivateInterest" />, but they can each submit only 20 into
              the private intersection process due to resource limits. If they
              each selected 20 of their interests at random, they would likely
              part ways thinking they don't share any common interests. If they
              both sorted their <Rs n="PrivateInterest" />{" "}
              (say, lexicographically according to some agreed-upon encoding)
              and transmitted the first 20 ones, then observers might be able to
              reconstruct some information about their interests.
            </P>

            <P>
              As a solution, both peers should send the{" "}
              <Rs n="PrivateInterest" /> whose hashes, salted with{" "}
              <R n="pii_ini_salt" />, are their numerically least hashes. This
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
              an <R n="pi_awkward" /> pair, it attaches to its request for a
              {" "}
              <R n="read_capability" /> its <R n="enumeration_capability" />
              {" "}
              for the <R n="namespace" />{" "}
              in question, using an encoding that omits all sensitive{" "}
              <Sidenote
                note={
                  <>
                    We provide a{" "}
                    <R n="meadowcap">Meadowcap</R>-like capability type at the
                    {" "}
                    <R n="mc_enumeration_cap">end of this document</R>, and a
                    suitable, confidentiality-preserving{" "}
                    <R n="enc_private_subspace_capabilities">encoding here</R>.
                  </>
                }
              >
                information
              </Sidenote>. The other peer replies to the request only if the
              {" "}
              <R n="enumeration_receiver" /> matches the <R n="ini_pk" /> or the
              {" "}
              <R n="res_pk" /> (depending on role) and the{" "}
              <R n="enumeration_granted_namespace" /> matches the{" "}
              <R n="pi_ns" /> of the <R n="PrivateInterest" />.
            </P>

            <P>
              Since the requester does not know the <R n="pi_ss" />{" "}
              of the other peer’s <R n="PrivateInterest" />{" "}
              in this case, the requester cannot provide the correctly salted
              hash of the other’s <R n="PrivateInterest" /> as a{" "}
              <R n="request_authentication" />. For <R n="pi_awkward" />{" "}
              pairs, the <R n="request_authentication" />{" "}
              is thus the salted hash over the <R n="PrivateInterest" />{" "}
              that was submitted by the other peer, except its <R n="pi_ss" />
              {" "}
              is replaced with <R n="area_any" />.
              <Alj>
                TODO this shouldn't be `area_any` actually, but a generic `any`
                value.
              </Alj>
            </P>

            {
              /*
            pinformative("To solve this standoff, we employ a second type of unforgeable token, that lets Betty prove that she has access to the full <R n="subspace"/> at ", em("some"), " <R n="Path"/>, without specifying that <R n="Path"/> explicitly. Alfie can request this token (by transmitting the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), " of his <R n="read_capability"/>), Betty can then prove that she is indeed authorised to know about arbitrary <Rs n="SubspaceId"/> in this <R n="namespace"/>, and Alfie can then send (and authenticate) his <R n="read_capability"/>, to which Betty replies with her own, proper <R n="read_capability"/>."),

      pinformative("We call these unforgeable tokens ", def({id: "subspace_capability", singular: "subspace capability", plural: "subspace capabilities"}, "subspace capabilities"), ". Whenever a peer is granted a ", r("capability_complete"), " <R n="read_capability"/> of non-empty ", r("AreaPath"), ", it should also be granted a corresponding ", r("subspace_capability"), ". Each ", r("subspace_capability"), " must have a single ", def({ id: "subspace_receiver", singular: "receiver" }), " (a <R n="dss_pk"/> of some <R n="signature_scheme"/>), and a single ", def({ id: "subspace_granted_namespace", singular: "granted namespace" }), " (a <R n="NamespaceId"/>). The ", r("subspace_receiver"), " can authenticate itself by signing a collaboratively selected nonce."),

    ]),

    hsection("subspace_capabilities_meadowcap", "Subspace Capabilities and Meadowcap", [
      pinformative("We conclude by presenting a datatype that implements ", rs("subspace_capability"), ", nicely complementing ", link_name("meadowcap", "Meadowcap"), ". Note that in Meadowcap, <Rs n="read_capability"/> for all <Rs n="subspace"/> of a <R n="namespace"/> can only exist in ", rs("owned_namespace"), "."),

      pseudocode(
        new Struct({
            id: "McSubspaceCapability",
            name: "McSubspaceCapability",
            plural: "McSubspaceCapabilities",
            comment: ["A capability that certifies read access to arbitrary <Rs n="SubspaceId"/> at some unspecified <R n="Path"/>."],
            fields: [
                {
                    id: "subspace_cap_namespace",
                    name: "namespace_key",
                    comment: ["The <R n="namespace"/> for which this grants access."],
                    rhs: r("NamespacePublicKey"),
                },
                {
                    id: "subspace_cap_user",
                    name: "user_key",
                    comment: [
                      pinformative("The user ", em("to whom"), " this grants access."),
                    ],
                    rhs: r("UserPublicKey"),
                },
                {
                    id: "subspace_cap_initial_authorisation",
                    name: "initial_authorisation",
                    comment: [
                      pinformative("Authorisation of the ", r("subspace_cap_user"), " by the ", r("subspace_cap_namespace"), "."),
                    ],
                    rhs: r("NamespaceSignature"),
                },
                {
                    id: "subspace_cap_delegations",
                    name: "delegations",
                    comment: ["Successive authorisations of new ", rs("UserPublicKey"), "."],
                    rhs: pseudo_array(pseudo_tuple(r("UserPublicKey"), r("UserSignature"))),
                },
            ],
        }),
      ),

      pinformative("The ", r("subspace_cap_receiver"), " of a ", r("McSubspaceCapability"), " is the user to whom it grants access. Formally, the ", def({id: "subspace_cap_receiver", singular: "receiver"}), " is the final ", r("UserPublicKey"), " in the ", r("subspace_cap_delegations"), ", or the ", r("subspace_cap_user"), " if the ", r("subspace_cap_delegations"), " are empty."),

      pinformative("The ", r("subspace_cap_granted_namespace"), " of a ", r("McSubspaceCapability"), " is the <R n="namespace"/> for which it certifies access to all <Rs n="subspace"/>. Formally, the ", def({id: "subspace_cap_granted_namespace", singular: "granted namespace"}), " of a ", r("McSubspaceCapability"), " is its ", r("subspace_cap_namespace"), "."),

      pinformative(R("subspace_cap_valid", "Validity"), " governs how ", rs("McSubspaceCapability"), " can be delegated. We define ", def({id: "subspace_cap_valid", singular: "valid"}, "validity", [pinformative("A ", r("McSubspaceCapability"), " is ", def_fake("subspace_cap_valid", "valid"), " if its ", r("subspace_cap_delegations"), " form a correct chain of ", rs("dss_signature"), " over ", rs("UserPublicKey"), "."), pinformative("For the formal definition, click the reference, the proper definition does not fit into a tooltip.")]), " based on the number of ", r("subspace_cap_delegations"), "."),

      pinformative("A ", r("McSubspaceCapability"), " with zero ", r("subspace_cap_delegations"), " is ", r("subspace_cap_valid"), " if ", r("subspace_cap_initial_authorisation"), " is a ", r("NamespaceSignature"), " issued by the ", r("subspace_cap_namespace"), " over the byte ", code("0x02"), ", followed by the ", r("subspace_cap_user"), " (encoded via ", r("encode_user_pk"), ")."),

      pinformative("For a ", rs("McSubspaceCapability"), " ", def_value({id: "subspace_cap_defvalid", singular: "cap"}), " with more than zero ", r("subspace_cap_delegations"), ", let ", code("(", def_value({id: "subspace_new_user", singular: "new_user"}), ", ", def_value({id: "subspace_new_signature", singular: "new_signature"}), ")"), " be the final pair of ", field_access(r("subspace_cap_defvalid"), "subspace_cap_delegations"), ", and let ", def_value({id: "subspace_prev_cap", singular: "prev_cap"}), " be the ", r("McSubspaceCapability"), " obtained by removing the last pair from ", field_access(r("subspace_cap_defvalid"), "subspace_cap_delegations"), ". Denote the  ", r("subspace_cap_receiver"), " of ", r("subspace_prev_cap"), " as ", def_value({id: "subspace_prev_receiver", singular: "prev_receiver"}), "."),

      pinformative("Then ", r("subspace_cap_defvalid"), " is ", r("subspace_cap_valid"), " if ", r("subspace_prev_cap"), " is ", r("subspace_cap_valid"), ", and ", r("subspace_new_signature"), " is a ", r("UserSignature"), " issued by the ", r("subspace_prev_receiver"), " over the bytestring ", def_value({id: "subspace_handover", singular: "handover"}), ", which is defined as follows:"),

      lis(
        [
          "If ", field_access(r("subspace_prev_cap"), "subspace_cap_delegations"), " is empty, then ", r("subspace_handover"), " is the concatenation of the following bytestrings:",
          lis(
            [code(function_call(r("encode_namespace_sig"), field_access(r("subspace_prev_cap"), "subspace_cap_initial_authorisation"))), "."],
            [code(function_call(r("encode_user_pk"), r("subspace_new_user"))), "."],
          ),
        ],
        [
          preview_scope("Otherwise, let ", def_value({id: "subspace_prev_signature", singular: "prev_signature"}), " be the ", r("UserSignature"), " in the last pair of ", field_access(r("subspace_prev_cap"), "subspace_cap_delegations"), "."), " Then ", r("subspace_handover"), " is the concatenation of the following bytestrings:",
          lis(
            [code(function_call(r("encode_user_sig"), r("subspace_prev_signature"))), "."],
            [code(function_call(r("encode_user_pk"), r("subspace_new_user"))), "."],
          ),
        ],
      ),
       */
            }
          </Hsection>
        </Hsection>

        {
          /*


    hsection("private_equality_testing", "Private Equality Testing", [
      pinformative(
        "We start by considering ", def({id: "private_equality_testing_def", singular: "private equality testing"}), ": two peers — Alfie and Betty — who hold a single item each wish to determine whether they hold the same item, without revealing any information about their item in case of inequality. Before giving the precise mathematical formulation, we describe the solution by way of analogy.",
      ),

      marginale_inlineable(img(asset("psi/psi_paint.png"), `A comic visualising private equality testing with one column for each peer. The peers start with two buckets of colour each, a data colour (same for both) and a secret colour (unique for each) per peer. Each peer mixes their two colours, yielding a completely new, unique colour per peer. The peers exchange these new colours, and then each mix their secret colour into what they received. This yields the same colour for both peers! They verify so by exchanging the resulting colours, and then happily toast with their buckets of equally coloured content.`)),

      pinformative(
        "Imagine the items were ", em("colours"), ". Assume colours can easily be mixed with other colours, but unmixing a given colour into its components is impossible. The following procedure then solves the problem:",
      ),

      lis(
        [preview_scope(
          "Alfie and Betty each start with a data colour ", def_value("data_A"), " and ", def_value("data_B"), " respectively.",
        )],
        [preview_scope(
          "Alfie and Betty each randomly select a secret colour ", def_value("secret_A"), " and ", def_value("secret_B"), " respectively.",
        )],
        [
          "They each mix their data colour with their secret colour and send the result to the other person (", code(function_call("mix", r("data_A"), r("secret_A"))), " and ", code(function_call("mix", r("data_B"), r("secret_B"))), ").",
        ],
        [
          "Upon receiving a mixture, they mix their own secret into it, remember the result and also send it to the other person (", code(function_call("mix", function_call("mix", r("data_B"), r("secret_B")), r("secret_A"))), " and ", code(function_call("mix", function_call("mix", r("data_A"), r("secret_A")), r("secret_B"))), ").",
        ],
      ),

      pinformative(
        "If both peers receive the same colour they remembered, then they started with the same data colour, and otherwise they did not. Because unmixing colours is impossible and mixing with a randomly chosen secret colour essentially yields a new random-looking colour, the peers cannot learn anything about each other’s colours in case of ", sidenote("inequality", [
          "Neither can any eavesdropper learn about the data colours. The procedure is highly related to a ", link("Diffie–Hellman key exchange", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange"), " for that reason, and we have borrowed the colour metaphor from its wikipedia page.",
        ]),
        ".",
      ),

      div({style: "clear: right;"}), // this is only temporary, or is it?

      pinformative(
        marginale([
          "Note that the colour analogy is not fully accurate: data colours correspond to group members but secret colours correspond to scalars, which are of a different type than group members.",
        ]),
        "Leaving the world of analogy, the actual cryptographic primitives we use are ", link("finite cyclic groups", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalisation_to_finite_cyclic_groups"), " — such as the ", link("X25519 elliptic curve", "https://en.wikipedia.org/wiki/Curve25519"), " — equipped with a way of serialising group members for transport and with a way of generating pseudo-random group members from the items to test for equality.",
      ),

      pinformative(
        marginale([
          "Do not worry if the mathy description here does not fully make sense to you. We give it for completeness’ sake, but you can grasp the underlying concepts without being familiar with groups and cryptography.",
        ]),
        "Let ", def_type({id: "psi_Items", singular: "Items", plural: "Items"}), " be the set of items for which we want to be able to privately test for equality. Let ", def_type({id: "psi_G", singular: "G"}), " be a ", link("finite cyclic group", "https://en.wikipedia.org/wiki/Cyclic_group"), " with a well-known ", link("generator", "https://en.wikipedia.org/wiki/Generating_set_of_a_group"), " ", def_value({id: "psi_g", singular: "g"}), " and group operation ", def_fn({id: "psi_times", singular: "*"}), ", and let ", def_fn({id: "psi_item_to_group", singular: "item_to_group", math: "item\\_to\\_group"}), " be a hash function from ", r("psi_Items"), " into ", r("psi_G"), ".",
      ),

      pinformative(
        "Now, let ", def({id: "psi_Alfie", singular: "Alfie"}), " be a peer that holds some item ",
        $([def_value$({id: "psi_ialpha", math: "i_{\\alpha}"}), ` \\in `, r$("psi_Items")]),
        " and let ", def({id: "psi_Betty", singular: "Betty"}), " be a peer that holds some item ",
        $([def_value$({id: "psi_ibeta", math: "i_{\\beta}"}), ` \\in `, r$("psi_Items")], "."),
        " Define ",
        $([def_value$({id: "psi_dalpha", math: "d_{\\alpha}"}), " := ", r$("psi_item_to_group"), "(", r$("psi_ialpha"), ")"]),
        " and ",
        $([def_value$({id: "psi_dbeta", math: "d_{\\beta}"}), " := ", r$("psi_item_to_group"), "(", r$("psi_ibeta"), ")"]),
      ),

      pinformative(
        "To privately test for equality of ", $(r$("psi_ialpha")), " and ", $comma(r$("psi_ibeta")),
        " ", r("psi_Alfie"), " and ", r("psi_Betty"), " each randomly select scalars (natural numbers) ",
        $(def_value$({id: "psi_salpha", math: "s_{\\alpha}"})),
        " and ",
        $(def_value$({id: "psi_sbeta", math: "s_{\\beta}"})),
        " respectively. ", R("psi_Alfie"), " then transmits ",
        $([r$("psi_dalpha"), "^{", r$("psi_salpha"), "}"]),
        marginale([$(["x^n := x * x * \\ldots * x"]), " (", $("n"), " times)"]),
        " and ", r("psi_Betty"), " transmits ",
        $dot([r$("psi_dbeta"), "^{", r$("psi_sbeta"), "}"]),
      ),

      pinformative(
        "After receiving these messages, ", r("psi_Alfie"), " answers with ",
        $comma([r$("psi_dbeta"), "^{", r$("psi_sbeta"), " \\cdot ", r$("psi_salpha"), "}"]),
        marginale([
          "They can compute these because ",
          $dot("x^{n \\cdot m} = {(x^n)}^m"),
        ]),
        " and ", r("psi_Betty"), " answers with ",
        $dot([r$("psi_dalpha"), "^{", r$("psi_salpha"), " \\cdot ", r$("psi_sbeta"), "}"]),
      ),

      pinformative(
        "If ", r("psi_G"), " was chosen so that accidental (or maliciously crafted) collisions are unlikely (or infeasible), then ",
        $([r$("psi_ialpha"), " = ", r$("psi_ibeta")]),
        " if and only if ",
        $dot([
          r$("psi_dalpha"), "^{", r$("psi_salpha"), " \\cdot ", r$("psi_sbeta"), "}",
          "=",
          r$("psi_dbeta"), "^{", r$("psi_sbeta"), " \\cdot ", r$("psi_salpha"), "}",
        ]),
        marginale(["Because ", $dot("x^{n \\cdot m} = x^{m \\cdot n}")]),
      ),
    ]),

    hsection("psi_actual", "Private Set Intersection", [
      pinformative(
        "We can generalise the equality test to computing set intersection by essentially sending the same information but for multiple items at once.", marginale(["This technique for private set intersection is due to ", link("Huberman, Franklin, and Hogg", "https://dl.acm.org/doi/pdf/10.1145/336992.337012"), "."]), " We return to the analogy of colours again, before giving the mathematically precise formulation.",
      ),

      pinformative(
        "Suppose Alfie and Betty start with ", em("sets"), " of data colours. They independently (and arbitrarily) number their data colours as ", code(def_value("data_A_0"), ", ", def_value("data_A_1"), ", ..."), " and ", code(def_value("data_B_0"), ", ", def_value("data_B_1"), ", ..."), " respectively.",
      ),

      pinformative(
        "Alfie and Betty still choose only a single random secret (", r("secret_A"), " and ", r("secret_B"), " respectively), and they send the results of mixing each of their data colours with their secret colour individually (",
        code("{0: ", function_call("mix", r("data_A_0"), r("secret_A")), ", ", function_call("mix", r("data_A_1"), r("secret_A")), ", ...", "}"),
        " and ",
        code("{0: ", function_call("mix", r("data_B_0"), r("secret_B")), ", ", function_call("mix", r("data_B_1"), r("secret_B")), ", ...", "}"),
        ").",
      ),

      pinformative(
        "For each numbered colour mix they receive, they reply by adding their own secret, keeping the numbering identical.",
      ),

      pinformative(
        "Any colour that occurs both in the final set of colours they sent and in the final set of colours they received corresponds to a shared data colour, and the numbering tells each of them which of the original colours are shared. But for any other colour, they cannot reconstruct the corresponding original data colour of the other peer.",
      ),

      pinformative(
        "In the formal setting, let ", def({id: "psi_Alfie2", singular: "Alfie"}), " and ", def({id: "psi_Betty2", singular: "Betty"}), " hold sequences of ", rs("psi_Items"), " ",
        $(["(", def_value$({id: "psi_ia0", math: "i\\alpha_0"}), ", ", def_value$({id: "psi_ia1", math: "i\\alpha_1"}), ", \\ldots)"]),
        " and ",
        $(["(", def_value$({id: "psi_ib0", math: "i\\beta_0"}), ", ", def_value$({id: "psi_ib1", math: "i\\beta_1"}), ", \\ldots)"]),
        " that hash to sequences of group members ",
        $(["(", def_value$({id: "psi_da0", math: "d\\alpha_0"}), ", ", def_value$({id: "psi_da1", math: "d\\alpha_1"}), ", \\ldots)"]),
        " and ",
        $(["(", def_value$({id: "psi_db0", math: "d\\beta_0"}), ", ", def_value$({id: "psi_db1", math: "d\\beta_1"}), ", \\ldots)"]),
        " respectively, and let them choose random scalars ",
        $(def_value$({id: "psi_sa", math: "s_{\\alpha}"})),
        " and ",
        $(def_value$({id: "psi_sb", math: "s_{\\beta}"})),
        " again.",
      ),

      pinformative(
        R("psi_Alfie2"), " then transmits ",
        $comma(["({", r$("psi_da0"), "}^{", r$("psi_sa"), "}, {", r$("psi_da1"), "}^{", r$("psi_sa"), "}, \\ldots)"]),
        " and ", r("psi_Betty2"), " transmits ",
        $dot(["({", r$("psi_db0"), "}^{", r$("psi_sb"), "}, {", r$("psi_db1"), "}^{", r$("psi_sb"), "}, \\ldots)"]),
      ),

      pinformative(
        "After receiving these messages, ", r("psi_Alfie2"), " answers with ",
        $comma(["({", r$("psi_db0"), "}^{", r$("psi_sb"), " \\cdot ", r$("psi_sa"), "}, {", r$("psi_db1"), "}^{", r$("psi_sb"), " \\cdot ", r$("psi_sa"), "}, \\ldots)"]),
        " and ", r("psi_Betty2"), " answers with ",
        $dot(["({", r$("psi_da0"), "}^{", r$("psi_sa"), " \\cdot ", r$("psi_sb"), "}, {", r$("psi_da1"), "}^{", r$("psi_sa"), " \\cdot ", r$("psi_sb"), "}, \\ldots)"]),
      ),

      pinformative(
        "For all ", $("i, j \\in \\N"), " such that ",
        $comma("{d\\alpha_i}^{s_\\alpha \\cdot s_\\beta} = {d\\beta_j}^{s_\\beta \\cdot s_\\alpha}"),
        " ", r("psi_Alfie2"), " learns that item ", $("i\\alpha_i"), " is in the intersection, and ", r("psi_Betty2"), " learns that item ", $("i\\beta_j"), " is in the intersection.",
        ),
      ]),

      hsection("psi_dynamic", "Dynamic Sets", [
        pinformative(
          "The algorithm as described so far requires Alfie and Betty to fully know their sets in advance. For the ", r("WGPS"), ", we want to allow for dynamically changing sets — both because peers might learn about new <Rs n="namespace"/> dynamically, and because they might not have enough resources to store group members for the full sets in memory at the same time.",
        ),

        pinformative(
          "We can overcome this limitation with a small change: rather than sending monolithic messages containing lists of group members, we send individual group members together with small numeric identifiers. These identifiers can be used to map responses to the original group members. In particular, we use ", rs("resource_handle"), " for this purpose.",
        ),
      ]),

    hsection("pai_approach", "Private Syncing", [
      pinformative("We now have the necessary tools to describe how two peers can exchange <Rs n="read_capability"/> for their sync interests in a privacy-preserving manner. To recapitulate, we consider two peers — Alfie and Betty — who each hold a set of <Rs n="read_capability"/>. They wish to determine the ", rs("area_intersection"), " of their <Rs n="granted_area"/> without leaking any <Rs n="NamespaceId"/>, <Rs n="SubspaceId"/> or <Rs n="Path"/> that are not covered by the other peer’s <Rs n="read_capability"/>. We now reduce this problem to that of private set intersection."),

      pinformative(
        marginale("We have to introduce a bit of terminology first. Trust us that it will be useful, and also trust us that all attempts to avoid these definitions resulted in unreadable messes."),
        "A <R n="read_capability"/> is called ", def({id: "capability_complete", singular: "complete"}), " if the ", r("AreaSubspace"), " of its <R n="granted_area"/> is ", r("area_any"), ", and it is called ", def({id: "capability_selective", singular: "selective"}), " otherwise."   ,
      ),

      preview_scope(
        p("The ", def({id: "fragment", singular: "fragment"}, "fragments"), " of a ", r("capability_complete"), " <R n="read_capability"/> of <R n="granted_area"/> ", def_value({id: "complete_fragment_area", singular: "area"}), " and <R n="granted_namespace"/> ", def_value({id: "complete_fragment_namespace", singular: "namespace"}), " are the pairs ", code("(", r("complete_fragment_namespace"), ", ", r("complete_fragment_prefix"), ")"), ", such that ", def_value({id: "complete_fragment_prefix", singular: "pre"}), " is a ", r("path_prefix"), marginale([
          "The ", rs("path_prefix"), " of ", path("foo", "bar"), " are the empty <R n="Path"/>, ", path("foo"), ", and ", path("foo", "bar"), " itself.",
        ]), " of ", field_access(r("complete_fragment_area"), "AreaPath"), "."),

        p("The ", rs("fragment"), " of a ", r("capability_selective"), " <R n="read_capability"/> of <R n="granted_area"/> ", def_value({id: "selective_fragment_area", singular: "area"}), " and <R n="granted_namespace"/> ", def_value({id: "selective_fragment_namespace", singular: "namespace"}), " are the pairs ", code("(", r("selective_fragment_namespace"), ", ", r("selective_fragment_prefix"), ")"), " and the triplets ",  code("(", r("selective_fragment_namespace"), ", ", field_access(r("selective_fragment_area"), "AreaSubspace"), ", ", r("selective_fragment_prefix"), ")"), ", such that ", def_value({id: "selective_fragment_prefix", singular: "pre"}), " is a ", r("path_prefix"), " of ", field_access(r("selective_fragment_area"), "AreaPath"), ". The pairs are called ", def({id: "fragment_secondary", singular: "secondary"}), " ", rs("fragment"), ", all other ", rs("fragment"), " (including those of ", r("capability_complete"), " <Rs n="read_capability"/>) are called ", def({id: "fragment_primary", singular: "primary"}), " ", rs("fragment"), "."),

        p("A ", r("fragment"), " whose <R n="Path"/> is the empty <R n="Path"/> is called a ", def({id: "fragment_least_specific", singular: "least-specific"}), " ", r("fragment"), ". A ", r("fragment"), " whose <R n="Path"/> is the ", r("AreaPath"), " of the <R n="granted_area"/> of its originating <R n="read_capability"/> is called a ", def({id: "fragment_most_specific", singular: "most-specific"}), " ", r("fragment"), "."),
      ),

      pinformative("To privately exchange <Rs n="read_capability"/>, Alfie and Betty perform private set intersection with the sets of ", rs("fragment"), " of all their <Rs n="read_capability"/>. Additionally, they transmit for each group member they send whether it corresponds to a ", r("fragment_primary"), " or ", r("fragment_secondary"), " ", r("fragment"), ". The peers can then detect nonempty intersections between their <Rs n="read_capability"/> by checking whether their ", r("fragment_most_specific"), " ", rs("fragment"), " are in the intersection. More precisely, we need to consider three cases:"),

      pinformative("If the ", r("fragment_most_specific"), " ", r("fragment"), " of a peer’s ", r("capability_complete"), " <R n="read_capability"/> is in the intersection, then the peer can safely send (and authenticate) the <R n="read_capability"/> without leaking any information. Together with the <R n="read_capability"/>, the peer should also transmit the ", r("fragment"), ". The other peer can then safely reply with all its <Rs n="read_capability"/> whose ", rs("fragment"), " include the transmitted ", r("fragment"), "."),

      pinformative("The same holds when the ", r("fragment_primary"), " ", r("fragment_most_specific"), " ", r("fragment"), " of a peer’s ", r("capability_selective"), " <R n="read_capability"/> is in the intersection."),

      pinformative("Things are more complicated, however, when the ", r("fragment_secondary"), " ", r("fragment_most_specific"), " ", r("fragment"), " of a peer’s ", r("capability_selective"), " <R n="read_capability"/> is in the intersection, but the corresponding ", r("fragment"), " of the other peer is a ", r("fragment_primary"), " ", sidenote(r("fragment"), [
        "If ", em("both"), " peers’ ", rs("fragment"), " were ", r("fragment_secondary"), ", but their corresponding ", r("fragment_primary"), " ", rs("fragment"), " were not in the intersection, then the <Rs n="read_capability"/> simply would not overlap — the peers would request equal <Rs n="Path"/> in distinct <Rs n="subspace"/>.",
      ]), ". To better understand this case, consider an example:"),

      pinformative("Suppose, in some <R n="namespace"/>, Alfie is interested in the <Rs n="Entry"/> at arbitrary ", rs("entry_path"), " with ", r("entry_subspace_id"), " ", code("@gemmas_stuff"), ". Betty, in the same <R n="namespace"/>, is interested in the <Rs n="Entry"/> whose ", r("entry_path"), " is prefixed by ", path("chess"), ", regardless of their ", r("entry_subspace_id"), ". Then Alfie’s ", r("fragment_secondary"), " ", r("fragment_most_specific"), " ", r("fragment"), " is in the intersection, but his ", r("fragment_primary"), " ", r("fragment_most_specific"), " ", r("fragment"), " is not (and neither is Betty’s ", r("fragment_most_specific"), " ", r("fragment"), ")."),

      pinformative("It might be tempting for Alfie to transmit his <R n="read_capability"/>, but unfortunately, Betty might have fabricated her ", rs("fragment"), ". In this case, Betty would learn about the existance of ", code("@gemmas_stuff"), ", violating our privacy objectives. Alfie could prompt Betty to present ", em("her"), " <R n="read_capability"/> first, instead. But Betty then faces the same problem: Alfie could have fabricated his ", rs("fragment"), ", and he would illegitimately learn about the ", path("chess"), " <R n="Path"/> in that case."),


    ]), */
        }

        <Hr />

        <P>
          <Alj>TODO rewrite given its new position</Alj>
          Data synchronisation via the <R n="sync">WGPS</R>{" "}
          faces a dilemma: on the one hand, we want to opportunistically
          synchronise data with as many peers as we can, on the other hand, we
          want to preserve confidentiality of all data that is guarded by{" "}
          <R n="access_control">access control</R>. This document presents in
          detail how we balance those needs.
        </P>

        <P>
          Data confidentiality goes much further than withholding{" "}
          <Rs n="Payload" />. We need to protect <Rs n="NamespaceId" />,{" "}
          <Rs n="SubspaceId" />, and{" "}
          <Rs n="Path" />. To make things more difficult, we want to keep these
          confidential even when an{" "}
          <AE href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">
            active eavesdropper
          </AE>{" "}
          listens in on a sync connection. We want to allow for synchronisation
          with anonymous peers, but we cannot protect against active
          eavesdropping in those sessions. Hence, we need to be careful which
          information we disclose even to a peer who has read access to some
          certain data.
        </P>

        <Hsection n="wgps_security_model" title="Security Model">
          <P>
            We can now lay out out the security model of the WGPS: which data
            does the WGPS expose in which scenarios? We do not have formal
            proofs for any of these claims, these are merely our design goals
            (which we believe to have achieved).
          </P>

          <P>
            Throughout the following, Alfie and Betty are honest peers, Muriarty
            is a malicious peer who may deviate arbitrarily from the WGPS, and
            Epson is an active eavesdropper on the networking layer who can
            read, modify, drop, or insert arbitrary bytes on a WGPS
            communication channel.
          </P>

          <Hsection n="wgps_threat_model" title="Threat Model">
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

          <Hsection n="pii_scope" title="Scope">
            <P>
              We now list the information we wish to keep confidential. We group
              it in four levels, based on which kind of peer or attacker is
              allowed to glean which information.
              <Alj>
                Worst table styling ever, please send help. Might need multiple
                rows instead of nested lists?
              </Alj>
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
                              == <R n="area_any" />
                            </Code>, Muriarty learns Alfie’s{" "}
                            <R n="subspace_capability" /> for the{" "}
                            <R n="namespace" />.
                          </Li>
                          <Li>
                            Otherwise:
                            <Ul>
                              <Li>
                                If Muriarty has a <R n="subspace_capability" />
                                {" "}
                                for the{" "}
                                <R n="namespace" />, he learns all information
                                of <R n="l1" /> and below pertaining to{" "}
                                <R n="ppi_m_pa" />.
                              </Li>
                              <Li>
                                If Muriarty does not have a{" "}
                                <R n="subspace_capability" /> for the{" "}
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

        <Pseudocode n="ppi_definition">
          <StructDef
            comment={
              <>
                TODO
              </>
            }
            id={[
              "PersonalPrivateInterest",
              "PersonalPrivateInterest",
              "PersonalPrivateInterests",
            ]}
            fields={[
              {
                commented: {
                  comment: (
                    <>
                      TODO
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["private_interest", "ppi_pi"],
                    <R n="PrivateInterest" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      TODO
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["user_key", "ppi_user"],
                    <R n="UserPublicKey" />,
                  ],
                },
              },
            ]}
          />
        </Pseudocode>

        <Pseudocode n="mc_subspace_cap_def">
          <StructDef
            comment={
              <>
                A capability that certifies read access to arbitrary{" "}
                <Rs n="SubspaceId" /> at some unspecified <R n="Path" />.
              </>
            }
            id={[
              "McSubspaceCapability",
              "McSubspaceCapability",
              "McSubspaceCapabilities",
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
                    ["namespace_key", "subspace_cap_namespace"],
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
                      <R n="subspace_cap_delegations" />).
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["user_key", "subspace_cap_user"],
                    <R n="UserPublicKey" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      Authorisation of the <R n="subspace_cap_user" /> by the
                      {" "}
                      <R n="subspace_cap_namespace" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    [
                      "initial_authorisation",
                      "subspace_cap_initial_authorisation",
                    ],
                    <R n="NamespaceSignature" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      Successive authorisations of new <Rs n="UserPublicKey" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["delegations", "subspace_cap_delegations"],
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
      </PageTemplate>
    </File>
  </Dir>
);

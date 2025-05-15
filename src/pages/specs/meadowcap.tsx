import { Dir, File } from "macromania-outfs";
import {
  AE,
  Alj,
  AsideBlock,
  Curly,
  Gwil,
  NoWrap,
  Path,
  Quotes,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, Img, Li, P, Ul } from "macromania-html";
import { Hsection } from "macromania-hsection";
import { PreviewScope } from "macromania-previews";
import { Def, R, Rb, Rs, Rsb } from "macromania-defref";
import {
  AccessStruct,
  ChoiceType,
  DefFunction,
  DefType,
  DefValue,
  SliceType,
  StructDef,
  TupleType,
} from "macromania-rustic";
import { Marginale } from "macromania-marginalia";
import { Pseudocode } from "macromania-pseudocode";
import { ResolveAsset } from "macromania-assets";
import { Tuple } from "macromania-rustic";
import { CodeFor, Encoding, LiteralByte } from "../../encoding_macros.tsx";
import { EncConditional } from "../../encoding_macros.tsx";
import { RawBytes } from "../../encoding_macros.tsx";

export const meadowcap = (
  <Dir name="meadowcap">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Meadowcap"
        headingId="meadowcap"
        heading={"Meadowcap"}
        status="candidate"
        statusDate="17.01.2024"
        toc
        parentId="specifications"
      >
        <P>
          Meadowcap is a capability system for use with Willow. In this
          specification, we assume familiarity with the{" "}
          <R n="data_model">Willow data model</R>.
        </P>

        <Hsection n="meadowcap_overview" title="Overview">
          <P>
            When interacting with a peer in Willow, there are two fundamental
            operations: <Em>writing</Em> data — asking your peer to add{" "}
            <Rs n="Entry" /> to their <Rs n="store" /> — and <Em>reading</Em>
            {" "}
            data — asking your peer to send <Rs n="Entry" />{" "}
            to you. Both operations should be restricted; Willow would be close
            to useless if everyone in the world could (over-)write data
            everywhere, and it would be rather scary if everyone could request
            to read any piece of data.
          </P>

          <P>
            A capability system helps enforce boundaries on who gets to read and
            write which data. A <Em>capability</Em>{" "}
            is an unforgeable token that bestows read or write access for some
            data to a particular person, issued by the owner of that data. When
            Alfie asks Betty for some entries owned by Gemma, then Betty will
            only answer when presented with a valid capability proving that
            Gemma gave read access to Alfie. Similarly, Betty will not integrate
            data created by Alfie in a <R n="subspace" />{" "}
            owned by Gemma, unless the data is accompanied by a capability
            proving that Gemma gave write access to Alfie.
          </P>

          <Img
            src={
              <ResolveAsset asset={["meadowcap", "capability_attempts.png"]} />
            }
            alt={`A two-column comic. The left column first shows Alfie handing a neat slip of paper to Betty. The second panel shows Betty inspecting the paper with a magnifying glass. The magnified text clearly reads "signed: Gemma". In the final panel, a happy Betty hands a box over to a happy Alfie. The right column depicts a less fruitful interaction. A cartoonish troll approaches Betty with a crumpled paper sheet. When Betty inspects it in the second panel, it reads "i AM StiNKY GEMA", clearly not Gemma’s real signature. In the final panel, Betty tells the troll off, not handing over anything.`}
          />

          <P>
            What makes somebody <Quotes>the owner</Quotes> of{" "}
            <Quotes>some data</Quotes>? Meadowcap offers two different models,
            which we call <Rs n="owned_namespace" /> and{" "}
            <Rs n="communal_namespace" />.
          </P>

          <PreviewScope>
            <P>
              <Marginale>
                <Img
                  src={
                    <ResolveAsset
                      asset={["meadowcap", "communal_namespace.png"]}
                    />
                  }
                  alt={`A front view of a stylised house. The house has three separate entries, each with a differently-coloured keyhole. Above each entry is a window in a matching color, each with some happy denizens sticking their heads out. The outer windows contain a single person each, the middle window is shared by two people.`}
                />
                A{" "}
                <R n="communal_namespace" />. Metaphorically, everyone has their
                own private space in the same building.
              </Marginale>

              In a{" "}
              <Def
                n="communal_namespace"
                r="communal namespace"
                rs="communal namespaces"
              />, each <R n="subspace" />{" "}
              is owned by a particular author. This is implemented by using
              public keys of a{" "}
              <AE href="https://en.wikipedia.org/wiki/Digital_signature_scheme">
                digital signature scheme
              </AE>{" "}
              as{" "}
              <Rs n="SubspaceId" />, you then prove ownership by providing valid
              signatures (which requires the corresponding secret key).
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Marginale>
                <Img
                  src={
                    <ResolveAsset
                      asset={["meadowcap", "owned_namespace.png"]}
                    />
                  }
                  alt={`A similar front view of a house, with windows showing the inhabitants. Unlike the preceding drawing, this house only a single door, with an orange keyhole. The three windows each show a combination of orange and an individual color per window. In front of the window stands the owner, dutifully (and cheerfully) maintaining the lawn with a broom.`}
                />
                An{" "}
                <R n="owned_namespace" />. Metaphorically, a single owner
                manages others’ access to their building.
              </Marginale>
              In an{" "}
              <Def
                n="owned_namespace"
                r="owned namespace"
                rs="owned namespaces"
              />, the person who created the <R n="namespace" />{" "}
              is the owner of all its data. To implement this,{" "}
              <Rs n="NamespaceId" /> are public keys. In an{" "}
              <R n="owned_namespace" />, peers reject all requests unless they
              involve a signature from the <R n="namespace" /> keypair; in a
              {" "}
              <R n="communal_namespace" />, peers reject all requests unless
              they involve a signature from the <R n="subspace" /> keypair.
            </P>
          </PreviewScope>

          <P>
            <Rsb n="owned_namespace">Owned namespaces</Rsb>{" "}
            would be quite pointless were it not for the next feature:{" "}
            <Em>capability delegation</Em>. A capability bestows not only access
            rights but also the ability to mint new capabilities for the same
            resources but to another peer. When you create an owned namespace,
            you can invite others to join the fun by delegating read and/or
            write access to them.
          </P>

          <P>
            The implementation relies on signature schemes again. Consider Alfie
            and Betty, each holding a key pair. Alfie can mint a new capability
            for Betty by signing his own capability together with her public
            key.
          </P>

          <P>
            Once Alfie has minted a capability for Betty, Betty can mint one (or
            several) for Gemma, and so on.
          </P>

          <P>
            Verifying whether a delegated capability bestows access rights is
            done recursively: check that the last delegation step is accompanied
            by a valid signature, then verify the capability that was being
            delegated.
          </P>

          <P>
            The next important feature of Meadowcap is that of{" "}
            <Em>restricting</Em>{" "}
            capabilities. Suppose I maintain several code repositories inside my
            personal <R n="subspace" />. I use different <Rs n="Path" />{" "}
            to organise the data pertaining to different repositories, say{" "}
            <Path components={["code", "seasonal-clock"]} /> and{" "}
            <Path components={["code", "earthstar"]} />. If I wanted to give
            somebody write-access to the{" "}
            <Path components={["code", "seasonal-clock"]} />{" "}
            repository, I should <Em>not</Em>{" "}
            simply grant them write access to my complete <R n="subspace" />
            {" "}
            — if I did, they could also write to{" "}
            <Path components={["code", "earthstar"]} />. Or to{" "}
            <Path components={["blog", "embarrassing-facts"]} />{" "}
            for that matter.
          </P>

          <P>
            Hence, Meadowcap allows to <Em>restrict</Em>{" "}
            capabilities, turning them into less powerful ones. Restrictions can
            limit access by <R n="entry_subspace_id" />, by{" "}
            <R n="entry_path" />, and/or by <R n="entry_timestamp" />.
          </P>

          <AsideBlock>
            <P>
              Another typical example of using restrictions is an{" "}
              <R n="owned_namespace" />, whose owner — Owen — gives write
              capabilities for distinct <Rs n="subspace" />{" "}
              to distinct people. Alfie might get the <R n="subspace" /> of{" "}
              <R n="SubspaceId" /> <Code>alfies-things</Code>, Betty would get
              {" "}
              <Code>bettys-things</Code>, and so on. This results in a system
              similar to a{" "}
              <R n="communal_namespace" />, except that Owen has control over
              who gets to participate, and can also remove or change anything
              written by Alfie or Betty. It is however still clear which{" "}
              <Rs n="Entry" />{" "}
              were created by Owen and which were not — Owen cannot impersonate
              anyone.
            </P>

            <P>
              Going even further, Owen might only give out capabilities that are
              valid for one week at a time. If Alfie starts posting abusive
              comments, Owen can delete some or all of Alfie's <Rs n="Entry" />
              {" "}
              by writing <Rs n="Entry" /> to <Code>alfies-things</Code> whose
              {" "}
              <R n="entry_timestamp" /> lies{" "}
              <Em>two weeks in the future</Em>. Any <Rs n="Entry" />{" "}
              Alfie can create are immediately overwritten by Owen's{" "}
              <Rs n="Entry" />{" "}
              from the future. Owen probably will not give Alfie a new
              capability at the end of the week either, effectively removing
              Alfie from the space.
            </P>

            <P>
              Using these techniques, Willow can support moderated spaces
              similar to, for example, the fediverse. And Owen can create
              powerful capabilities that allow other, trusted people to help
              moderating the space. If the idea of a privileged group of users
              who can actively shape what happens in a <R n="namespace" />{" "}
              makes you feel safe and unburdened, <Rs n="owned_namespace" />
              {" "}
              might be for you. If it sounds like an uncomfortable level of
              control and power, you might prefer{" "}
              <Rs n="communal_namespace" />. Meadowcap supports both, because we
              believe that both kinds of spaces fulfil important roles.
            </P>
          </AsideBlock>

          <P>
            <Marginale>
              If it helps to have some code to look at, there's also a Rust{" "}
              <AE href="https://github.com/earthstar-project/willow-rs/tree/main/meadowcap/src">
                reference implementation
              </AE>{" "}
              of Meadowcap.
            </Marginale>

            This concludes the intuitive overview of Meadowcap. The remainder of
            this document is rather formal: capabilities are a security feature,
            so we have to be fully precise when defining them.
          </P>
        </Hsection>

        <Hsection n="meadowcap_parameters" title="Parameters">
          <P>
            Like the Willow data model, Meadowcap is generic and needs to be
            instantiated with concrete choices for the parameters we describe in
            this section.
          </P>

          <P>
            Meadowcap makes heavy use of{" "}
            <AE href="https://en.wikipedia.org/wiki/Digital_signature">
              digital signature schemes
            </AE>; it assumes that Willow uses public keys as{" "}
            <Rs n="NamespaceId" /> and <Rs n="SubspaceId" />.
          </P>

          <PreviewScope>
            <P>
              A{" "}
              <Def
                n="signature_scheme"
                r="signature scheme"
                rs="signature schemes"
              />{" "}
              consists of three algorithms:
            </P>
            <Ul>
              <Li>
                <DefFunction n="dss_generate_keys" r="generate_keys" /> maps a
                {" "}
                <DefType n="dss_seed" r="seed" rs="seeds" /> to a{" "}
                <DefType n="dss_pk" r="public key" rs="public keys" /> and a
                {" "}
                <Def n="correspond">corresponding</Def>{" "}
                <DefType n="dss_sk" r="secret key" rs="secret keys" />.
              </Li>
              <Li>
                <DefFunction n="dss_sign" r="sign" /> maps a <R n="dss_sk" />
                {" "}
                and a bytestring to a{" "}
                <DefType n="dss_signature" r="signature" rs="signatures" />{" "}
                of the bytestring.
              </Li>
              <Li>
                <DefFunction n="dss_verify" r="verify" /> takes a{" "}
                <R n="dss_pk" />, a{" "}
                <R n="dss_signature" />, and a bytestring, and returns whether
                the <R n="dss_signature" /> has been created with the{" "}
                <R n="dss_sk" /> that <R n="correspond">corresponds</R>{" "}
                to the given <R n="dss_pk" />.
              </Li>
            </Ul>
          </PreviewScope>

          <P>
            An instantiation of Meadowcap must define concrete choices of the
            following parameters:
          </P>

          <Ul>
            <Li>
              <Marginale>
                In{" "}
                <Rs n="owned_namespace" />, all valid capabilities stem from
                knowing a particular <R n="dss_sk" /> of the{" "}
                <R n="namespace_signature_scheme" />.
              </Marginale>
              A <R n="signature_scheme" />{" "}
              <DefValue
                n="namespace_signature_scheme"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="signature_scheme" /> from which authority stems in
                    {" "}
                    <Rs n="owned_namespace" />.
                  </P>
                }
              />{" "}
              consisting of algorithms{" "}
              <DefFunction
                n="namespace_generate_keys"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="dss_generate_keys" /> function of the{" "}
                    <R n="namespace_signature_scheme" />.
                  </P>
                }
              />,{" "}
              <DefFunction
                n="namespace_sign"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the <R n="dss_sign" />
                    {" "}
                    function of the <R n="namespace_signature_scheme" />.
                  </P>
                }
              />, and{" "}
              <DefFunction
                n="namespace_verify"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the <R n="dss_verify" />
                    {" "}
                    function of the <R n="namespace_signature_scheme" />.
                  </P>
                }
              />. The <Rs n="dss_pk" /> have type{" "}
              <DefType
                n="NamespacePublicKey"
                rs="NamespacePublicKeys"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the type of{" "}
                    <Rs n="dss_pk" /> of the{" "}
                    <R n="namespace_signature_scheme" />.
                  </P>
                }
              />, and the <Rs n="dss_signature" /> have type{" "}
              <DefType
                n="NamespaceSignature"
                rs="NamespaceSignatures"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the type of{" "}
                    <Rs n="dss_signature" /> of the{" "}
                    <R n="namespace_signature_scheme" />.
                  </P>
                }
              />.
            </Li>
            <Li>
              An <R n="encoding_function" />{" "}
              <DefFunction
                n="encode_namespace_pk"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="encoding_function" /> of <R n="NamespacePublicKey" />.
                  </P>
                }
              />{" "}
              for <R n="NamespacePublicKey" />.
            </Li>
            <Li>
              An <R n="encoding_function" />{" "}
              <DefFunction
                n="encode_namespace_sig"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="encoding_function" /> of <R n="NamespaceSignature" />.
                  </P>
                }
              />{" "}
              for <R n="NamespaceSignature" />.
            </Li>

            <Li>
              <Marginale>
                Users identities are <Rs n="dss_pk" /> of the{" "}
                <R n="user_signature_scheme" />. Further, <Rs n="SubspaceId" />
                {" "}
                must be <Rs n="dss_pk" /> of the <R n="user_signature_scheme" />
                {" "}
                as well. In{" "}
                <Rs n="communal_namespace" />, all valid capabilities stem from
                knowing a particular <R n="dss_pk" /> of the{" "}
                <R n="user_signature_scheme" />.
              </Marginale>
              A <R n="signature_scheme" />{" "}
              <DefValue
                n="user_signature_scheme"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="signature_scheme" /> from which authority stems in
                    {" "}
                    <Rs n="communal_namespace" />, and and which is used when
                    delegating capabilities.
                  </P>
                }
              />{" "}
              consisting of algorithms{" "}
              <DefFunction
                n="user_generate_keys"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="dss_generate_keys" /> function of the{" "}
                    <R n="user_signature_scheme" />.
                  </P>
                }
              />,{" "}
              <DefFunction
                n="user_sign"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the <R n="dss_sign" />
                    {" "}
                    function of the <R n="user_signature_scheme" />.
                  </P>
                }
              />, and{" "}
              <DefFunction
                n="user_verify"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the <R n="dss_verify" />
                    {" "}
                    function of the <R n="user_signature_scheme" />.
                  </P>
                }
              />. The <Rs n="dss_pk" /> have type{" "}
              <DefType
                n="UserPublicKey"
                rs="UserPublicKeys"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the type of{" "}
                    <Rs n="dss_pk" /> of the <R n="user_signature_scheme" />.
                  </P>
                }
              />, and the <Rs n="dss_signature" /> have type{" "}
              <DefType
                n="UserSignature"
                rs="UserSignatures"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the type of{" "}
                    <Rs n="dss_signature" /> of the{" "}
                    <R n="user_signature_scheme" />.
                  </P>
                }
              />.
            </Li>
            <Li>
              An <R n="encoding_function" />{" "}
              <DefFunction
                n="encode_user_pk"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="encoding_function" /> of <R n="UserPublicKey" />.
                  </P>
                }
              />{" "}
              for <R n="UserPublicKey" />.
            </Li>
            <Li>
              An <R n="encoding_function" />{" "}
              <DefFunction
                n="encode_user_sig"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the{" "}
                    <R n="encoding_function" /> of <R n="UserSignature" />.
                  </P>
                }
              />{" "}
              for <R n="UserSignature" />.
            </Li>

            <Li>
              A function{" "}
              <DefFunction
                n="is_communal"
                preview={
                  <P>
                    A protocol parameter of Meadowcap, a function from{" "}
                    <Rs n="NamespacePublicKey" /> to{" "}
                    <Rs n="Bool" />, deciding whether a <R n="namespace" /> is
                    {" "}
                    <R n="communal_namespace">communal</R> or{" "}
                    <R n="owned_namespace">owned</R>.
                  </P>
                }
              />{" "}
              that maps <Rs n="NamespacePublicKey" />{" "}
              to booleans, determining whether a <R n="namespace" />{" "}
              of a particular <R n="NamespaceId" /> is{" "}
              <R n="communal_namespace">communal</R> or{" "}
              <R n="owned_namespace">owned</R>.
            </Li>

            <Li>
              Limits on the sizes of the <Rs n="Path" /> and their{" "}
              <Rs n="Path" /> that can appear in capabilities:
              <Ul>
                <Li>
                  A natural number{" "}
                  <DefValue
                    n="mc_max_component_length"
                    r="max_component_length"
                    preview={
                      <P>
                        A protocol parameter of Meadowcap, the maximal length of
                        individual <Rs n="Component" />.
                      </P>
                    }
                  />{" "}
                  for limiting the length of individual <Rs n="Component" />.
                </Li>
                <Li>
                  A natural number{" "}
                  <DefValue
                    n="mc_max_component_count"
                    r="max_component_count"
                    preview={
                      <P>
                        A protocol parameter of Meadowcap, the maximal number of
                        {" "}
                        <Rs n="Component" /> in a single <R n="Path" />.
                      </P>
                    }
                  />{" "}
                  for limiting the number of <Rs n="Component" /> per{" "}
                  <R n="Path" />.
                </Li>
                <Li>
                  A natural number{" "}
                  <DefValue
                    n="mc_max_path_length"
                    r="max_path_length"
                    preview={
                      <P>
                        A protocol parameter of Meadowcap, the maximal sum of
                        the lengths of the <Rs n="Component" /> of a single{" "}
                        <R n="Path" />.
                      </P>
                    }
                  />{" "}
                  for limiting the overall size <Rs n="Path" />.
                </Li>
              </Ul>
            </Li>
          </Ul>

          <PreviewScope>
            <P>
              A Meadowcap instantiation is{" "}
              <Def n="mc_compatible" r="compatible" /> with Willow if
              <Ul>
                <Li>
                  the Willow parameter <R n="NamespaceId" />{" "}
                  is equal to the Meadowcap parameter{" "}
                  <R n="NamespacePublicKey" />,
                </Li>
                <Li>
                  the Willow parameter <R n="SubspaceId" />{" "}
                  is equal to the Meadowcap parameter{" "}
                  <R n="UserPublicKey" />, and
                </Li>
                <Li>
                  the Willow parameters <R n="max_component_length" />,{" "}
                  <R n="max_component_count" />, and <R n="max_path_length" />
                  {" "}
                  are equal to the Meadowcap parameters{" "}
                  <R n="mc_max_component_length" />,{" "}
                  <R n="mc_max_component_count" />, and{" "}
                  <R n="mc_max_path_length" /> respectively.
                </Li>
              </Ul>
            </P>

            <P>
              Throughout the Meadowcap specification, we use these pairs of
              parameters interchangeably.
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection n="capabilities" title="Capabilities">
          <P>
            <Marginale>
              <Img
                src={
                  <ResolveAsset
                    asset={["meadowcap", "capability_semantics.png"]}
                  />
                }
                alt={`A neat piece of paper, styled like an admission ticket, with a heading saying "This Capability Grants...". The heading is followed by four sections. The first section states the receiver as "Alfie", the second section states the granting of "read access", the third section gives a time range of "all messages from last week", and, finally, a large stamp mark simply says "valid".`}
              />
            </Marginale>
            Intuitively, a capability should be some piece of data that answers
            four questions: To whom does it grant access? Does it grant read or
            write access? For which <Rs n="Entry" />{" "}
            does it grant access? And finally, is it valid or a forgery?
          </P>

          <P>
            We define three types that provide these semantics: one for
            implementing <Rs n="communal_namespace" />, one for implementing
            {" "}
            <Rs n="owned_namespace" />, and one for combining both.
          </P>

          <Hsection n="communal_capabilities" title="Communal Namespaces">
            <Pseudocode n="communal_capability_definition">
              <StructDef
                comment={
                  <>
                    A capability that implements <Rs n="communal_namespace" />
                  </>
                }
                id={[
                  "CommunalCapability",
                  "CommunalCapability",
                  "CommunalCapabilities",
                ]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The kind of access this grants.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["access_mode", "communal_cap_access_mode"],
                        <ChoiceType
                          types={[
                            <R n="access_read" />,
                            <R n="access_write" />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="namespace" /> in which this grants access.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["namespace_key", "communal_cap_namespace"],
                        <R n="NamespacePublicKey" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="subspace" /> <Em>for which</Em> and{" "}
                          <Em>to whom</Em>{" "}
                          this grants access (remember that we assume{" "}
                          <R n="SubspaceId" /> and <R n="UserPublicKey" />{" "}
                          to be the same types).
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["user_key", "communal_cap_user"],
                        <R n="UserPublicKey" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Successive authorisations of new{" "}
                          <Rs n="UserPublicKey" />, each restricted to a
                          particular <R n="Area" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["delegations", "communal_cap_delegations"],
                        <SliceType>
                          <TupleType
                            types={[
                              <R n="Area" />,
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

            <PreviewScope>
              <P>
                The{" "}
                <Def n="communal_cap_mode" r="access mode" rs="access modes" />
                {" "}
                of a <R n="CommunalCapability" />{" "}
                <DefValue n="communal_mode_cap" r="cap" /> is{" "}
                <Code>
                  <AccessStruct field="communal_cap_access_mode">
                    communal_mode_cap
                  </AccessStruct>
                </Code>.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <R n="communal_cap_receiver" /> of a{" "}
                <R n="CommunalCapability" />{" "}
                is the user to whom it grants access. Formally, the{" "}
                <Def n="communal_cap_receiver" r="receiver" rs="receivers" />
                {" "}
                is the final <R n="UserPublicKey" /> in the{" "}
                <R n="communal_cap_delegations" />, or the{" "}
                <R n="communal_cap_user" /> if the{" "}
                <R n="communal_cap_delegations" /> are empty.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <R n="communal_cap_granted_namespace" /> of a{" "}
                <R n="CommunalCapability" /> is the <R n="namespace" />{" "}
                for which it grants access. Formally, the{" "}
                <Def
                  n="communal_cap_granted_namespace"
                  r="granted namespace"
                  rs="granted namespaces"
                />{" "}
                of a <R n="CommunalCapability" /> is its{" "}
                <R n="communal_cap_namespace" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <R n="communal_cap_granted_area" /> of a{" "}
                <R n="CommunalCapability" /> is the <R n="Area" />{" "}
                for which it grants access. Formally, the{" "}
                <Def
                  n="communal_cap_granted_area"
                  r="granted area"
                  rs="granted areas"
                />{" "}
                of a <R n="CommunalCapability" /> is the final <R n="Area" />
                {" "}
                in the <R n="communal_cap_delegations" />, or the{" "}
                <R n="subspace_area" /> of the <R n="communal_cap_user" />{" "}
                if the <R n="communal_cap_delegations" /> are empty.
              </P>
            </PreviewScope>

            <P>
              <Rb n="communal_cap_valid">Validity</Rb> governs how{" "}
              <Rs n="CommunalCapability" />{" "}
              can be delegated and restricted. We define{" "}
              <Def
                n="communal_cap_valid"
                r="valid"
                preview={
                  <>
                    <P>
                      A <R n="CommunalCapability" /> is{" "}
                      <Def n="communal_cap_valid" fake>valid</Def> if its{" "}
                      <R n="communal_cap_delegations" /> form a correct chain of
                      {" "}
                      <Rs n="dss_signature" /> over{" "}
                      <Rs n="UserPublicKey" />, and if the <Rs n="Area" />{" "}
                      form a chain of containment.
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
              based on the number of <R n="communal_cap_delegations" />.
            </P>

            <P>
              Every <R n="CommunalCapability" /> with zero{" "}
              <R n="communal_cap_delegations" /> is{" "}
              <R n="communal_cap_valid" />.
            </P>

            <PreviewScope>
              <P>
                For a <R n="CommunalCapability" />{" "}
                <DefValue n="communal_cap_defvalid" r="cap" />{" "}
                with more than zero <R n="communal_cap_delegations" />, let{" "}
                <Code>
                  <Tuple
                    fields={[
                      <DefValue n="communal_new_area" r="new_area" />,
                      <DefValue n="communal_new_user" r="new_user" />,
                      <DefValue n="communal_new_signature" r="new_signature" />,
                    ]}
                  />
                </Code>{" "}
                be the final triplet of{" "}
                <AccessStruct field="communal_cap_delegations">
                  <R n="communal_cap_defvalid" />
                </AccessStruct>, and let{" "}
                <DefValue n="communal_prev_cap" r="prev_cap" /> be the{" "}
                <R n="CommunalCapability" />{" "}
                obtained by removing the last triplet from{" "}
                <AccessStruct field="communal_cap_delegations">
                  <R n="communal_cap_defvalid" />
                </AccessStruct>. Denote the <R n="communal_cap_receiver" /> of
                {" "}
                <R n="communal_prev_cap" /> as{" "}
                <DefValue n="communal_prev_receiver" r="prev_receiver" />, and
                the <R n="communal_cap_granted_area" /> of{" "}
                <R n="communal_prev_cap" /> as{" "}
                <DefValue n="communal_prev_area" r="prev_area" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                Then <R n="communal_cap_defvalid" /> is{" "}
                <R n="communal_cap_valid" /> if <R n="communal_prev_cap" /> is
                {" "}
                <R n="communal_cap_valid" />, the{" "}
                <R n="communal_cap_granted_area" /> of{" "}
                <R n="communal_prev_cap" />{" "}
                <R n="area_include_area">includes</R>{" "}
                <R n="communal_new_area" />, and{" "}
                <R n="communal_new_signature" /> is a <R n="UserSignature" />
                {" "}
                issued by the <R n="communal_prev_receiver" />{" "}
                over the bytestring{" "}
                <DefValue n="communal_handover" r="handover" />, which is
                defined as follows:
              </P>

              <Ul>
                <Li>
                  If{" "}
                  <AccessStruct field="communal_cap_delegations">
                    <R n="communal_prev_cap" />
                  </AccessStruct>{" "}
                  is empty, then <R n="communal_handover" />{" "}
                  is the concatenation of the following bytestrings:<Gwil>
                    make styling adjustments
                  </Gwil>

                  <Encoding
                    standalone
                    idPrefix="communal_handover1"
                    bitfields={[]}
                    contents={[
                      <EncConditional
                        condition={
                          <>
                            <AccessStruct field="communal_cap_access_mode">
                              <R n="communal_prev_cap" />
                            </AccessStruct>{" "}
                            is <R n="access_read" />
                          </>
                        }
                        otherwise={
                          <LiteralByte lowercase noPeriod>0x01</LiteralByte>
                        }
                      >
                        <LiteralByte lowercase noPeriod>0x00</LiteralByte>
                      </EncConditional>,
                      <CodeFor enc="encode_namespace_pk" isFunction>
                        <AccessStruct field="communal_cap_namespace">
                          <R n="communal_prev_cap" />
                        </AccessStruct>
                      </CodeFor>,
                      <CodeFor enc="encode_area_in_area" isFunction>
                        <AccessStruct field="communal_new_area">
                          <R n="communal_prev_area" />
                        </AccessStruct>
                      </CodeFor>,
                      <CodeFor enc="encode_user_pk" isFunction>
                        <R n="communal_new_user" />
                      </CodeFor>,
                    ]}
                  />
                </Li>
                <Li>
                  Otherwise, let{" "}
                  <DefValue n="communal_prev_signature" r="prev_signature" />
                  {" "}
                  be the <R n="UserSignature" /> in the last triplet of{" "}
                  <AccessStruct field="communal_cap_delegations">
                    <R n="communal_prev_cap" />
                  </AccessStruct>. Then <R n="communal_handover" />{" "}
                  is the concatenation of the following bytestrings:

                  <Encoding
                    standalone
                    idPrefix="communal_handover2"
                    bitfields={[]}
                    contents={[
                      <CodeFor
                        enc="encode_area_in_area"
                        isFunction
                        relativeTo={<R n="communal_prev_area" />}
                      >
                        <R n="communal_new_area" />
                      </CodeFor>,
                      <CodeFor enc="encode_user_sig" isFunction>
                        <R n="communal_prev_signature" />
                      </CodeFor>,
                      <CodeFor enc="encode_user_pk" isFunction>
                        <R n="communal_new_user" />
                      </CodeFor>,
                    ]}
                  />
                </Li>
              </Ul>
            </PreviewScope>
          </Hsection>

          <Hsection n="owned_capabilities" title="Owned Namespaces">
            <P>
              <Gwil inline>Make the indentation bars seamless again.</Gwil>
            </P>
            <Pseudocode n="owned_capability_definition">
              <StructDef
                comment={
                  <>
                    A capability that implements <Rs n="owned_namespace" />
                  </>
                }
                id={[
                  "OwnedCapability",
                  "OwnedCapability",
                  "OwnedCapabilities",
                ]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The kind of access this grants.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["access_mode", "owned_cap_access_mode"],
                        <ChoiceType
                          types={[
                            <R n="access_read" />,
                            <R n="access_write" />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="namespace" /> for which this grants access.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["namespace_key", "owned_cap_namespace"],
                        <R n="NamespacePublicKey" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The user <Em>to whom</Em>{" "}
                          this grants access; granting access for the full{" "}
                          <R n="owned_cap_namespace" />, not just to a{" "}
                          <R n="subspace" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["user_key", "owned_cap_user"],
                        <R n="UserPublicKey" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Authorisation of the <R n="owned_cap_user" /> by the
                          {" "}
                          <R n="owned_cap_namespace" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "initial_authorisation",
                          "owned_cap_initial_authorisation",
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
                          <Rs n="UserPublicKey" />, each restricted to a
                          particular <R n="Area" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["delegations", "owned_cap_delegations"],
                        <SliceType>
                          <TupleType
                            types={[
                              <R n="Area" />,
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

            <PreviewScope>
              <P>
                The <Def n="owned_cap_mode" r="access mode" /> of an{" "}
                <R n="OwnedCapability" />{" "}
                <DefValue n="owned_mode_cap" r="cap" /> is{" "}
                <AccessStruct field="owned_cap_access_mode">
                  <R n="owned_mode_cap" />
                </AccessStruct>.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <R n="owned_cap_receiver" /> of an <R n="OwnedCapability" />
                {" "}
                is the user to whom it grants access. Formally, the{" "}
                <Def n="owned_cap_receiver" r="receiver" /> is the final{" "}
                <R n="UserPublicKey" /> in the{" "}
                <R n="owned_cap_delegations" />, or the <R n="owned_cap_user" />
                {" "}
                if the <R n="owned_cap_delegations" /> are empty.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <R n="owned_cap_granted_namespace" /> of an{" "}
                <R n="OwnedCapability" /> is the <R n="namespace" />{" "}
                for which it grants access. Formally, the{" "}
                <Def n="owned_cap_granted_namespace" r="granted namespace" />
                {" "}
                of an <R n="OwnedCapability" /> is its{" "}
                <R n="owned_cap_namespace" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <R n="owned_cap_granted_area" /> of an{" "}
                <R n="OwnedCapability" /> is the <R n="Area" />{" "}
                for which it grants access. Formally, the{" "}
                <Def n="owned_cap_granted_area" r="granted area" /> of an{" "}
                <R n="OwnedCapability" /> is the final <R n="Area" /> in its
                {" "}
                <R n="owned_cap_delegations" /> if the{" "}
                <R n="owned_cap_delegations" />{" "}
                are non-empty. Otherwise, it is the <R n="full_area" />.
              </P>
            </PreviewScope>

            <P>
              <R n="owned_cap_valid">Validity</R> governs how{" "}
              <Rs n="OwnedCapability" />{" "}
              can be delegated and restricted. We define{" "}
              <Def
                n="owned_cap_valid"
                r="valid"
                preview={
                  <>
                    <P>
                      An <R n="OwnedCapability" /> is{" "}
                      <Def n="owned_cap_valid" fake>valid</Def> if its{" "}
                      <R n="owned_cap_delegations" /> form a correct chain of
                      {" "}
                      <Rs n="dss_signature" /> over{" "}
                      <Rs n="UserPublicKey" />, and if the <Rs n="Area" />{" "}
                      form a chain of containment.
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
              based on the number of <R n="owned_cap_delegations" />.
            </P>

            <PreviewScope>
              <P>
                An <R n="OwnedCapability" />{" "}
                <DefValue n="owned_cap_valid_zero_val" r="cap" /> with zero{" "}
                <R n="owned_cap_delegations" /> is <R n="owned_cap_valid" />
                {" "}
                if its <R n="owned_cap_initial_authorisation" /> is a{" "}
                <R n="NamespaceSignature" /> issued by the{" "}
                <R n="owned_cap_namespace" />{" "}
                over the following concatenation of bytes:
              </P>
            </PreviewScope>

            <Encoding
              standalone
              idPrefix="owned_initial"
              bitfields={[]}
              contents={[
                <EncConditional
                  condition={
                    <>
                      <AccessStruct field="owned_cap_access_mode">
                        <R n="owned_cap_valid_zero_val" />
                      </AccessStruct>{" "}
                      is <R n="access_read" />
                    </>
                  }
                  otherwise={<LiteralByte lowercase noPeriod>0x03</LiteralByte>}
                >
                  <LiteralByte lowercase noPeriod>0x02</LiteralByte>
                </EncConditional>,
                <CodeFor enc="encode_user_pk" isFunction>
                  <AccessStruct field="owned_cap_user">
                    <R n="owned_cap_valid_zero_val" />
                  </AccessStruct>
                </CodeFor>,
              ]}
            />

            <PreviewScope>
              <P>
                For an <Rs n="OwnedCapability" />{" "}
                <DefValue n="owned_cap_defvalid" r="cap" /> with more than zero
                {" "}
                <R n="owned_cap_delegations" />, let{" "}
                <Code>
                  <Tuple
                    fields={[
                      <DefValue n="owned_new_area" r="new_area" />,
                      <DefValue n="owned_new_user" r="new_user" />,
                      <DefValue n="owned_new_signature" r="new_signature" />,
                    ]}
                  />
                </Code>{" "}
                be the final triplet of{" "}
                <AccessStruct field="owned_cap_delegations">
                  <R n="owned_cap_defvalid" />
                </AccessStruct>, and let{" "}
                <DefValue n="owned_prev_cap" r="prev_cap" /> be the{" "}
                <R n="OwnedCapability" />{" "}
                obtained by removing the last triplet from{" "}
                <AccessStruct field="owned_cap_delegations">
                  <R n="owned_cap_defvalid" />
                </AccessStruct>. Denote the <R n="owned_cap_receiver" /> of{" "}
                <R n="owned_prev_cap" /> as{" "}
                <DefValue n="owned_prev_receiver" r="prev_receiver" />, and the
                {" "}
                <R n="owned_cap_granted_area" /> of <R n="owned_prev_cap" /> as
                {" "}
                <DefValue n="owned_prev_area" r="prev_area" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                Then <R n="owned_cap_defvalid" /> is <R n="owned_cap_valid" />
                {" "}
                if <R n="owned_prev_cap" /> is <R n="owned_cap_valid" />, the
                {" "}
                <R n="owned_cap_granted_area" /> of <R n="owned_prev_cap" />
                {" "}
                <R n="area_include_area">includes</R>{" "}
                <R n="owned_new_area" />, and <R n="owned_new_signature" /> is a
                {" "}
                <R n="UserSignature" /> issued by the{" "}
                <R n="owned_prev_receiver" /> over the bytestring{" "}
                <DefValue n="owned_handover" r="handover" />, which is defined
                as follows:
              </P>

              <Ul>
                <Li>
                  If{" "}
                  <AccessStruct field="owned_prev_cap">
                    <R n="owned_prev_cap" />
                  </AccessStruct>{" "}
                  is empty, then <R n="owned_handover" />{" "}
                  is the concatenation of the following bytestrings:

                  <Encoding
                    standalone
                    idPrefix="owned_handover1"
                    bitfields={[]}
                    contents={[
                      <CodeFor enc="encode_area_in_area" isFunction>
                        <AccessStruct field="owned_new_area">
                          <R n="owned_prev_area" />
                        </AccessStruct>
                      </CodeFor>,
                      <CodeFor enc="encode_user_sig" isFunction>
                        <AccessStruct field="owned_cap_initial_authorisation">
                          <R n="owned_prev_cap" />
                        </AccessStruct>
                      </CodeFor>,
                      <CodeFor enc="encode_user_pk" isFunction>
                        <R n="owned_new_user" />
                      </CodeFor>,
                    ]}
                  />
                </Li>
                <Li>
                  Otherwise, let{" "}
                  <DefValue n="owned_prev_signature" r="prev_signature" />{" "}
                  be the <R n="UserSignature" /> in the last triplet of{" "}
                  <AccessStruct field="owned_cap_delegations">
                    <R n="owned_prev_cap" />
                  </AccessStruct>. Then <R n="owned_handover" />{" "}
                  is the concatenation of the following bytestrings:

                  <Encoding
                    standalone
                    idPrefix="owned_handover2"
                    bitfields={[]}
                    contents={[
                      <CodeFor
                        enc="encode_area_in_area"
                        isFunction
                        relativeTo={<R n="owned_prev_area" />}
                      >
                        <R n="owned_new_area" />
                      </CodeFor>,
                      <CodeFor enc="encode_user_sig" isFunction>
                        <R n="owned_prev_signature" />
                      </CodeFor>,
                      <CodeFor enc="encode_user_pk" isFunction>
                        <R n="owned_new_user" />
                      </CodeFor>,
                    ]}
                  />
                </Li>
              </Ul>
            </PreviewScope>
          </Hsection>

          <Hsection
            n="proper_capabilities"
            title="Bringing Everything Together"
          >
            <P>
              <Rsb n="CommunalCapability" /> and <Rs n="OwnedCapability" />{" "}
              are capability types for realising <Rs n="communal_namespace" />
              and <Rs n="owned_namespace" /> respectively. It remains<Marginale>
                If you do not need to support both cases, you can also use one
                of <Rs n="CommunalCapability" /> or <Rs n="OwnedCapability" />
                {" "}
                directly.
              </Marginale>{" "}
              to define a type that unifies both.
            </P>

            <P>
              Crucially, for a given{" "}
              <R n="NamespaceId" />, all its valid capabilities should implement
              either a <R n="communal_namespace" /> or an{" "}
              <R n="owned_namespace" />, but there should be no mixture of
              capabilities. It should be impossible to have people believe they
              work in a{" "}
              <R n="communal_namespace" />, for example, only to later present
              an <R n="OwnedCapability" />{" "}
              that allows you to read or edit all their <Rs n="Entry" />.
            </P>

            <P>
              To ensure a strict distinction between{" "}
              <Rs n="communal_namespace" /> and{" "}
              <Rs n="owned_namespace" />, we rely on the function{" "}
              <R n="is_communal" />{" "}
              that specifies which kinds of capabilities are valid for which
              {" "}
              <Rs n="namespace" />.
            </P>

            <Pseudocode n="mc_capability_definition">
              <StructDef
                comment={
                  <>
                    A Meadowcap capability.
                  </>
                }
                id={[
                  "McCapability",
                  "Capability",
                  "McCapabilities",
                ]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The kind of access this grants.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["inner", "capability_inner"],
                        <ChoiceType
                          types={[
                            <R n="CommunalCapability" />,
                            <R n="OwnedCapability" />,
                          ]}
                        />,
                      ],
                    },
                  },
                ]}
              />
            </Pseudocode>

            <PreviewScope>
              <P>
                A <R n="Capability" /> <DefValue n="cap_cap" r="cap" /> is{" "}
                <Def n="cap_valid" r="valid" /> if either
              </P>
              <Ul>
                <Li>
                  <AccessStruct field="capability_inner">
                    <R n="cap_cap" />
                  </AccessStruct>{" "}
                  is a <R n="communal_cap_valid" /> <R n="CommunalCapability" />
                  {" "}
                  and{" "}
                  <Code>
                    <R n="is_communal" />(<AccessStruct field="communal_cap_namespace">
                      <AccessStruct field="capability_inner">
                        <R n="cap_cap" />
                      </AccessStruct>
                    </AccessStruct>)
                  </Code>{" "}
                  is <Code>true</Code>, or
                </Li>
                <Li>
                  <AccessStruct field="capability_inner">
                    <R n="cap_cap" />
                  </AccessStruct>{" "}
                  is a <R n="owned_cap_valid" /> <R n="OwnedCapability" /> and
                  {" "}
                  <Code>
                    <R n="is_communal" />(<AccessStruct field="owned_cap_namespace">
                      <AccessStruct field="capability_inner">
                        <R n="cap_cap" />
                      </AccessStruct>
                    </AccessStruct>)
                  </Code>{" "}
                  is <Code>false</Code>.
                </Li>
              </Ul>
            </PreviewScope>

            <PreviewScope>
              <P>
                <Def n="cap_mode" r="access mode">Access mode</Def>,{" "}
                <Def n="cap_receiver" r="receiver" />,{" "}
                <Def n="cap_granted_namespace" r="granted namespace" />, and
                {" "}
                <Def n="cap_granted_area" r="granted area" /> of a{" "}
                <R n="Capability" /> <DefValue n="cap_cap2" r="cap" />{" "}
                are those of{" "}
                <AccessStruct field="capability_inner">
                  <R n="cap_cap2" />
                </AccessStruct>.
              </P>
            </PreviewScope>
          </Hsection>
        </Hsection>

        <Hsection n="mc_with_willow" title="Usage With Willow">
          <P>
            We have defined capabilities and their semantics. Now what?
          </P>

          <Hsection n="mc_writing_entries" title="Writing Entries">
            <P>
              <Rsb n="Capability" /> with <R n="cap_mode" />{" "}
              <R n="access_write" /> can be used to control who gets to write
              {" "}
              <Rs n="Entry" /> in which <Rs n="namespace" /> and with which{" "}
              <Rs n="entry_subspace_id" />, <Rs n="entry_path" />, and/or{" "}
              <Rs n="entry_timestamp" />. Intuitively, you authorise writing an
              {" "}
              <R n="Entry" /> by supplying a <R n="Capability" /> that grants
              {" "}
              <R n="access_write" /> <R n="cap_mode">access</R> to the{" "}
              <R n="Entry" /> together with a <R n="dss_signature" /> over the
              {" "}
              <R n="Entry" /> by the <R n="cap_receiver" /> of the{" "}
              <R n="Capability" />.
            </P>

            <P>
              More precisely, Willow verifies <Rs n="Entry" /> via its{" "}
              <R n="AuthorisationToken" /> and <R n="is_authorised_write" />
              {" "}
              parameters. Meadowcap supplies concrete choices of these
              parameters:
            </P>

            <Pseudocode n="mc_auth_token_def">
              <StructDef
                comment={
                  <>
                    To be used as an <R n="AuthorisationToken" /> for Willow.
                  </>
                }
                id={[
                  "MeadowcapAuthorisationToken",
                  "MeadowcapAuthorisationToken",
                  "MeadowcapAuthorisationTokens",
                ]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          Certifies that an <R n="Entry" /> may be written.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["capability", "mcat_cap"],
                        <R n="Capability" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Proves that the <R n="Entry" /> was created by the
                          {" "}
                          <R n="cap_receiver" /> of the <R n="mcat_cap" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["signature", "mcat_sig"],
                        <R n="UserSignature" />,
                      ],
                    },
                  },
                ]}
              />
            </Pseudocode>

            <PreviewScope>
              <P>
                The function <DefFunction n="meadowcap_is_authorised_write" />
                {" "}
                maps an <R n="Entry" /> and a{" "}
                <R n="MeadowcapAuthorisationToken" /> to a{" "}
                <R n="Bool" />. It maps values{" "}
                <DefValue n="mcia_entry" r="entry" /> and{" "}
                <DefValue n="mcia_tok" r="mat" /> to <Code>true</Code>{" "}
                if and only if
              </P>

              <Ul>
                <Li>
                  <AccessStruct field="mcat_cap">
                    <R n="mcia_tok" />
                  </AccessStruct>{" "}
                  is <R n="cap_valid" />,
                </Li>
                <Li>
                  the <R n="cap_mode" /> of{" "}
                  <AccessStruct field="mcat_cap">
                    <R n="mcia_tok" />
                  </AccessStruct>{" "}
                  is <R n="access_write" />,
                </Li>
                <Li>
                  the <R n="cap_granted_area" /> of{" "}
                  <AccessStruct field="mcat_cap">
                    <R n="mcia_tok" />
                  </AccessStruct>{" "}
                  <R n="area_include">includes</R> <R n="mcia_entry" />, and
                </Li>
                <Li>
                  <Code>
                    <R n="user_verify" />(<R n="mcia_receiver" />,{" "}
                    <AccessStruct field="mcat_sig">
                      <R n="mcia_tok" />
                    </AccessStruct>,{" "}
                    <R n="encode_entry" />(<R n="mcia_entry" />))
                  </Code>{" "}
                  is <Code>true</Code>, where{" "}
                  <DefValue n="mcia_receiver" r="receiver" /> is the{" "}
                  <R n="cap_receiver" /> of{" "}
                  <AccessStruct field="mcat_cap">
                    <R n="mcia_tok" />
                  </AccessStruct>.
                </Li>
              </Ul>
            </PreviewScope>

            <P>
              For this definition to make sense, the protocol parameters of
              Meadowcap must be <R n="mc_compatible" />{" "}
              with those of Willow. Further, there must be concrete choices for
              the <Rs n="encoding_function" /> <R n="encode_namespace_id" />,
              {" "}
              <R n="encode_subspace_id" />, and <R n="encode_payload_digest" />
              {" "}
              that determine the exact output of <R n="encode_entry" />.
            </P>
          </Hsection>

          <Hsection n="mc_reading_entries" title="Reading Entries">
            <P>
              Whereas write access control is baked into the Willow data model,
              read access control resides in the replication layer. To manage
              read access via capabilities, all peers must cooperate in sending
              {" "}
              <Rs n="Entry" />{" "}
              only to peers who have presented a valid read capability for the
              {" "}
              <R n="Entry" />.
            </P>

            <P>
              We describe the details in a capability-system-agnostic way{" "}
              <R n="private_interest_overlap">here</R>. To use Meadowcap for
              this approach, simply choose the type of <R n="cap_valid" />{" "}
              <Rs n="Capability" /> with <R n="cap_mode" />{" "}
              <R n="access_read" /> as the <Rs n="read_capability" />.
            </P>
          </Hsection>
        </Hsection>

        <Img
          src={<ResolveAsset asset={["meadowcap", "meadowcap.png"]} />}
          alt={`A Meadowcap emblem: A stylised drawing of two meadowcaps (a type of mushroom), next to a hand-lettered cursive of the word "Meadowcap".`}
        />
      </PageTemplate>
    </File>
  </Dir>
);

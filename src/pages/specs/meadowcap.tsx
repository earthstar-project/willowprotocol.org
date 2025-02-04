import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, Img, Li, P, Ul } from "macromania-html";
import { Hsection } from "macromania-hsection";
import { PreviewScope } from "macromania-previews";
import { Def, R, Rb, Rs } from "macromania-defref";
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
      >
        <P>
          Meadowcap is a capability system for use with Willow. In this
          specification, we assume familiarity with the{" "}
          <R n="data_model">Willow data model</R>.
        </P>

        <Hsection n="meadowcap_overview" title="Overview">
          <P>
            <Alj inline>TODO</Alj>
          </P>

          <PreviewScope>
            <P>
              <Def
                n="communal_namespace"
                r="communal namespace"
                rs="communal namespaces"
              />{" "}
              <Def
                n="owned_namespace"
                r="owned namespace"
                rs="owned namespaces"
              />
            </P>
          </PreviewScope>
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
                preview={
                  <P>
                    A protocol parameter of Meadowcap, the type of{" "}
                    <Rs n="dss_pk" /> of the <R n="user_signature_scheme" />.
                  </P>
                }
              />, and the <Rs n="dss_signature" /> have type{" "}
              <DefType
                n="UserSignature"
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
              <Def n="mc_compatible" r="compatible" /> with Willow if<Alj>
                TODO defref styling is broken in the preview of campatible for
                some reason
              </Alj>
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
                          <Marginale>
                            <Alj inline>fix marginale rendering</Alj>Remember
                            that we assume <R n="SubspaceId" /> and{" "}
                            <R n="UserPublicKey" /> to be the same types.
                          </Marginale>
                          The <R n="subspace" /> <Em>for which</Em> and{" "}
                          <Em>to whom</Em> this grants access.
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
                with more than zero <R n="communal_cap_delegations" />, let TODO
              </P>
            </PreviewScope>
          </Hsection>
        </Hsection>

        {
          /*

        pinformative("For a ", rs("CommunalCapability"), " ", def_value({id: "communal_cap_defvalid", singular: "cap"}), " with more than zero ", r("communal_cap_delegations"), ", let ", code("(", def_value({id: "communal_new_area", singular: "new_area"}), ", ", def_value({id: "communal_new_user", singular: "new_user"}), ", ", def_value({id: "communal_new_signature", singular: "new_signature"}), ")"), "be the final triplet of ", field_access(r("communal_cap_defvalid"), "communal_cap_delegations"), ", and let ", def_value({id: "communal_prev_cap", singular: "prev_cap"}), " be the ", r("CommunalCapability"), " obtained by removing the last triplet from ", field_access(r("communal_cap_defvalid"), "communal_cap_delegations"), ". Denote the  ", r("communal_cap_receiver"), " of ", r("communal_prev_cap"), " as ", def_value({id: "communal_prev_receiver", singular: "prev_receiver"}), ", and the ", r("communal_cap_granted_area"), " of ", r("communal_prev_cap"), " as ", def_value({id: "communal_prev_area", singular: "prev_area"}), "."),

        pinformative("Then ", r("communal_cap_defvalid"), " is ", r("communal_cap_valid"), " if ", r("communal_prev_cap"), " is ", r("communal_cap_valid"), ", the ", r("communal_cap_granted_area"), " of ", r("communal_prev_cap"), " ", rs("area_include_area"), " ", r("communal_new_area"), ", and ", r("communal_new_signature"), " is a ", r("UserSignature"), " issued by the ", r("communal_prev_receiver"), " over the bytestring ", def_value({id: "communal_handover", singular: "handover"}), ", which is defined as follows:"),

        lis(
          [
            "If ", field_access(r("communal_prev_cap"), "communal_cap_delegations"), " is empty, then ", r("communal_handover"), " is the concatenation of the following bytestrings:",
            lis(
              ["the byte ", code("0x00"), " (if ", field_access(r("communal_prev_cap"), "communal_cap_access_mode"), " is ", r("access_read"), ") or the byte ", code("0x01"), " (if ", field_access(r("communal_prev_cap"), "communal_cap_access_mode"), " is ", r("access_write"), "),"],
              [code(function_call(r("encode_namespace_pk"), field_access(r("communal_prev_cap"), "communal_cap_namespace"))), ","],
              [code(function_call(r("encode_area_in_area"), r("communal_new_area"), r("communal_prev_area"))), ","],
              [code(function_call(r("encode_user_pk"), r("communal_new_user"))), "."],
            ),
          ],
          [
            preview_scope("Otherwise, let ", def_value({id: "communal_prev_signature", singular: "prev_signature"}), " be the ", r("UserSignature"), " in the last triplet of ", field_access(r("communal_prev_cap"), "communal_cap_delegations"), "."), " Then ", r("communal_handover"), " is the concatenation of the following bytestrings:",
            lis(
              [code(function_call(r("encode_area_in_area"), r("communal_new_area"), r("communal_prev_area"))), ","],
              [code(function_call(r("encode_user_sig"), r("communal_prev_signature"))), "."],
              [code(function_call(r("encode_user_pk"), r("communal_new_user"))), "."],
            ),
          ],
        ),

      ]),

      hsection("owned_capabilities", "Owned Namespaces", [
        pseudocode(
          new Struct({
              id: "OwnedCapability",
              plural: "OwnedCapabilities",
              comment: ["A capability that implements ", rs("owned_namespace"), "."],
              fields: [
                  {
                      id: "owned_cap_access_mode",
                      name: "access_mode",
                      comment: ["The kind of access this grants."],
                      rhs: pseudo_choices(r("access_read"), r("access_write")),
                  },
                  {
                      id: "owned_cap_namespace",
                      name: "namespace_key",
                      comment: ["The ", r("namespace"), " for which this grants access."],
                      rhs: r("NamespacePublicKey"),
                  },
                  {
                      id: "owned_cap_user",
                      name: "user_key",
                      comment: [
                        pinformative("The user ", em("to whom"), " this grants access; granting access for the full ", r("owned_cap_namespace"), ", not just to a ", r("subspace"), "."),
                      ],
                      rhs: r("UserPublicKey"),
                  },
                  {
                      id: "owned_cap_initial_authorisation",
                      name: "initial_authorisation",
                      comment: [
                        pinformative("Authorisation of the ", r("owned_cap_user"), " by the ", r("owned_cap_namespace"), "."),
                      ],
                      rhs: r("NamespaceSignature"),
                  },
                  {
                      id: "owned_cap_delegations",
                      name: "delegations",
                      comment: ["Successive authorisations of new ", rs("UserPublicKey"), ", each restricted to a particular ", r("Area"), "."],
                      rhs: pseudo_array(pseudo_tuple(r("Area"), r("UserPublicKey"), r("UserSignature"))),
                  },
              ],
          }),
        ),

        pinformative("The ", def({id: "owned_cap_mode", singular: "access mode"}), " of an ", r("OwnedCapability"), " ", def_value({id: "owned_mode_cap", singular: "cap"}), " is ", field_access(r("owned_mode_cap"), "owned_cap_access_mode"), "."),

        pinformative("The ", r("owned_cap_receiver"), " of an ", r("OwnedCapability"), " is the user to whom it grants access. Formally, the ", def({id: "owned_cap_receiver", singular: "receiver"}), " is the final ", r("UserPublicKey"), " in the ", r("owned_cap_delegations"), ", or the ", r("owned_cap_user"), " if the ", r("owned_cap_delegations"), " are empty."),

        pinformative("The ", r("owned_cap_granted_namespace"), " of an ", r("OwnedCapability"), " is the ", r("namespace"), " for which it grants access. Formally, the ", def({id: "owned_cap_granted_namespace", singular: "granted namespace"}), " of an ", r("OwnedCapability"), " is its ", r("owned_cap_namespace"), "."),

        pinformative("The ", r("owned_cap_granted_area"), " of an ", r("OwnedCapability"), " is the ", r("Area"), " for which it grants access. Formally, the ", def({id: "owned_cap_granted_area", singular: "granted area"}), " of an ", r("OwnedCapability"), " is the final ", r("Area"), " in its ", r("owned_cap_delegations"), " if the ", r("owned_cap_delegations"), " are non-empty. Otherwise, it is the ", r("full_area"), "."),

        pinformative(R("owned_cap_valid", "Validity"), " governs how ", rs("OwnedCapability"), " can be delegated and restricted. We define ", def({id: "owned_cap_valid", singular: "valid"}, "validity", [pinformative("An ", r("OwnedCapability"), " is ", def_fake("owned_cap_valid", "valid"), " if its ", r("owned_cap_delegations"), " form a correct chain of ", rs("dss_signature"), " over ", rs("UserPublicKey"), ", and if the ", rs("Area"), " form a chain of containment."), pinformative("For the formal definition, click the reference, the proper definition does not fit into a tooltip.")]), " based on the number of ", r("owned_cap_delegations"), "."),

        pinformative("An ", r("OwnedCapability"), " with zero ", r("owned_cap_delegations"), " is ", r("owned_cap_valid"), " if ", r("owned_cap_initial_authorisation"), " is a ", r("NamespaceSignature"), " issued by the ", r("owned_cap_namespace"), " over either the byte ", code("0x02"), " (if ", r("owned_cap_access_mode"), " is ", r("access_read"), ") or the byte ", code("0x03"), " (if ", r("owned_cap_access_mode"), " is ", r("access_write"), "), followed by the ", r("owned_cap_user"), " (encoded via ", r("encode_user_pk"), ")."),

        pinformative("For an ", rs("OwnedCapability"), " ", def_value({id: "owned_cap_defvalid", singular: "cap"}), " with more than zero ", r("owned_cap_delegations"), ", let ", code("(", def_value({id: "owned_new_area", singular: "new_area"}), ", ", def_value({id: "owned_new_user", singular: "new_user"}), ", ", def_value({id: "owned_new_signature", singular: "new_signature"}), ")"), "be the final triplet of ", field_access(r("owned_cap_defvalid"), "owned_cap_delegations"), ", and let ", def_value({id: "owned_prev_cap", singular: "prev_cap"}), " be the ", r("OwnedCapability"), " obtained by removing the last triplet from ", field_access(r("owned_cap_defvalid"), "owned_cap_delegations"), ". Denote the  ", r("owned_cap_receiver"), " of ", r("owned_prev_cap"), " as ", def_value({id: "owned_prev_receiver", singular: "prev_receiver"}), ", and the ", r("owned_cap_granted_area"), " of ", r("owned_prev_cap"), " as ", def_value({id: "owned_prev_area", singular: "prev_area"}), "."),

        pinformative("Then ", r("owned_cap_defvalid"), " is ", r("owned_cap_valid"), " if ", r("owned_prev_cap"), " is ", r("owned_cap_valid"), ", the ", r("owned_cap_granted_area"), " of ", r("owned_prev_cap"), " ", rs("area_include_area"), " ", r("owned_new_area"), ", and ", r("owned_new_signature"), " is a ", r("UserSignature"), " issued by the ", r("owned_prev_receiver"), " over the bytestring ", def_value({id: "owned_handover", singular: "handover"}), ", which is defined as follows:"),

        lis(
          [
            "If ", field_access(r("owned_prev_cap"), "owned_cap_delegations"), " is empty, then ", r("owned_handover"), " is the concatenation of the following bytestrings:",
            lis(
              [code(function_call(r("encode_area_in_area"), r("owned_new_area"), r("owned_prev_area"))), ","],
              [code(function_call(r("encode_user_sig"), field_access(r("owned_prev_cap"), "owned_cap_initial_authorisation"))), "."],
              [code(function_call(r("encode_user_pk"), r("owned_new_user"))), "."],
            ),
          ],
          [
            preview_scope("Otherwise, let ", def_value({id: "owned_prev_signature", singular: "prev_signature"}), " be the ", r("UserSignature"), " in the last triplet of ", field_access(r("owned_prev_cap"), "owned_cap_delegations"), "."), " Then ", r("owned_handover"), " is the concatenation of the following bytestrings:",
            lis(
              [code(function_call(r("encode_area_in_area"), r("owned_new_area"), r("owned_prev_area"))), ","],
              [code(function_call(r("encode_user_sig"), r("owned_prev_signature"))), "."],
              [code(function_call(r("encode_user_pk"), r("owned_new_user"))), "."],
            ),
          ],
        ),

          */
        }

        <Img
          src={<ResolveAsset asset={["meadowcap", "meadowcap.png"]} />}
          alt={`A Meadowcap emblem: A stylised drawing of two meadowcaps (a type of mushroom), next to a hand-lettered cursive of the word "Meadowcap".`}
        />
      </PageTemplate>
    </File>
  </Dir>
);
